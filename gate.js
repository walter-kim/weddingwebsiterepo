/* ==========================================================================
   Kimberly & Walter — Invitation gate

   Polite lock screen (not cryptographic). Guests unlock with either:
   1. The shared invitation word (INVITE_CODE) — for first-time RSVP, no identity.
   2. Their name or email from the guest allowlist in guests-data.js.

   Eligibility (see build-guests.py): anyone named on the Guest List may enter,
   including RSVP blank / not-yet. Only clear declines (No / Declined / …) are
   excluded. Name/email unlock stores identity for later tier personalization;
   site content is the same for everyone for now.
   ========================================================================== */

(function () {
  "use strict";

  // Shared invitation word (case-insensitive). Same field also accepts name/email.
  var INVITE_CODE = "goldengate";

  var UNLOCK_KEY = "kw-wedding-unlocked";
  var IDENTITY_KEY = "kw-wedding-guest";

  function normalize(value) {
    return String(value || "")
      .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function compactName(value) {
    return normalize(value).replace(/[^a-z0-9\u0080-\uffff]+/gi, "");
  }

  function nameTokens(value) {
    return normalize(value)
      .replace(/['']/g, "")
      .split(/[^a-z0-9\u0080-\uffff]+/i)
      .filter(Boolean);
  }

  function looksLikeEmail(value) {
    return value.indexOf("@") !== -1;
  }

  function guestList() {
    return Array.isArray(window.WEDDING_GUESTS) ? window.WEDDING_GUESTS : [];
  }

  function isUnlocked() {
    try {
      return localStorage.getItem(UNLOCK_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function readIdentity() {
    try {
      var raw = localStorage.getItem(IDENTITY_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function rememberUnlock(guest) {
    try {
      localStorage.setItem(UNLOCK_KEY, "1");
      if (guest) {
        localStorage.setItem(
          IDENTITY_KEY,
          JSON.stringify({
            name: guest.n || "",
            email: guest.e || "",
            tier: guest.t == null ? null : guest.t
          })
        );
      }
    } catch (e) { /* private mode etc. */ }
  }

  function t(key, fallback) {
    if (window.I18N && I18N.t) {
      var val = I18N.t(key);
      if (val && val !== key) return val;
    }
    return fallback;
  }

  /**
   * Match guest input against the allowlist.
   * - Email: case-insensitive exact match on stored email.
   * - Name: case-insensitive trim; full-name match; compact (punctuation-stripped)
   *   match; unique first-token or unique last-token when the query is one word;
   *   multi-word query may match when all tokens appear in order in the guest name.
   * Returns { guest }, { ambiguous: true }, or null.
   */
  function findGuest(rawInput) {
    var input = normalize(rawInput);
    if (!input) return null;

    var guests = guestList();
    if (!guests.length) return null;

    if (looksLikeEmail(input)) {
      var emailHits = guests.filter(function (g) {
        return g.e && normalize(g.e) === input;
      });
      if (emailHits.length === 1) return { guest: emailHits[0] };
      if (emailHits.length > 1) return { ambiguous: true };
      return null;
    }

    var exact = guests.filter(function (g) {
      return normalize(g.n) === input;
    });
    if (exact.length === 1) return { guest: exact[0] };
    if (exact.length > 1) return { ambiguous: true };

    var inputCompact = compactName(input);
    if (inputCompact) {
      var compactHits = guests.filter(function (g) {
        return compactName(g.n) === inputCompact;
      });
      if (compactHits.length === 1) return { guest: compactHits[0] };
      if (compactHits.length > 1) return { ambiguous: true };
    }

    var qTokens = nameTokens(input);
    if (!qTokens.length) return null;

    if (qTokens.length === 1) {
      var token = qTokens[0];
      var firstHits = guests.filter(function (g) {
        var parts = nameTokens(g.n);
        return parts.length && parts[0] === token;
      });
      if (firstHits.length === 1) return { guest: firstHits[0] };
      if (firstHits.length > 1) return { ambiguous: true };

      var lastHits = guests.filter(function (g) {
        var parts = nameTokens(g.n);
        return parts.length > 1 && parts[parts.length - 1] === token;
      });
      if (lastHits.length === 1) return { guest: lastHits[0] };
      if (lastHits.length > 1) return { ambiguous: true };
      return null;
    }

    var orderedHits = guests.filter(function (g) {
      var parts = nameTokens(g.n);
      if (parts.length < qTokens.length) return false;
      var i = 0;
      for (var p = 0; p < parts.length && i < qTokens.length; p++) {
        if (parts[p] === qTokens[i]) i++;
      }
      return i === qTokens.length;
    });
    if (orderedHits.length === 1) return { guest: orderedHits[0] };
    if (orderedHits.length > 1) return { ambiguous: true };
    return null;
  }

  window.WeddingGate = {
    isUnlocked: isUnlocked,
    getIdentity: readIdentity,
    findGuest: findGuest
  };

  if (!isUnlocked()) {
    document.documentElement.classList.add("is-locked");
  }

  function buildGate() {
    if (isUnlocked()) return;
    if (document.querySelector(".invite-gate")) return;

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
        '<p class="invite-gate__lead" data-i18n="gate.lead">This page is for our invited guests. Enter the invitation word, or your name (or email when we have it).</p>' +
        '<form class="invite-gate__form" id="invite-form" autocomplete="on">' +
          '<label for="invite-identity" data-i18n="gate.label">Invitation word, name, or email</label>' +
          '<input type="text" id="invite-identity" name="identity" inputmode="text" autocapitalize="off" spellcheck="false" autocomplete="off" required>' +
          '<button class="button button--primary" type="submit" data-i18n="gate.submit">Enter</button>' +
          '<p class="invite-gate__error" id="invite-error" role="alert" hidden></p>' +
        "</form>" +
      "</div>";

    document.body.appendChild(gate);

    var form = document.getElementById("invite-form");
    var input = document.getElementById("invite-identity");
    var error = document.getElementById("invite-error");
    var lastErrorKey = "gate.error";

    function showError(key, fallback) {
      lastErrorKey = key;
      error.textContent = t(key, fallback);
      error.hidden = false;
    }

    function finishUnlock(guest) {
      rememberUnlock(guest || null);
      document.documentElement.classList.remove("is-locked");
      gate.remove();
      try {
        document.dispatchEvent(new CustomEvent("wedding:unlocked"));
      } catch (err) { /* older browsers */ }
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var raw = input.value;

      // Path 1: shared invitation word (no identity stored).
      if (normalize(raw) === normalize(INVITE_CODE)) {
        finishUnlock(null);
        return;
      }

      // Path 2: guest-list name or email (stores identity for RSVP prefill / tier).
      var result = findGuest(raw);
      if (result && result.guest) {
        finishUnlock(result.guest);
        return;
      }
      if (result && result.ambiguous) {
        showError(
          "gate.errorAmbiguous",
          "Several guests match that. Please enter your full name as on the invitation."
        );
      } else {
        showError(
          "gate.error",
          "That doesn’t match the invitation word or a name/email on our guest list. Please try again."
        );
      }
      input.focus();
      input.select();
    });

    document.addEventListener("i18n:change", function () {
      if (!error.hidden && window.I18N && I18N.t) {
        error.textContent = I18N.t(lastErrorKey);
      }
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

    input.focus();
  }

  if (isUnlocked()) return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildGate);
  } else {
    buildGate();
  }
})();
