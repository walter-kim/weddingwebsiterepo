/* ==========================================================================
   Kimberly & Walter — Invitation gate

   This is a polite lock screen, not cryptographic security. Anyone can
   still open this file and read the code. That is enough to keep the site
   invitation-only for guests.

   >>> THE THING YOU NEED TO EDIT IS RIGHT HERE: <<<
   This is the word printed on the invitations. Matching is case-insensitive.
   ========================================================================== */

var INVITE_CODE = "goldengate";

/* ========================================================================== */

(function () {
  "use strict";

  var STORAGE_KEY = "kw-wedding-unlocked";

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function isUnlocked() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function rememberUnlock() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (e) { /* private mode etc. */ }
  }

  function t(key, fallback) {
    if (window.I18N && I18N.t) {
      var val = I18N.t(key);
      if (val && val !== key) return val;
    }
    return fallback;
  }

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
        '<p class="eyebrow" data-i18n="gate.eyebrow">Invitation</p>' +
        '<h1 class="invite-gate__names" id="invite-title" data-i18n="gate.names">Kimberly &amp; Walter</h1>' +
        '<p class="invite-gate__lead" data-i18n="gate.lead">This page is for our invited guests. Please enter the word printed on your invitation.</p>' +
        '<form class="invite-gate__form" id="invite-form" autocomplete="off">' +
          '<label for="invite-code" data-i18n="gate.label">Invitation code</label>' +
          '<input type="password" id="invite-code" name="invite" inputmode="text" autocapitalize="none" spellcheck="false" required>' +
          '<button class="button button--primary" type="submit" data-i18n="gate.submit">Enter</button>' +
          '<p class="invite-gate__error" id="invite-error" role="alert" hidden data-i18n="gate.error">That code doesn’t match. Please try again.</p>' +
        "</form>" +
      "</div>";

    document.body.appendChild(gate);

    if (window.I18N && I18N.apply) {
      I18N.apply(I18N.current);
      gate.querySelectorAll(".lang-bar__btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          I18N.apply(btn.getAttribute("data-lang"));
        });
      });
    }

    var form = document.getElementById("invite-form");
    var input = document.getElementById("invite-code");
    var error = document.getElementById("invite-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (normalize(input.value) === normalize(INVITE_CODE)) {
        rememberUnlock();
        document.documentElement.classList.remove("is-locked");
        gate.remove();
        return;
      }
      error.hidden = false;
      input.value = "";
      input.focus();
    });

    document.addEventListener("i18n:change", function () {
      if (!error.hidden && window.I18N && I18N.t) {
        error.textContent = I18N.t("gate.error");
      }
    });

    input.focus();
  }

  if (isUnlocked()) return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildGate);
  } else {
    buildGate();
  }
})();
