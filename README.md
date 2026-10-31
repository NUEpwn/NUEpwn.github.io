# NUEpwn.github.io

Website von **NUEpwn**, dem CTF-Team aus Nürnberg: https://nuepwn.github.io

Statische Seite ohne Build-Schritt (`index.html`, `style.css`, `main.js`, Logo unter `assets/`). GitHub Pages veröffentlicht automatisch, was auf `main` liegt.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann http://localhost:8000 öffnen
```

## Platzhalter

Im Abschnitt `./join.sh` in `index.html` sind die Links mit `data-todo` markiert (Discord, CTFtime). URL in `href` eintragen und das Attribut `data-todo` entfernen, dann verschwindet der Hinweis „(link folgt)“.

## Farben

Dark: Hintergrund `#0d1117`, Schrift `#e6edf3`, Akzent `#3ddc84` (aus dem Logo). Light: Hintergrund `#f6f8fa`, Schrift `#1f2328`, Akzent `#1a7f37`. Definiert als CSS-Variablen oben in `style.css`.
