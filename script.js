/* ==========================================================================
   Kimberly & Walter — Wedding Website
   RSVP form handling + small UI helpers.

   >>> THE THINGS YOU NEED TO EDIT ARE RIGHT HERE: <<<
   ========================================================================== */

// 1) Google Sheets endpoint (Apps Script web app URL).
//    See google-apps-script/SETUP.md in the wedding-prep repo — paste the /exec URL here:
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycby4QBBdH-rTh81G7_kpG2dEXcHhf4fGZp3lxWsY0-P8AYOLG2T8nSiDoZbzoEclLKps/exec";

// 2) Fallback email if Sheets isn’t configured or the network request fails.
const COUPLE_EMAIL = "kimkimchinv@gmail.com";

// 3) RSVP deadline. From this moment the form is replaced by a "RSVPs are
//    closed — please email us" note (end of March 31, 2027, US Pacific time).
//    Keep it in step with rsvpClosesAt in google-apps-script/Code.gs.
const RSVP_CLOSES = "2027-04-01T00:00:00-07:00";

const FORM_ENDPOINT = SHEETS_ENDPOINT;
const CONTACT_FORM_ENDPOINT = SHEETS_ENDPOINT;

/* ========================================================================== */

(function () {
  "use strict";

  /* ---------- Translations (see i18n.js) ---------- */
  // t("key") returns the text for the language currently chosen in the
  // language bar, falling back to English.
  var t = (window.I18N && I18N.t) || function (key) { return key; };

  /* Soft-prefill name/email from the gate identity (localStorage). */
  function prefillFromGateIdentity(root) {
    if (!root || !window.WeddingGate || !WeddingGate.getIdentity) return;
    var identity = WeddingGate.getIdentity();
    if (!identity) return;
    var nameInput = root.querySelector("#name, #contact-name, input[name='name']");
    var emailInput = root.querySelector("#email, #contact-email, input[name='email']");
    if (nameInput && !nameInput.value && identity.name) {
      nameInput.value = identity.name;
    }
    if (emailInput && !emailInput.value && identity.email) {
      emailInput.value = identity.email;
    }
  }

  function prefillVisibleForms() {
    prefillFromGateIdentity(document.getElementById("rsvp-form"));
    prefillFromGateIdentity(document.getElementById("contact-form"));
  }

  document.addEventListener("wedding:unlocked", prefillVisibleForms);

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

  function sheetPayload(data) {
    // Explicit keys matching Apps Script headers (empty string when not applicable).
    if (data["Form"] === "Wedding Question") {
      return {
        "Form": "Wedding Question",
        "Guest name": data["Guest name"] || "",
        "Email": data["Email"] || "",
        "Message": data["Message"] || data["Question"] || "",
        "Language": data["Language used"] || "en"
      };
    }

    var guestCount = data["Guest count"];
    if (guestCount == null || guestCount === "") {
      guestCount = data["Number of guests (including yourself)"];
    }

    return {
      "Form": "Wedding RSVP",
      "Guest name": data["Guest name"] || "",
      "Email": data["Email"] || "",
      "Attending": data["Attending"] || "",
      "Guest count": guestCount != null && guestCount !== "" ? String(guestCount) : "",
      "Plus one name": data["Plus one name"] || "",
      "Welcome dinner / brunch": data["Welcome dinner / brunch"] || "",
      "Dietary restrictions": data["Dietary restrictions"] || "",
      "Dietary details (Other)": data["Dietary details (Other)"] || "",
      "Message": data["Message"] || "",
      "Party": data["Party"] || "",
      "Party size": data["Party size"] || "",
      "Language": data["Language used"] || "en",
      "Signed in as": data["Signed in as"] || "",
      "Use previous email": data["Use previous email"] || ""
    };
  }

  function postToSheet(data) {
    var payload = sheetPayload(data);

    // text/plain avoids a CORS preflight; Apps Script still reads JSON from the body.
    return fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (json) {
        if (!res.ok || json.ok === false) {
          var err = new Error((json && json.error) || ("Server responded with " + res.status));
          err.closed = !!(json && json.closed);
          throw err;
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

  // Hidden "_gotcha" field: people never see it, spam bots fill it in.
  function looksLikeBot(formEl) {
    var hp = formEl.querySelector('input[name="_gotcha"]');
    return !!(hp && hp.value.trim());
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
    prefillFromGateIdentity(contactForm);
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

      if (looksLikeBot(contactForm)) {
        contactForm.classList.add("is-sent");
        showContactStatus("success", t("js.contactSuccess", { name: "" }));
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

  /* ---------- Shared calendar actions (WeddingCalendar) ---------- */
  function calendarActionsHtml(key) {
    if (!window.WeddingCalendar) return "";
    var Cal = window.WeddingCalendar;
    var google = Cal.googleUrl(key);
    var outlook = Cal.outlookUrl(key);
    var file = key + ".ics";
    if (!google || !outlook) return "";
    return '<div class="calendar-actions">'
      + '<a class="button button--secondary button--compact" href="'
      + google + '" target="_blank" rel="noopener">'
      + escapeHtml(t("js.calGoogle")) + "</a>"
      + '<button type="button" class="button button--secondary button--compact" data-cal-ics="'
      + escapeHtml(key) + '" data-cal-file="' + escapeHtml(file) + '">'
      + escapeHtml(t("js.calApple")) + "</button>"
      + '<a class="button button--secondary button--compact" href="'
      + outlook + '" target="_blank" rel="noopener">'
      + escapeHtml(t("js.calOutlook")) + "</a>"
      + "</div>";
  }

  function renderScheduleCalendarLinks() {
    if (!window.WeddingCalendar) return;
    document.querySelectorAll("[data-schedule-cal]").forEach(function (el) {
      var key = el.getAttribute("data-schedule-cal");
      var actions = calendarActionsHtml(key);
      if (!actions) {
        el.innerHTML = "";
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.innerHTML =
        '<p class="schedule-cal__label">' + escapeHtml(t("js.calAdd")) + "</p>"
        + actions;
    });
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-cal-ics]");
    if (!btn || !window.WeddingCalendar) return;
    e.preventDefault();
    var key = btn.getAttribute("data-cal-ics");
    var file = btn.getAttribute("data-cal-file") || (key + ".ics");
    WeddingCalendar.downloadIcs([key], file);
  });

  renderScheduleCalendarLinks();
  document.addEventListener("i18n:change", renderScheduleCalendarLinks);

  /* ---------- RSVP form ---------- */
  var form = document.getElementById("rsvp-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var calendarReminders = document.getElementById("calendar-reminders");
  var submitButton = document.getElementById("submit-button");
  var attendingDetails = document.getElementById("attending-details");
  var guestsField = document.getElementById("guests-field");
  var guestsSelect = document.getElementById("guests");
  var partyNote = document.getElementById("party-note");
  var eventsField = document.getElementById("events-field");
  var closedBox = document.getElementById("rsvp-closed");
  var existingNote = document.getElementById("existing-reply");
  var extraGuests = document.getElementById("extra-guests");
  var replyingAs = document.getElementById("replying-as");
  var dietaryOtherField = document.getElementById("dietary-other-field");
  var calendarState = null; // { keys: string[] } after a successful attending RSVP

  prefillFromGateIdentity(form);

  function attendingValue() {
    var checked = form.querySelector('input[name="attending"]:checked');
    return checked ? checked.value : "";
  }
  function isAttending() {
    return attendingValue() === "Joyfully accepts";
  }

  /* ---------- Party (from the guest list, via the sign-in screen) ---------- */
  // The guest list groups people into parties. A party of 1 can't add
  // anyone; a party of N can bring up to N people, named on the form.
  function identity() {
    return (window.WeddingGate && WeddingGate.getIdentity && WeddingGate.getIdentity()) || null;
  }
  function partySize() {
    var id = identity();
    return id && id.size > 1 ? id.size : 1;
  }
  function guestCount() {
    return Math.min(Number(guestsSelect.value) || 1, partySize());
  }

  function renderReplyingAs() {
    var id = identity();
    if (!replyingAs) return;
    if (!id) {
      replyingAs.innerHTML = "";
      return;
    }
    replyingAs.innerHTML = t("js.replyingAs", { name: escapeHtml(id.name) })
      + ' <button type="button" class="link-button" data-sign-out>' + escapeHtml(t("js.notYou")) + "</button>";
  }
  if (replyingAs) {
    replyingAs.addEventListener("click", function (e) {
      if (e.target.closest("[data-sign-out]") && window.WeddingGate) WeddingGate.signOut();
    });
  }

  function renderPartyNote() {
    var size = partySize();
    partyNote.textContent = size > 1 ? t("js.partyMany", { count: size }) : t("js.partyOne");
  }

  // Options 1..party size; hidden entirely for a party of one.
  function buildGuestOptions() {
    var size = partySize();
    var keep = guestsSelect.value || "1";
    guestsSelect.innerHTML = "";
    for (var n = 1; n <= size; n++) {
      var opt = document.createElement("option");
      opt.value = String(n);
      opt.textContent = String(n);
      guestsSelect.appendChild(opt);
    }
    guestsSelect.value = Number(keep) <= size ? keep : String(size);
    guestsField.hidden = size <= 1;
  }

  // One name box per extra guest, prefilled with the names we know.
  function updateExtraGuests() {
    var want = guestCount() - 1;
    var known = ((identity() || {}).others || []).filter(Boolean);
    var boxes = extraGuests.querySelectorAll(".field");
    for (var i = boxes.length; i < want; i++) {
      var id = "extra_guest_" + (i + 2);
      var field = document.createElement("div");
      field.className = "field";
      field.innerHTML = '<label for="' + id + '"><span data-extra-label="' + (i + 2) + '"></span>'
        + ' <span class="req" aria-hidden="true">*</span></label>'
        + '<input type="text" id="' + id + '" name="extra_guest" autocomplete="off">'
        + '<p class="field__error" role="alert"></p>';
      field.querySelector("input").value = known[i] || "";
      extraGuests.appendChild(field);
    }
    for (var j = boxes.length - 1; j >= want; j--) boxes[j].remove();
    labelExtraGuests();
  }
  function labelExtraGuests() {
    extraGuests.querySelectorAll("[data-extra-label]").forEach(function (el) {
      el.textContent = t("js.guestName", { n: el.getAttribute("data-extra-label") });
    });
  }
  function extraGuestInputs() {
    return Array.prototype.slice.call(extraGuests.querySelectorAll('input[name="extra_guest"]'));
  }

  /* Welcome dinner / brunch: only parties with a tier 1 or 2 guest are
     asked. Parties who already said yes to either one before this rule
     keep the question, so they can still see and change their answer. */
  function setEventsVisible(show) {
    eventsField.hidden = !show;
    // The schedule shows the dinner and brunch only to parties invited to them.
    document.querySelectorAll("[data-party-event]").forEach(function (el) { el.hidden = !show; });
    var leadAll = document.getElementById("schedule-lead-all");
    var leadWedding = document.getElementById("schedule-lead-wedding");
    if (leadAll && leadWedding) {
      leadAll.hidden = !show;
      leadWedding.hidden = show;
    }
    if (!show) {
      form.querySelectorAll('input[name="events"]').forEach(function (b) { b.checked = false; });
    }
  }

  /* What this party already told us (website reply or in person), fetched
     once per party after sign-in. The form is filled in from it so guests
     review and change their answer instead of starting over. */
  var partyState = {};   // party → { hadEvents, reply }
  var prefilledFor = null;
  var existingReply = null;

  function loadPartyState() {
    var id = identity();
    if (!id) {
      setEventsVisible(true);
      return;
    }
    var key = String(id.party);
    if (key in partyState) {
      applyPartyState(id, partyState[key]);
      return;
    }
    setEventsVisible(!!id.events);
    if (!isHttpEndpoint(SHEETS_ENDPOINT)) return;
    var names = [id.name, id.listName].concat(id.others || []).filter(Boolean).join("|");
    fetch(SHEETS_ENDPOINT + "?party=" + encodeURIComponent(key) + "&names=" + encodeURIComponent(names))
      .then(function (res) { return res.json(); })
      .then(function (json) {
        partyState[key] = { hadEvents: !!(json && json.hadEvents), reply: (json && json.reply) || null };
      })
      .catch(function () { partyState[key] = { hadEvents: true, reply: null }; }) // can't check: don't take it away
      .then(function () {
        var now = identity();
        if (now && String(now.party) === key) applyPartyState(now, partyState[key]);
      });
  }

  function applyPartyState(id, state) {
    setEventsVisible(!!id.events || state.hadEvents);
    existingReply = state.reply;
    if (state.reply && prefilledFor !== String(id.party)) {
      prefilledFor = String(id.party);
      prefillFromReply(id, state.reply);
    }
    renderExistingNote();
  }

  function check(name, value, on) {
    var box = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
    if (box) box.checked = on;
  }

  function prefillFromReply(id, reply) {
    if (reply.attending) {
      check("attending", reply.attending === "yes" ? "Joyfully accepts" : "Regretfully declines", true);
      updateAttendingDetails();
    }
    // Guests besides the signed-in one. The reply may have been sent by
    // anyone in the party, so drop whoever is signed in from its names; if
    // the reply uses names we can't match (e.g. a Chinese name vs. the list
    // name), fall back to the other people on the guest list.
    var norm = function (n) { return String(n || "").toLowerCase().replace(/[^a-z0-9\u0080-\uffff]+/g, ""); };
    var me = [id.name, id.listName].map(norm);
    // In-person replies only know guest-list labels ("Eileen's bf"), so use
    // the list's real names and leave unnamed guests blank to fill in.
    var full = reply.source !== "in person"; // website or Save the Date form
    var named = full
      ? [reply.guestName].concat(reply.plusOnes || []).filter(Boolean)
      : [];
    // "Luben Raytchev" on the form is the same person as "Luben" on the list.
    var words = function (n) { return String(n || "").toLowerCase().split(/[^a-z0-9\u0080-\uffff]+/).filter(Boolean); };
    var myWords = [id.name, id.listName].map(words).filter(function (w) { return w.length; });
    var isMe = function (n) {
      if (me.indexOf(norm(n)) !== -1) return true;
      var w = words(n);
      return myWords.some(function (m) {
        return m.every(function (x) { return w.indexOf(x) !== -1; }) || w.every(function (x) { return m.indexOf(x) !== -1; });
      });
    };
    var others = named.filter(function (n) { return !isMe(n); });
    var listOthers = (id.others || []).map(function (n) { return n || ""; });
    if (!named.length || others.length === named.length) others = listOthers;
    var count = Math.max(1, Math.min(reply.guestCount || 1, partySize()));
    guestsSelect.value = String(count);
    updateExtraGuests();
    extraGuestInputs().forEach(function (input, i) {
      input.value = others[i] || "";
    });
    if (full) {
      form.querySelectorAll('input[name="events"]').forEach(function (b) {
        var v = b.value.toLowerCase();
        b.checked = (v.indexOf("dinner") !== -1 && reply.events.toLowerCase().indexOf("dinner") !== -1)
          || (v.indexOf("brunch") !== -1 && reply.events.toLowerCase().indexOf("brunch") !== -1)
          || (b.value === "Not available" && reply.events === "Not available");
      });
      (reply.dietary || []).forEach(function (d) { check("dietary", d, true); });
      updateDietaryOther();
      form.elements.dietary_other.value = reply.dietaryOther || "";
      form.elements.message.value = reply.message || "";
    }
    if (reply.emailHint) {
      form.elements.email.placeholder = t("js.emailLast", { hint: reply.emailHint });
    }
  }

  function renderExistingNote() {
    if (!existingNote) return;
    var reply = existingReply;
    if (!reply || form.classList.contains("is-sent")) {
      existingNote.hidden = true;
      existingNote.innerHTML = "";
      return;
    }
    var lang = (window.I18N && I18N.current) || "en";
    var locales = { en: "en-US", ja: "ja-JP", zh: "zh-TW", ko: "ko-KR" };
    existingNote.innerHTML = reply.source === "save the date"
      ? t("js.existingStd")
      : reply.source === "website"
      ? t("js.existingWeb", {
          date: escapeHtml(new Date(reply.submitted).toLocaleDateString(locales[lang] || "en-US", { year: "numeric", month: "long", day: "numeric" }))
        })
      : t(reply.attending === "yes" ? "js.existingInPerson" : "js.existingInPersonNo");
    existingNote.hidden = false;
  }

  function refreshParty() {
    renderReplyingAs();
    renderPartyNote();
    buildGuestOptions();
    updateExtraGuests();
    loadPartyState();
  }

  /* ---------- After the deadline ---------- */
  function rsvpIsClosed() {
    return Date.now() >= Date.parse(RSVP_CLOSES);
  }
  function showClosed() {
    form.hidden = true;
    closedBox.innerHTML = t("js.rsvpClosed", { email: COUPLE_EMAIL });
    closedBox.hidden = false;
  }

  // Show/hide the "attending only" details.
  function updateAttendingDetails() {
    var show = attendingValue() === "" || isAttending();
    attendingDetails.hidden = !show;
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
  guestsSelect.addEventListener("change", updateExtraGuests);
  document.addEventListener("wedding:unlocked", refreshParty);
  document.addEventListener("i18n:change", function () {
    renderReplyingAs();
    renderPartyNote();
    labelExtraGuests();
  });
  form.querySelectorAll('input[name="dietary"]').forEach(function (b) {
    b.addEventListener("change", handleDietaryExclusive);
  });
  form.querySelectorAll('input[name="events"]').forEach(function (b) {
    b.addEventListener("change", handleEventsExclusive);
  });

  updateAttendingDetails();
  refreshParty();
  updateDietaryOther();
  if (rsvpIsClosed()) showClosed();
  document.addEventListener("i18n:change", function () {
    if (!closedBox.hidden) showClosed();
    renderExistingNote();
    if (existingReply && existingReply.emailHint) {
      form.elements.email.placeholder = t("js.emailLast", { hint: existingReply.emailHint });
    }
  });

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
    var reuseEmail = !emailValue && existingReply && existingReply.emailHint;
    if (reuseEmail) {
      clearError(email.closest(".field"));
    } else if (!emailValue) {
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

    extraGuestInputs().forEach(function (input) {
      if (isAttending() && !input.value.trim()) {
        fail(input.closest(".field"), t("js.errPlusOne"));
      } else {
        clearError(input.closest(".field"));
      }
    });

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

  /* ---------- Calendar reminders (attending RSVP only) ---------- */
  function selectedEventValues() {
    var values = [];
    form.querySelectorAll('input[name="events"]:checked').forEach(function (b) {
      if (b.value !== "Not available") values.push(b.value);
    });
    return values;
  }

  function hideCalendarReminders() {
    calendarState = null;
    if (!calendarReminders) return;
    calendarReminders.hidden = true;
    calendarReminders.innerHTML = "";
  }

  function eventLabel(key) {
    if (key === "wedding") return t("js.calWedding");
    if (key === "dinner") return t("js.calDinner");
    if (key === "brunch") return t("js.calBrunch");
    return key;
  }

  function renderCalendarReminders() {
    if (!calendarReminders || !calendarState || !window.WeddingCalendar) {
      hideCalendarReminders();
      return;
    }

    var Cal = window.WeddingCalendar;
    var keys = calendarState.keys || [];
    if (!keys.length) {
      hideCalendarReminders();
      return;
    }

    var html = "";
    html += '<h3 class="calendar-reminders__title">' + escapeHtml(t("js.calTitle")) + "</h3>";
    html += '<p class="calendar-reminders__lead">' + escapeHtml(t("js.calLead")) + "</p>";
    html += '<ul class="calendar-reminders__list">';

    keys.forEach(function (key) {
      var actions = calendarActionsHtml(key);
      if (!actions) return;
      html += '<li class="calendar-reminders__event">';
      html += '<p class="calendar-reminders__event-title">' + escapeHtml(eventLabel(key)) + "</p>";
      html += actions;
      html += "</li>";
    });

    html += "</ul>";
    html += '<p class="calendar-reminders__subscribe">'
      + t("js.calSubscribe", {
        href: Cal.subscribeUrl("events.ics"),
        webcal: Cal.webcalUrl("events.ics")
      })
      + "</p>";
    html += '<p class="calendar-reminders__note">' + escapeHtml(t("js.calNote")) + "</p>";

    calendarReminders.innerHTML = html;
    calendarReminders.hidden = false;
  }

  document.addEventListener("i18n:change", function () {
    if (calendarState) renderCalendarReminders();
  });

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

      // Never more than the party size on the guest list.
      var count = String(guestCount());
      data["Number of guests (including yourself)"] = count;
      data["Guest count"] = count;
      data["Plus one name"] = extraGuestInputs()
        .map(function (input) { return input.value.trim(); })
        .filter(Boolean)
        .join(", ");
      data["Welcome dinner / brunch"] = eventsField.hidden ? "" : events.join(", ");
      data["Dietary restrictions"] = dietary.join(", ");
      data["Dietary details (Other)"] = form.elements.dietary_other.value.trim();
    }

    data._subject = "Wedding RSVP: " + data["Guest name"] + " — " + attending;
    data["Language used"] = (window.I18N && I18N.current) || "en";
    var id = identity();
    data["Signed in as"] = (id && id.name) || "";
    data["Party"] = (id && id.party) || "";
    if (!data["Email"] && existingReply && existingReply.emailHint) data["Use previous email"] = "yes";
    data["Party size"] = String(partySize());

    return data;
  }

  /* ---------- Edit a sent reply ---------- */
  // Guests can change their answers and send again; the sheet keeps every
  // reply and the latest one (same email) is the one that counts.
  status.addEventListener("click", function (e) {
    if (!e.target.closest("[data-rsvp-edit]")) return;
    form.classList.remove("is-sent");
    renderExistingNote();
    status.className = "form-status";
    status.innerHTML = "";
    hideCalendarReminders();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    status.innerHTML = "";
    hideCalendarReminders();

    if (!validate()) {
      showStatus("error", t("js.errSummary"));
      return;
    }

    if (rsvpIsClosed()) {
      showClosed();
      return;
    }

    if (looksLikeBot(form)) {
      form.classList.add("is-sent");
      showStatus("success", t("js.success", { name: "", thanks: "" }));
      return;
    }

    var data = collectData();
    var mailto = mailtoWithBody(data, data._subject);
    var attendingNow = isAttending();
    var eventKeys = attendingNow && window.WeddingCalendar
      ? WeddingCalendar.keysFromFormSelection(selectedEventValues())
      : [];

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
        // What we now have on file is this reply.
        var hint = (existingReply && existingReply.emailHint) || "";
        if (data["Email"]) hint = data["Email"].charAt(0) + "•••@" + data["Email"].split("@")[1];
        existingReply = { source: "website", submitted: new Date().toISOString(), emailHint: hint };
        renderExistingNote();
        showStatus("success", t("js.success", {
          name: escapeHtml(data["Guest name"]),
          thanks: t(attendingNow ? "js.successAttending" : "js.successDeclining")
        }) + "<p>" + t("js.successEmail", { email: escapeHtml(data["Email"]) }) + "</p>"
          + '<p><button type="button" class="button button--secondary button--compact" data-rsvp-edit>'
          + escapeHtml(t("js.editReply")) + "</button></p>");
        if (attendingNow && eventKeys.length) {
          calendarState = { keys: eventKeys };
          renderCalendarReminders();
        }
      })
      .catch(function (err) {
        if (err && err.closed) {
          showClosed();
          return;
        }
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
