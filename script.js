/* ==========================================================================
   Kimberly & Walter — Wedding Website
   RSVP form handling + small UI helpers.

   >>> THE THINGS YOU NEED TO EDIT ARE RIGHT HERE: <<<
   ========================================================================== */

// 1) Google Sheets endpoint (Apps Script web app URL).
//    See Wedding RSVP/google-apps-script/SETUP.md — paste the /exec URL here:
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbyeMLPDdG60ww8Vr1k2o5uH7-X-mGylXGfCnLQ6Y0I0_I_ZkFe61H_sN9uzXN_u16q6DA/exec";

// 2) Fallback email if Sheets isn’t configured or the network request fails.
const COUPLE_EMAIL = "kimkimchinv@gmail.com";

// 3) Optional private GitHub log (couple bookmark).
const RSVP_LOG_URL = "https://github.com/walter-kim/wedding-rsvp";

const FORM_ENDPOINT = SHEETS_ENDPOINT;
const CONTACT_FORM_ENDPOINT = SHEETS_ENDPOINT;

/* ========================================================================== */

(function () {
  "use strict";

  /* ---------- Translations (see i18n.js) ---------- */
  // t("key") returns the text for the language currently chosen in the
  // language bar, falling back to English.
  var t = (window.I18N && I18N.t) || function (key) { return key; };

  /* ---------- Submit helpers ---------- */
  function publicFields(data) {
    var out = {};
    Object.keys(data).forEach(function (key) {
      if (key.charAt(0) === "_") return;
      if (data[key] === undefined || data[key] === null || data[key] === "") return;
      out[key] = data[key];
    });
    return out;
  }

  function mailtoWithBody(data, subject) {
    var body = Object.keys(publicFields(data))
      .map(function (k) { return k + ": " + data[k]; })
      .join("\n");
    return "mailto:" + COUPLE_EMAIL
      + "?subject=" + encodeURIComponent(subject || t("js.mailSubject"))
      + "&body=" + encodeURIComponent(body);
  }

  function postToSheet(data) {
    var payload = publicFields(data);
    // Map RSVP fields to sheet column names
    if (payload["Number of guests (including yourself)"] != null) {
      payload["Guest count"] = payload["Number of guests (including yourself)"];
      delete payload["Number of guests (including yourself)"];
    }
    // Not stored in the sheet
    delete payload["Language used"];
    delete payload["Log in"];
    delete payload["Received at"];

    // text/plain avoids a CORS preflight; Apps Script still reads JSON from the body.
    return fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (!res.ok || json.ok === false) {
          throw new Error((json && json.error) || ("Server responded with " + res.status));
        }
        return json;
      });
    });
  }

  /* ---------- Mail links ---------- */
  function mailSubject() { return encodeURIComponent(t("js.mailSubject")); }
  function mailHref() { return "mailto:" + COUPLE_EMAIL + "?subject=" + mailSubject(); }
  function updateMailLinks() {
    ["mailto-link", "footer-mailto"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.setAttribute("href", mailHref());
      if (id === "footer-mailto") el.textContent = COUPLE_EMAIL;
    });
  }
  updateMailLinks();
  document.addEventListener("i18n:change", updateMailLinks);

  /* Cross-page hash links (e.g. contact.html → index.html#schedule)
     should land on the section after the page finishes loading. */
  function scrollToHash() {
    var id = (location.hash || "").replace(/^#/, "");
    if (!id) return;
    var target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
  }
  if (document.readyState === "complete") scrollToHash();
  else window.addEventListener("load", scrollToHash);
  window.addEventListener("hashchange", scrollToHash);

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // On mobile, close the menu first and then scroll, so the page lands on
    // the right spot after the header shrinks back to its normal height.
    menu.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link || !menu.classList.contains("is-open")) return;
      var href = link.getAttribute("href") || "";
      var target = href.charAt(0) === "#" ? document.querySelector(href) : null;
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (target) {
        e.preventDefault();
        window.requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (history.pushState) history.pushState(null, "", href);
        });
      }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function setError(fieldEl, message) {
    if (!fieldEl) return;
    fieldEl.classList.add("is-invalid");
    var err = fieldEl.querySelector(".field__error");
    if (err) err.textContent = message;
  }
  function clearError(fieldEl) {
    if (!fieldEl) return;
    fieldEl.classList.remove("is-invalid");
    var err = fieldEl.querySelector(".field__error");
    if (err) err.textContent = "";
  }

  function isHttpEndpoint(url) {
    return !!url && url.indexOf("http") === 0;
  }

  /* ---------- Contact / questions form ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    var contactStatus = document.getElementById("contact-status");
    var contactSubmit = document.getElementById("contact-submit");
    var contactMailto = document.getElementById("contact-mailto");
    var contactName = contactForm.elements.name;
    var contactEmail = contactForm.elements.email;
    var contactMessage = contactForm.elements.message;

    function contactMailSubject() {
      return encodeURIComponent(t("js.contactMailSubject"));
    }

    function contactMailBody() {
      var name = (contactName.value || "").trim();
      var email = (contactEmail.value || "").trim();
      var question = (contactMessage.value || "").trim();
      var lines = [];
      if (name) lines.push("Name: " + name);
      if (email) lines.push("Email: " + email);
      if (question) {
        if (lines.length) lines.push("");
        lines.push("Question:");
        lines.push(question);
      }
      return encodeURIComponent(lines.join("\n"));
    }

    function contactMailHref() {
      var href = "mailto:" + COUPLE_EMAIL + "?subject=" + contactMailSubject();
      var body = contactMailBody();
      if (body) href += "&body=" + body;
      return href;
    }

    function updateContactMailto() {
      if (contactMailto) contactMailto.setAttribute("href", contactMailHref());
    }

    function showContactStatus(kind, html) {
      contactStatus.className = "form-status form-status--" + kind;
      contactStatus.innerHTML = html;
      contactStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function validateContact() {
      var firstInvalid = null;
      function fail(fieldEl, msg) {
        setError(fieldEl, msg);
        if (!firstInvalid) firstInvalid = fieldEl;
      }

      if (!contactName.value.trim()) {
        fail(contactName.closest(".field"), t("js.errName"));
      } else {
        clearError(contactName.closest(".field"));
      }

      var emailValue = contactEmail.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
      if (!emailValue) {
        fail(contactEmail.closest(".field"), t("js.errEmailEmpty"));
      } else if (!emailOk) {
        fail(contactEmail.closest(".field"), t("js.errEmailInvalid"));
      } else {
        clearError(contactEmail.closest(".field"));
      }

      if (!contactMessage.value.trim()) {
        fail(contactMessage.closest(".field"), t("js.errMessage"));
      } else {
        clearError(contactMessage.closest(".field"));
      }

      if (firstInvalid) {
        var focusable = firstInvalid.querySelector("input, select, textarea");
        if (focusable) focusable.focus();
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      return true;
    }

    function collectContactData() {
      var data = {
        "Form": "Wedding Question",
        "Guest name": contactName.value.trim(),
        "Email": contactEmail.value.trim(),
        "Message": contactMessage.value.trim()
      };
      data._subject = "Question about Kim & Walter's wedding — " + data["Guest name"];
      data["Language used"] = (window.I18N && I18N.current) || "en";
      return data;
    }

    contactForm.addEventListener("input", function (e) {
      var fieldEl = e.target.closest(".field");
      if (fieldEl && fieldEl.classList.contains("is-invalid")) clearError(fieldEl);
      updateContactMailto();
    });
    updateContactMailto();
    document.addEventListener("i18n:change", updateContactMailto);

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      contactStatus.className = "form-status";
      contactStatus.innerHTML = "";

      if (!validateContact()) {
        showContactStatus("error", t("js.errSummary"));
        updateContactMailto();
        return;
      }

      var data = collectContactData();
      updateContactMailto();
      var mailto = mailtoWithBody(data, data._subject);

      if (!SHEETS_ENDPOINT) {
        window.location.href = mailto;
        showContactStatus("info", t("js.contactNotConfigured", { href: mailto }));
        return;
      }

      contactSubmit.disabled = true;
      contactSubmit.textContent = t("js.sending");

      postToSheet(data)
        .then(function () {
          contactForm.classList.add("is-sent");
          showContactStatus("success", t("js.contactSuccess", {
            name: escapeHtml(data["Guest name"])
          }));
        })
        .catch(function (err) {
          showContactStatus("error", t("js.contactFail", {
            detail: err && err.message ? " (" + escapeHtml(err.message) + ")" : "",
            href: mailto
          }));
        })
        .finally(function () {
          contactSubmit.disabled = false;
          contactSubmit.textContent = t("contact.submit");
        });
    });
  }

  /* ---------- RSVP form ---------- */
  var form = document.getElementById("rsvp-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submitButton = document.getElementById("submit-button");
  var attendingDetails = document.getElementById("attending-details");
  var guestsSelect = document.getElementById("guests");
  var plusOneField = document.getElementById("plus-one-field");
  var plusOneInput = document.getElementById("plus_one");
  var dietaryOtherField = document.getElementById("dietary-other-field");

  function attendingValue() {
    var checked = form.querySelector('input[name="attending"]:checked');
    return checked ? checked.value : "";
  }
  function isAttending() {
    return attendingValue() === "Joyfully accepts";
  }

  // Show/hide the "attending only" details.
  function updateAttendingDetails() {
    var show = attendingValue() === "" || isAttending();
    attendingDetails.hidden = !show;
  }

  // Show the plus-one name box only when 2 guests are selected.
  function updatePlusOne() {
    var show = guestsSelect.value === "2";
    plusOneField.hidden = !show;
    if (!show) {
      plusOneInput.value = "";
      clearError(plusOneField);
    }
  }

  // Show "tell us more" only when "Other" dietary is ticked.
  function updateDietaryOther() {
    var other = form.querySelector('input[name="dietary"][value="Other"]');
    dietaryOtherField.hidden = !(other && other.checked);
  }

  // Ticking "None" clears the others, and vice-versa.
  function handleDietaryExclusive(e) {
    var boxes = form.querySelectorAll('input[name="dietary"]');
    if (e.target.value === "None" && e.target.checked) {
      boxes.forEach(function (b) { if (b.value !== "None") b.checked = false; });
    } else if (e.target.checked) {
      var none = form.querySelector('input[name="dietary"][value="None"]');
      if (none) none.checked = false;
    }
    updateDietaryOther();
  }

  // "Not available" for extra events clears the two event boxes.
  function handleEventsExclusive(e) {
    var boxes = form.querySelectorAll('input[name="events"]');
    if (e.target.value === "Not available" && e.target.checked) {
      boxes.forEach(function (b) { if (b.value !== "Not available") b.checked = false; });
    } else if (e.target.checked) {
      var na = form.querySelector('input[name="events"][value="Not available"]');
      if (na) na.checked = false;
    }
  }

  form.querySelectorAll('input[name="attending"]').forEach(function (r) {
    r.addEventListener("change", function () {
      updateAttendingDetails();
      clearError(r.closest(".field"));
    });
  });
  guestsSelect.addEventListener("change", updatePlusOne);
  form.querySelectorAll('input[name="dietary"]').forEach(function (b) {
    b.addEventListener("change", handleDietaryExclusive);
  });
  form.querySelectorAll('input[name="events"]').forEach(function (b) {
    b.addEventListener("change", handleEventsExclusive);
  });

  updateAttendingDetails();
  updatePlusOne();
  updateDietaryOther();

  /* ---------- Validation ---------- */
  // Clear a field's error as soon as the guest starts fixing it.
  form.addEventListener("input", function (e) {
    var fieldEl = e.target.closest(".field");
    if (fieldEl && fieldEl.classList.contains("is-invalid")) clearError(fieldEl);
  });

  function validate() {
    var firstInvalid = null;
    function fail(fieldEl, msg) {
      setError(fieldEl, msg);
      if (!firstInvalid) firstInvalid = fieldEl;
    }

    var name = form.elements.name;
    var email = form.elements.email;

    if (!name.value.trim()) {
      fail(name.closest(".field"), t("js.errName"));
    } else {
      clearError(name.closest(".field"));
    }

    var emailValue = email.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    if (!emailValue) {
      fail(email.closest(".field"), t("js.errEmailEmpty"));
    } else if (!emailOk) {
      fail(email.closest(".field"), t("js.errEmailInvalid"));
    } else {
      clearError(email.closest(".field"));
    }

    var attendingField = form.querySelector('input[name="attending"]').closest(".field");
    if (!attendingValue()) {
      fail(attendingField, t("js.errAttending"));
    } else {
      clearError(attendingField);
    }

    if (isAttending() && guestsSelect.value === "2" && !plusOneInput.value.trim()) {
      fail(plusOneField, t("js.errPlusOne"));
    } else {
      clearError(plusOneField);
    }

    if (firstInvalid) {
      var focusable = firstInvalid.querySelector("input, select, textarea");
      if (focusable) focusable.focus();
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  }

  /* ---------- Status messages ---------- */
  function showStatus(kind, html) {
    status.className = "form-status form-status--" + kind;
    status.innerHTML = html;
    status.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  /* ---------- Collect data ---------- */
  function collectData() {
    var attending = attendingValue();
    var data = {
      "Form": "Wedding RSVP",
      "Guest name": form.elements.name.value.trim(),
      "Email": form.elements.email.value.trim(),
      "Attending": attending,
      "Message": form.elements.message.value.trim()
    };

    if (isAttending()) {
      var events = [], dietary = [];
      form.querySelectorAll('input[name="events"]:checked').forEach(function (b) { events.push(b.value); });
      form.querySelectorAll('input[name="dietary"]:checked').forEach(function (b) { dietary.push(b.value); });

      data["Number of guests (including yourself)"] = guestsSelect.value;
      data["Plus one name"] = plusOneInput.value.trim();
      data["Welcome dinner / brunch"] = events.join(", ");
      data["Dietary restrictions"] = dietary.join(", ");
      data["Dietary details (Other)"] = form.elements.dietary_other.value.trim();
    }

    data._subject = "Wedding RSVP: " + data["Guest name"] + " — " + attending;
    data["Language used"] = (window.I18N && I18N.current) || "en";
    data["Log in"] = RSVP_LOG_URL;

    return data;
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.innerHTML = "";

    if (!validate()) {
      showStatus("error", t("js.errSummary"));
      return;
    }

    var data = collectData();
    var mailto = mailtoWithBody(data, data._subject);

    if (!SHEETS_ENDPOINT) {
      window.location.href = mailto;
      showStatus("info", t("js.notConfigured", { href: mailto }));
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = t("js.sending");

    postToSheet(data)
      .then(function () {
        form.classList.add("is-sent");
        showStatus("success", t("js.success", {
          name: escapeHtml(data["Guest name"]),
          thanks: t(isAttending() ? "js.successAttending" : "js.successDeclining")
        }));
      })
      .catch(function (err) {
        showStatus("error", t("js.fail", {
          detail: err && err.message ? " (" + escapeHtml(err.message) + ")" : "",
          href: mailto
        }));
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = t("rsvp.submit");
      });
  });

})();
