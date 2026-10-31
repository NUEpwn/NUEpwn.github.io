# NUEpwn.github.io

Website von **NUEpwn**, dem CTF-Team aus Nürnberg: https://nuepwn.github.io

Statische Seite ohne Build-Schritt (`index.html`, `style.css`, `main.js`, Logo unter `assets/`). GitHub Pages veröffentlicht automatisch, was auf `main` liegt.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Kommende CTFs

Der Abschnitt `ctftime --upcoming` liest `data/ctfs.json`. Die Datei schreibt `scripts/update_ctfs.py`, das die [CTFtime-API](https://ctftime.org/api/) abfragt (nächste 30 Tage, max. 25 Events). Die GitHub Action `.github/workflows/update-ctfs.yml` läuft täglich und committet Änderungen; per „Run workflow“ im Actions-Tab lässt sie sich auch von Hand starten. Direkt aus dem Browser geht das nicht, weil CTFtime keine CORS-Header schickt.

## Kontakt / Discord

Der Discord-Invite steht absichtlich **nicht** auf der Seite (Schutz vor Bots). Stattdessen gibt es einen Kontakt-Link in `./join.sh`: Beim Element `id="contact"` in `index.html` Benutzername in `data-u` und Domain in `data-d` eintragen und `data-todo` entfernen. Die Adresse wird erst im Browser per JS zusammengesetzt und steht so nicht im Klartext im HTML.

## Farben

Dark: Hintergrund `#0d1117`, Schrift `#e6edf3`, Akzent `#3ddc84` (aus dem Logo). Light: Hintergrund `#f6f8fa`, Schrift `#1f2328`, Akzent `#1a7f37`. Definiert als CSS-Variablen oben in `style.css`.
