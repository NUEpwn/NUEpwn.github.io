#!/usr/bin/env python3
"""Holt die kommenden CTFs von der CTFtime-API und schreibt data/ctfs.json.

Läuft täglich per GitHub Action (.github/workflows/update-ctfs.yml).
Lokal: python3 scripts/update_ctfs.py
"""
import json
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

API = "https://ctftime.org/api/v1/events/?limit={limit}&start={start}&finish={finish}"
OUT = Path(__file__).resolve().parent.parent / "data" / "ctfs.json"
DAYS_AHEAD = 30
MAX_EVENTS = 25


def fetch(url):
    # CTFtime lehnt Anfragen ohne User-Agent ab
    req = urllib.request.Request(url, headers={"User-Agent": "NUEpwn-website (+https://nuepwn.github.io)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def main():
    now = int(time.time())
    # 3 Tage zurück, damit laufende CTFs mit drin sind
    url = API.format(limit=100, start=now - 3 * 86400, finish=now + DAYS_AHEAD * 86400)
    raw = fetch(url)

    events = []
    for e in raw:
        finish = datetime.fromisoformat(e["finish"])
        if finish.timestamp() <= now:
            continue
        events.append({
            "id": e["id"],
            "title": e["title"].strip(),
            "start": e["start"],
            "finish": e["finish"],
            "ctftime_url": e.get("ctftime_url") or f"https://ctftime.org/event/{e['id']}/",
            "url": e.get("url") or "",
            "format": e.get("format") or "",
            "onsite": bool(e.get("onsite")),
            "location": (e.get("location") or "").strip(),
            "weight": e.get("weight") or 0,
            "restrictions": e.get("restrictions") or "Open",
            "organizers": [o["name"] for o in e.get("organizers") or [] if o.get("name")],
        })

    events.sort(key=lambda e: e["start"])
    events = events[:MAX_EVENTS]

    old = None
    if OUT.exists():
        old = json.loads(OUT.read_text(encoding="utf-8")).get("events")
    if old == events:
        print("Keine Änderung.")
        return 0

    OUT.parent.mkdir(exist_ok=True)
    data = {"updated": datetime.now(timezone.utc).isoformat(timespec="seconds"), "events": events}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(events)} Events geschrieben.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
