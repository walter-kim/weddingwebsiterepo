/* ==========================================================================
   Kimberly & Walter — Invitation gate

   Two steps, both required:
   1. The invitation password. guests-data.js holds the guest list encrypted
      with it (see tools/build-guests.py), so the right password is simply
      the one that unlocks the list.
   2. The guest's full name. We show the matching invitation (and who else is
      in their party) and the guest confirms "Yes, that's me".

   The confirmed guest and their party are remembered in this browser. The
   RSVP form uses the party size to decide how many people they can bring.
   Not cryptographic-grade security, but the list isn't readable without
   the password.
   ========================================================================== */

(function () {
  "use strict";

  // v2: the old name-only unlock is retired, so everyone signs in again once.
  var UNLOCK_KEY = "kw-wedding-unlocked-v2";
  var IDENTITY_KEY = "kw-wedding-guest-v2";
  var COUPLE_EMAIL = "kimkimchinv@gmail.com";

  function normalize(value) {
    return String(value || "")
      .replace(/[‘’‚′]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function compactName(value) {
    return normalize(value).replace(/[^a-z0-9\u0080-￿]+/gi, "");
  }

  function nameTokens(value) {
    return normalize(value)
      .replace(/['']/g, "")
      .split(/[^a-z0-9\u0080-￿]+/i)
      .filter(Boolean);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function t(key, vars, fallback) {
    if (window.I18N && I18N.t) {
      var val = I18N.t(key, vars);
      if (val && val !== key) return val;
    }
    return fallback || key;
  }

  /* ---------- Remembered sign-in ---------- */

  function readIdentity() {
    try {
      var parsed = JSON.parse(localStorage.getItem(IDENTITY_KEY) || "null");
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  function isUnlocked() {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1" && !!readIdentity();
    } catch (e) {
      return false;
    }
  }

  function rememberIdentity(identity) {
    try {
      localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
      localStorage.setItem(UNLOCK_KEY, "1");
    } catch (e) { /* private mode etc. */ }
  }

  function signOut() {
    try {
      localStorage.removeItem(UNLOCK_KEY);
      localStorage.removeItem(IDENTITY_KEY);
    } catch (e) { /* private mode etc. */ }
    location.reload();
  }

  /* ---------- Unsealing the guest list ---------- */

  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // Forgiving form of the typed password: full-width letters from Asian
  // keyboards become plain ones, and spaces ("Golden Gate") are dropped.
  function passwordKey(value) {
    var s = String(value || "");
    if (s.normalize) s = s.normalize("NFKC");
    return s.replace(/\s+/g, "").toLowerCase();
  }

  function canUnseal() {
    return !!(window.crypto && crypto.subtle && window.TextEncoder);
  }

  // Resolves to the guest array, or null when the password is wrong.
  function unseal(password) {
    var sealed = window.WEDDING_GUESTS_SEALED;
    if (!sealed || !canUnseal()) return Promise.resolve(null);
    var enc = new TextEncoder();
    return crypto.subtle.importKey("raw", enc.encode(passwordKey(password)), "PBKDF2", false, ["deriveKey"])
      .then(function (base) {
        return crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: b64ToBytes(sealed.salt), iterations: sealed.iter, hash: "SHA-256" },
          base,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
      })
      .then(function (key) {
        return crypto.subtle.decrypt({ name: "AES-GCM", iv: b64ToBytes(sealed.iv) }, key, b64ToBytes(sealed.data));
      })
      .then(function (plain) {
        return JSON.parse(new TextDecoder().decode(plain));
      })
      .catch(function () { return null; });
  }

  /* ---------- Finding the guest ---------- */

  function displayName(g) {
    return g.r || g.n;
  }

  /**
   * Full-name lookup against the list name ("n") and real name ("r").
   * Placeholder rows ("Wade's wife") can't be signed in with.
   * Returns an array of matching guests (empty when none).
   */
  function findGuests(guests, rawInput) {
    var input = normalize(rawInput);
    if (!input) return [];
    var pool = guests.filter(function (g) { return !g.x; });
    var keysOf = function (g) { return [g.n, g.r, g.e].filter(Boolean); };

    var exact = pool.filter(function (g) {
      return keysOf(g).some(function (k) {
        return normalize(k) === input || compactName(k) === compactName(input);
      });
    });
    if (exact.length) return exact;

    // Word-by-word match on the full name we have: the real name when the
    // list has one ("Luben Raytchev", in any order), otherwise the list name
    // ("Thomas Lee" finds "Thomas" when that's all the list knows).
    var q = nameTokens(input);
    if (!q.length) return [];
    var allIn = function (a, b) {
      return a.every(function (tok) { return b.indexOf(tok) !== -1; });
    };
    return pool.filter(function (g) {
      var parts = nameTokens(g.r || g.n);
      if (!parts.length) return false;
      return allIn(parts, q) || (parts.length > 1 && allIn(q, parts));
    });
  }

  // Guests sign in with their full name, not just a first name. A name in
  // Chinese, Japanese or Korean characters is complete on its own.
  function isFullName(raw) {
    var input = normalize(raw);
    if (input.indexOf("@") !== -1) return true;
    if (/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(input)) return true;
    return nameTokens(input).length >= 2;
  }

  function partyOf(guests, guest) {
    return guests.filter(function (g) { return g.p === guest.p; });
  }

  function buildIdentity(guests, guest) {
    var party = partyOf(guests, guest);
    return {
      name: displayName(guest),
      listName: guest.n,
      email: guest.e || "",
      party: guest.p,
      size: party.length,
      events: !!guest.ev, // party is invited to the welcome dinner / brunch
      // Everyone else on the invitation; null = unnamed guest (placeholder row).
      others: party.filter(function (g) { return g !== guest; }).map(function (g) {
        return g.x ? null : displayName(g);
      })
    };
  }

  function partySummary(identity) {
    if (identity.size <= 1) return t("gate.partyOne", null, "Your invitation is for you.");
    var guestWord = t("gate.guest", null, "a guest");
    var names = [identity.name].concat(identity.others.map(function (n) { return n || guestWord; }));
    return t("gate.partyMany", { count: identity.size, names: names.join(", ") },
      "Your invitation is for " + identity.size + " people: " + names.join(", ") + ".");
  }

  window.WeddingGate = {
    isUnlocked: isUnlocked,
    getIdentity: readIdentity,
    partySummary: partySummary,
    signOut: signOut
  };

  if (!isUnlocked()) {
    document.documentElement.classList.add("is-locked");
  }

  /* ---------- Lock screen ---------- */

  function buildGate() {
    if (isUnlocked()) return;
    if (document.querySelector(".invite-gate")) return;

    var guests = null;     // filled once the password is right
    var lastError = null;  // { key, vars } so a language switch re-translates it

    var gate = document.createElement("div");
    gate.className = "invite-gate";
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-modal", "true");
    gate.setAttribute("aria-labelledby", "invite-title");
    gate.innerHTML =
      '<div class="lang-bar invite-gate__langs" role="group" aria-label="Language" data-i18n-aria-label="lang.label">' +
        '<div class="lang-bar__inner">' +
          '<button type="button" class="lang-bar__btn" data-lang="en" lang="en">English</button>' +
          '<button type="button" class="lang-bar__btn" data-lang="ja" lang="ja">日本語</button>' +
          '<button type="button" class="lang-bar__btn" data-lang="zh" lang="zh-Hant">繁體中文</button>' +
          '<button type="button" class="lang-bar__btn" data-lang="ko" lang="ko">한국어</button>' +
        "</div>" +
      "</div>" +
      '<div class="invite-gate__card">' +
        '<h1 class="invite-gate__names" id="invite-title" data-i18n="gate.names">Kimberly &amp; Walter</h1>' +

        // Step 1: password
        '<form class="invite-gate__form" id="invite-form" autocomplete="off">' +
          '<p class="invite-gate__lead" data-i18n="gate.lead">This page is for our invited guests. Please enter the invitation password.</p>' +
          '<label for="invite-password" data-i18n="gate.label">Invitation password</label>' +
          '<input type="password" id="invite-password" name="password" autocapitalize="off" autocorrect="off" spellcheck="false" required>' +
          '<button class="button button--primary" type="submit" data-i18n="gate.submit">Enter</button>' +
        "</form>" +

        // Step 2: full name
        '<form class="invite-gate__form" id="invite-name-form" autocomplete="on" hidden>' +
          '<p class="invite-gate__lead" data-i18n="gate.nameLead">Thank you! Now please enter your full name.</p>' +
          '<label for="invite-name" data-i18n="gate.nameLabel">Your full name</label>' +
          '<input type="text" id="invite-name" name="name" autocomplete="name" spellcheck="false" required>' +
          '<button class="button button--primary" type="submit" data-i18n="gate.nameSubmit">Find my invitation</button>' +
        "</form>" +

        // Step 3: confirm (or choose between a few matches)
        '<div class="invite-gate__confirm" id="invite-confirm" hidden></div>' +

        '<p class="invite-gate__error" id="invite-error" role="alert" hidden></p>' +
      "</div>";

    document.body.appendChild(gate);

    var pwForm = document.getElementById("invite-form");
    var pwInput = document.getElementById("invite-password");
    var nameForm = document.getElementById("invite-name-form");
    var nameInput = document.getElementById("invite-name");
    var confirmBox = document.getElementById("invite-confirm");
    var error = document.getElementById("invite-error");
    var renderConfirm = null; // re-renders step 3 after a language switch

    function showError(key, vars, fallback) {
      lastError = { key: key, vars: vars, fallback: fallback };
      error.innerHTML = t(key, vars, fallback);
      error.hidden = false;
    }
    function clearError() {
      lastError = null;
      error.hidden = true;
      error.textContent = "";
    }

    function showStep(step) {
      pwForm.hidden = step !== "password";
      nameForm.hidden = step !== "name";
      confirmBox.hidden = step !== "confirm";
      if (step !== "confirm") renderConfirm = null;
      if (step === "password") pwInput.focus();
      if (step === "name") { nameInput.focus(); nameInput.select(); }
    }

    function finishUnlock(identity) {
      rememberIdentity(identity);
      document.documentElement.classList.remove("is-locked");
      gate.remove();
      try {
        document.dispatchEvent(new CustomEvent("wedding:unlocked", { detail: identity }));
      } catch (err) { /* older browsers */ }
    }

    pwForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearError();
      var button = pwForm.querySelector("button");
      button.disabled = true;
      unseal(pwInput.value).then(function (list) {
        button.disabled = false;
        if (!list) {
          if (!canUnseal()) {
            showError("gate.unsupported", null, "This browser can’t open the guest list. Please open teamkimkim.com in Safari or Chrome.");
          } else if (/[^\x00-\x7f]/.test(passwordKey(pwInput.value))) {
            showError("gate.keyboard", null, "That password isn’t right. Please switch your keyboard to English (ABC) and try again.");
          } else {
            showError("gate.error", null, "That password isn’t right. Please check your invitation and try again.");
          }
          pwInput.focus();
          pwInput.select();
          return;
        }
        guests = list;
        showStep("name");
      });
    });

    nameForm.addEventListener("submit", function (e) {
      e.preventDefault();
      clearError();
      if (!isFullName(nameInput.value)) {
        showError("gate.fullName", null, "Please enter your full name (first and last name).");
        nameInput.focus();
        return;
      }
      var hits = findGuests(guests, nameInput.value);
      if (!hits.length) {
        showError("gate.notFound", { email: escapeHtml(COUPLE_EMAIL) },
          "We couldn’t find that name on our guest list. Try the name we’d know you by, or email us at " + COUPLE_EMAIL + ".");
        nameInput.focus();
        return;
      }
      if (hits.length > 5) {
        showError("gate.tooMany", null, "More than one guest has that name. Please enter your full name (first and last).");
        nameInput.focus();
        return;
      }
      renderConfirm = function () { drawConfirm(hits); };
      renderConfirm();
      showStep("confirm");
    });

    function drawConfirm(hits) {
      var html = "";
      if (hits.length === 1) {
        var identity = buildIdentity(guests, hits[0]);
        html += '<p class="invite-gate__lead"><strong>'
          + escapeHtml(t("gate.confirmTitle", { name: identity.name }, "Welcome, " + identity.name + "!"))
          + "</strong></p>";
        html += '<p class="invite-gate__party">' + escapeHtml(partySummary(identity)) + "</p>";
        html += '<div class="invite-gate__actions">'
          + '<button type="button" class="button button--primary" data-gate-pick="0">'
          + escapeHtml(t("gate.yes", null, "Yes, that’s me")) + "</button>"
          + '<button type="button" class="button button--secondary" data-gate-back>'
          + escapeHtml(t("gate.no", null, "That’s not me")) + "</button></div>";
      } else {
        html += '<p class="invite-gate__lead">' + escapeHtml(t("gate.choose", null, "A few guests match. Which one is you?")) + "</p>";
        html += '<div class="invite-gate__choices">';
        hits.forEach(function (g, i) {
          var id = buildIdentity(guests, g);
          html += '<button type="button" class="button button--secondary invite-gate__choice" data-gate-pick="' + i + '">'
            + "<strong>" + escapeHtml(id.name) + "</strong><span>" + escapeHtml(partySummary(id)) + "</span></button>";
        });
        html += '</div><p><button type="button" class="invite-gate__link" data-gate-back>'
          + escapeHtml(t("gate.no", null, "That’s not me")) + "</button></p>";
      }
      confirmBox.innerHTML = html;
      confirmBox.onclick = function (e) {
        var pick = e.target.closest("[data-gate-pick]");
        if (pick) {
          finishUnlock(buildIdentity(guests, hits[Number(pick.getAttribute("data-gate-pick"))]));
          return;
        }
        if (e.target.closest("[data-gate-back]")) {
          clearError();
          showStep("name");
        }
      };
    }

    document.addEventListener("i18n:change", function () {
      if (lastError) error.innerHTML = t(lastError.key, lastError.vars, lastError.fallback);
      if (renderConfirm) renderConfirm();
    });

    // Apply language after i18n.js is ready (gate loads earlier, in <head>).
    function syncLanguage() {
      if (window.I18N && I18N.apply) {
        I18N.apply(I18N.current);
        return true;
      }
      return false;
    }
    if (!syncLanguage()) {
      var tries = 0;
      var timer = setInterval(function () {
        if (syncLanguage() || ++tries > 80) clearInterval(timer);
      }, 25);
    }

    showStep("password");
  }

  if (isUnlocked()) return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildGate);
  } else {
    buildGate();
  }
})();
