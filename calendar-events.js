/* ==========================================================================
   Kimberly & Walter — Calendar event details (single source of truth)

   HOW TO EDIT (plain English)
   - Change titles, dates, times, locations, or notes in the CONFIG object
     below (between CALENDAR_CONFIG_START and CALENDAR_CONFIG_END).
   - Save, commit, and deploy. Guests who click “Add to Google / download
     .ics” AFTER that deploy always get the latest details — no other
     regenerate step is required for those buttons (they are built at
     runtime from this file).
   - Google “Add” links and one-shot .ics downloads are SNAPSHOTS. Guests
     who already saved an event will NOT see your edits automatically;
     they need to update the event manually, or use Subscribe (below).
   - For Apple/Google calendar SUBSCRIBE (live updates when you redeploy):
     after editing CONFIG, run:
         python3 build-calendar.py
     then commit the updated files under calendar/*.ics and deploy.
     Public URLs (after deploy):
         https://teamkimkim.com/calendar/events.ics   (all three events)
         https://teamkimkim.com/calendar/wedding.ics
         https://teamkimkim.com/calendar/dinner.ics
         https://teamkimkim.com/calendar/brunch.ics
     On iPhone: Settings → Calendar → Accounts → Add Subscribed Calendar,
     or open a webcal:// link from the RSVP success screen.

   TIMES
   - Leave startTime / endTime as null (and allDay: true) while the site
     still says “to be announced”. That creates an all-day event with
     location + notes — it does NOT invent a fake ceremony time.
   - When times are final, set allDay to false and use 24h local times,
     e.g. startTime: "15:00", endTime: "22:00" (timezone Asia/Tokyo).
   ========================================================================== */

