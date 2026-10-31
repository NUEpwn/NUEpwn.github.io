(function () {
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-name");
  var meta = document.querySelector('meta[name="theme-color"]');

  function apply(t) {
    root.setAttribute("data-theme", t);
    label.textContent = t;
    if (meta) meta.setAttribute("content", t === "light" ? "#f6f8fa" : "#0d1117");
  }
  apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");

  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    apply(next);
    try { localStorage.setItem("nuepwn-theme", next); } catch (e) {}
  });

  // Tipp-Effekt im Hero-Terminal
  var typed = document.querySelector(".typed");
  var out = document.getElementById("hero-out");
  var text = typed.getAttribute("data-text");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) { typed.textContent = text; return; }
  out.style.visibility = "hidden";
  var i = 0;
  (function step() {
    typed.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(step, 55 + Math.random() * 60);
    else setTimeout(function () { out.style.visibility = "visible"; }, 250);
  })();
})();

// Kontakt-Adresse erst im Browser zusammensetzen (nicht im HTML-Quelltext)
(function () {
  var a = document.getElementById("contact");
  if (!a) return;
  var u = a.getAttribute("data-u"), d = a.getAttribute("data-d");
  if (!u || !d) return;
  var addr = u + "@" + d;
  a.href = "mailto:" + addr + "?subject=" + encodeURIComponent("Discord-Invite NUEpwn");
  a.removeAttribute("data-todo");
  var hint = a.querySelector(".c-muted");
  if (hint) hint.textContent = addr + " · Invite für den Discord anfragen";
})();

// Kommende CTFs aus data/ctfs.json (wird täglich per GitHub Action von CTFtime geholt)
(function () {
  var list = document.getElementById("ctf-list");
  var meta = document.getElementById("ctf-meta");
  if (!list) return;
  var TZ = "Europe/Berlin";
  var fDay = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, weekday: "short", day: "2-digit", month: "2-digit" });
  var fTime = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  var fFull = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function badge(text, cls) { return el("span", "badge" + (cls ? " " + cls : ""), text); }
  function fail(msg) {
    list.innerHTML = "";
    var p = el("p", "c-muted", msg + " ");
    var a = el("a", null, "Direkt auf CTFtime ansehen");
    a.href = "https://ctftime.org/event/list/upcoming";
    p.appendChild(a);
    list.appendChild(p);
  }
  function safeUrl(u) { return /^https:\/\//.test(u || "") ? u : null; }

  fetch("data/ctfs.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var now = Date.now();
      var events = (data.events || []).filter(function (e) { return Date.parse(e.finish) > now; }).slice(0, 10);
      if (!events.length) return fail("[-] Gerade keine Events in der Liste.");
      list.innerHTML = "";
      events.forEach(function (e) {
        var start = new Date(e.start), end = new Date(e.finish);
        var row = el("div", "ctf");

        var when = el("div", "ctf-when");
        when.appendChild(el("b", null, fDay.format(start)));
        when.appendChild(document.createTextNode(" " + fTime.format(start)));
        when.appendChild(el("br"));
        when.appendChild(document.createTextNode("bis " + fDay.format(end) + " " + fTime.format(end)));
        row.appendChild(when);

        var t = el("a", "ctf-title", e.title);
        t.href = safeUrl(e.ctftime_url) || "https://ctftime.org/event/" + Number(e.id);
        t.rel = "noopener";
        var sub = [];
        if (e.organizers && e.organizers.length) sub.push("von " + e.organizers.join(", "));
        var h = Math.round((end - start) / 36e5);
        sub.push(h >= 48 ? Math.round(h / 24) + " Tage" : h + " Std.");
        t.appendChild(el("span", "ctf-sub", sub.join(" · ")));
        var wrap = el("div"); wrap.appendChild(t); row.appendChild(wrap);

        var tags = el("div", "ctf-tags");
        if (start <= now && end > now) tags.appendChild(badge("läuft", "live"));
        else if (start - now < 3 * 864e5) tags.appendChild(badge("bald", "soon"));
        if (e.format) tags.appendChild(badge(e.format.toLowerCase()));
        if (e.onsite) {
          // lange Adressen auf Stadt/Land kürzen, voller Ort im Tooltip
          var loc = (e.location || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean);
          var b = badge("vor ort" + (loc.length ? ": " + loc.slice(-2).join(", ") : ""));
          if (e.location) b.title = e.location;
          tags.appendChild(b);
        } else tags.appendChild(badge("online"));
        if (e.restrictions && e.restrictions !== "Open") tags.appendChild(badge(e.restrictions.toLowerCase(), "warn"));
        tags.appendChild(badge("weight " + (e.weight ? Number(e.weight).toFixed(1) : "–")));
        row.appendChild(tags);

        list.appendChild(row);
      });
      if (data.updated) meta.textContent = "# zuletzt aktualisiert: " + fFull.format(new Date(data.updated)) + " · Quelle: CTFtime";
    })
    .catch(function () { fail("[-] Events konnten nicht geladen werden."); });
})();
