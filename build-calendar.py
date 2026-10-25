#!/usr/bin/env python3
"""Generate subscribeable .ics files from calendar-events.js CONFIG.

Usage (from this folder):
  python3 build-calendar.py

Edit event details in calendar-events.js (the CONFIG object). Runtime
Google / .ics download buttons read that file directly after deploy.
Run this script whenever you want the hosted calendar/*.ics subscription
feeds to match — then commit and deploy.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = HERE / "calendar-events.js"
OUT_DIR = HERE / "calendar"

START_MARK = "/* CALENDAR_CONFIG_START */"
END_MARK = "/* CALENDAR_CONFIG_END */"


def load_config() -> dict:
    text = SRC.read_text(encoding="utf-8")
    if START_MARK not in text or END_MARK not in text:
        sys.stderr.write("Could not find CALENDAR_CONFIG markers in calendar-events.js\n")
        sys.exit(1)
    block = text.split(START_MARK, 1)[1].split(END_MARK, 1)[0]
    # strip: var CONFIG = ... ;
    match = re.search(r"=\s*(\{.*\})\s*;", block, re.DOTALL)
    if not match:
        sys.stderr.write("Could not parse CONFIG object from calendar-events.js\n")
        sys.exit(1)
    raw = match.group(1)
    try:
        return json.loads(raw)
    except json.JSONDecodeError as err:
        sys.stderr.write(
            "CONFIG must be valid JSON (double-quoted keys/strings).\n"
            f"{err}\n"
        )
        sys.exit(1)


def pad(n: int) -> str:
    return f"{n:02d}"


def compact_date(iso: str) -> str:
    return iso.replace("-", "")


def add_days(iso: str, days: int) -> str:
    y, m, d = (int(x) for x in iso.split("-"))
    dt = date(y, m, d) + timedelta(days=days)
    return dt.isoformat()


def ics_escape(text: str) -> str:
    return (
        str(text or "")
        .replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\r\n", "\\n")
        .replace("\n", "\\n")
        .replace("\r", "\\n")
    )


def fold(line: str) -> str:
    max_len = 75
    out = []
    while len(line) > max_len:
        out.append(line[:max_len])
        line = " " + line[max_len:]
    out.append(line)
    return "\r\n".join(out)


def compact_dt_local(iso_date: str, time_str: str) -> str:
    return compact_date(iso_date) + "T" + time_str.replace(":", "") + "00"


def utc_stamp() -> str:
    now = datetime.now(timezone.utc)
    return (
        f"{now.year}{pad(now.month)}{pad(now.day)}T"
        f"{pad(now.hour)}{pad(now.minute)}{pad(now.second)}Z"
    )


def vevent(ev: dict, timezone_name: str) -> str:
    lines = [
        "BEGIN:VEVENT",
        f"UID:{ev['uid']}",
        f"DTSTAMP:{utc_stamp()}",
    ]
    if ev.get("allDay") or not ev.get("startTime"):
        lines.append(f"DTSTART;VALUE=DATE:{compact_date(ev['date'])}")
        lines.append(f"DTEND;VALUE=DATE:{compact_date(add_days(ev['date'], 1))}")
    else:
        end_date = ev.get("endDate") or ev["date"]
        end_time = ev.get("endTime") or ev["startTime"]
        lines.append(
            f"DTSTART;TZID={timezone_name}:{compact_dt_local(ev['date'], ev['startTime'])}"
        )
        lines.append(
            f"DTEND;TZID={timezone_name}:{compact_dt_local(end_date, end_time)}"
        )
    lines.append(f"SUMMARY:{ics_escape(ev.get('title', ''))}")
    if ev.get("location"):
        lines.append(f"LOCATION:{ics_escape(ev['location'])}")
    if ev.get("description"):
        lines.append(f"DESCRIPTION:{ics_escape(ev['description'])}")
    lines.append("END:VEVENT")
    return "\r\n".join(fold(line) for line in lines)


def calendar_ics(config: dict, events: list[dict]) -> str:
    tz = config.get("timezone") or "Asia/Tokyo"
    name = config.get("calendarName") or "Kimberly & Walter Wedding"
    header = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kimberly & Walter//Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:{ics_escape(name)}",
        f"X-WR-TIMEZONE:{tz}",
    ]
    parts = ["\r\n".join(fold(line) for line in header)]
    for ev in events:
        parts.append(vevent(ev, tz))
    parts.append("END:VCALENDAR")
    return "\r\n".join(parts) + "\r\n"


def main() -> None:
    config = load_config()
    events = config.get("events") or {}
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    files = {
        "wedding.ics": ["wedding"],
        "dinner.ics": ["dinner"],
        "brunch.ics": ["brunch"],
        "events.ics": ["wedding", "dinner", "brunch"],
    }

    for filename, keys in files.items():
        selected = [events[k] for k in keys if k in events]
        path = OUT_DIR / filename
        path.write_text(calendar_ics(config, selected), encoding="utf-8")
        print(f"Wrote {path.relative_to(HERE)} ({len(selected)} event(s))")

    base = (config.get("publicBaseUrl") or "").rstrip("/")
    print()
    print("Subscribe URLs (after deploy):")
    for name in files:
        print(f"  {base}/calendar/{name}")


if __name__ == "__main__":
    main()