window.WeddingCalendar = (function () {
  "use strict";

  /* CALENDAR_CONFIG_START */
  var CONFIG = {
    "publicBaseUrl": "https://teamkimkim.com",
    "timezone": "Asia/Tokyo",
    "calendarName": "Kimberly & Walter — Nagoya Wedding",
    "events": {
      "wedding": {
        "uid": "wedding-celebration@teamkimkim.com",
        "title": "Kimberly & Walter — Wedding Celebration",
        "date": "2027-10-09",
        "allDay": true,
        "startTime": null,
        "endTime": null,
        "location": "Hyakkarou 百花籠, 3-6-3 Chikaramachi, Higashi-ku, Nagoya-shi, Aichi 461-0018, Japan",
        "description": "Ceremony and reception times to be announced.\n\nVenue: Hyakkarou (百花籠), Shirakabe district, Nagoya.\nWedding website: https://teamkimkim.com/#schedule"
      },
      "dinner": {
        "uid": "welcome-dinner@teamkimkim.com",
        "title": "Kimberly & Walter — Welcome Dinner",
        "date": "2027-10-08",
        "allDay": true,
        "startTime": null,
        "endTime": null,
        "location": "Nagoya, Japan (exact venue to be announced)",
        "description": "Time and location to be announced.\n\nA relaxed evening before the wedding day.\nWedding website: https://teamkimkim.com/#schedule"
      },
      "brunch": {
        "uid": "happy-brunch@teamkimkim.com",
        "title": "Kimberly & Walter — Happy Brunch",
        "date": "2027-10-10",
        "allDay": true,
        "startTime": null,
        "endTime": null,
        "location": "Nagoya, Japan (exact venue to be announced)",
        "description": "Time and location to be announced.\n\nOne more meal together before everyone heads off to explore Japan.\nWedding website: https://teamkimkim.com/#schedule"
      }
    }
  };
  /* CALENDAR_CONFIG_END */

  /* Form checkbox values → config keys */
  var EVENT_FORM_VALUES = {
    "Welcome dinner (Fri, Oct 8)": "dinner",
    "Happy brunch (Sun, Oct 10)": "brunch"
  };

  function pad(n) {
    return String(n).length === 1 ? "0" + n : String(n);
  }

  function ymdParts(dateStr) {
    var p = dateStr.split("-");
    return { y: +p[0], m: +p[1], d: +p[2] };
  }

  function addDays(dateStr, days) {
    var p = ymdParts(dateStr);
    var dt = new Date(Date.UTC(p.y, p.m - 1, p.d + days));
    return dt.getUTCFullYear() + "-" + pad(dt.getUTCMonth() + 1) + "-" + pad(dt.getUTCDate());
  }

  function compactDate(dateStr) {
    return dateStr.replace(/-/g, "");
  }

  function compactDateTimeLocal(dateStr, timeStr) {
    return compactDate(dateStr) + "T" + timeStr.replace(":", "") + "00";
  }

  function icsEscape(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r\n/g, "\\n")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\n");
  }

  function foldIcsLine(line) {
    var out = "";
    var max = 75;
    while (line.length > max) {
      out += line.slice(0, max) + "\r\n ";
      line = line.slice(max);
    }
    return out + line;
  }

  function utcStamp(date) {
    return date.getUTCFullYear()
      + pad(date.getUTCMonth() + 1)
      + pad(date.getUTCDate())
      + "T"
      + pad(date.getUTCHours())
      + pad(date.getUTCMinutes())
      + pad(date.getUTCSeconds())
      + "Z";
  }

  function getEvent(key) {
    return CONFIG.events[key] || null;
  }

  function googleUrl(key) {
    var ev = getEvent(key);
    if (!ev) return "";
    var dates;
    if (ev.allDay || !ev.startTime) {
      dates = compactDate(ev.date) + "/" + compactDate(addDays(ev.date, 1));
    } else {
      var endTime = ev.endTime || ev.startTime;
      var endDate = ev.endDate || ev.date;
      dates = compactDateTimeLocal(ev.date, ev.startTime)
        + "/"
        + compactDateTimeLocal(endDate, endTime);
    }
    var params = [
      "action=TEMPLATE",
      "text=" + encodeURIComponent(ev.title),
      "dates=" + dates,
      "details=" + encodeURIComponent(ev.description || ""),
      "location=" + encodeURIComponent(ev.location || ""),
      "ctz=" + encodeURIComponent(CONFIG.timezone || "Asia/Tokyo")
    ];
    return "https://calendar.google.com/calendar/render?" + params.join("&");
  }

  function outlookUrl(key) {
    var ev = getEvent(key);
    if (!ev) return "";
    var start;
    var end;
    if (ev.allDay || !ev.startTime) {
      start = ev.date;
      end = addDays(ev.date, 1);
    } else {
      start = ev.date + "T" + ev.startTime + ":00";
      end = (ev.endDate || ev.date) + "T" + (ev.endTime || ev.startTime) + ":00";
    }
    var params = [
      "path=/calendar/action/compose",
      "rru=addevent",
      "subject=" + encodeURIComponent(ev.title),
      "body=" + encodeURIComponent(ev.description || ""),
      "location=" + encodeURIComponent(ev.location || ""),
      "startdt=" + encodeURIComponent(start),
      "enddt=" + encodeURIComponent(end),
      "allday=" + ((ev.allDay || !ev.startTime) ? "true" : "false")
    ];
    return "https://outlook.live.com/calendar/0/deeplink/compose?" + params.join("&");
  }

  function veventBlock(ev) {
    var lines = [];
    lines.push("BEGIN:VEVENT");
    lines.push("UID:" + ev.uid);
    lines.push("DTSTAMP:" + utcStamp(new Date()));
    if (ev.allDay || !ev.startTime) {
      lines.push("DTSTART;VALUE=DATE:" + compactDate(ev.date));
      lines.push("DTEND;VALUE=DATE:" + compactDate(addDays(ev.date, 1)));
    } else {
      var tz = CONFIG.timezone || "Asia/Tokyo";
      lines.push("DTSTART;TZID=" + tz + ":" + compactDateTimeLocal(ev.date, ev.startTime));
      lines.push(
        "DTEND;TZID=" + tz + ":"
        + compactDateTimeLocal(ev.endDate || ev.date, ev.endTime || ev.startTime)
      );
    }
    lines.push("SUMMARY:" + icsEscape(ev.title));
    if (ev.location) lines.push("LOCATION:" + icsEscape(ev.location));
    if (ev.description) lines.push("DESCRIPTION:" + icsEscape(ev.description));
    lines.push("END:VEVENT");
    return lines.map(foldIcsLine).join("\r\n");
  }

  function icsForKeys(keys) {
    var list = keys.map(getEvent).filter(Boolean);
    var lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Kimberly & Walter//Wedding//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:" + icsEscape(CONFIG.calendarName),
      "X-WR-TIMEZONE:" + (CONFIG.timezone || "Asia/Tokyo")
    ];
    var body = lines.map(foldIcsLine).join("\r\n");
    list.forEach(function (ev) {
      body += "\r\n" + veventBlock(ev);
    });
    body += "\r\nEND:VCALENDAR\r\n";
    return body;
  }

  function downloadIcs(keys, filename) {
    var ics = icsForKeys(keys);
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename || "event.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function keysFromFormSelection(selectedValues) {
    var keys = ["wedding"];
    (selectedValues || []).forEach(function (val) {
      var key = EVENT_FORM_VALUES[val];
      if (key && keys.indexOf(key) === -1) keys.push(key);
    });
    return keys;
  }

  function subscribeUrl(filename) {
    var base = (CONFIG.publicBaseUrl || "").replace(/\/$/, "");
    return base + "/calendar/" + filename;
  }

  function webcalUrl(filename) {
    return subscribeUrl(filename).replace(/^https:/, "webcal:").replace(/^http:/, "webcal:");
  }

  return {
    CONFIG: CONFIG,
    EVENT_FORM_VALUES: EVENT_FORM_VALUES,
    getEvent: getEvent,
    googleUrl: googleUrl,
    outlookUrl: outlookUrl,
    icsForKeys: icsForKeys,
    downloadIcs: downloadIcs,
    keysFromFormSelection: keysFromFormSelection,
    subscribeUrl: subscribeUrl,
    webcalUrl: webcalUrl
  };
})();
