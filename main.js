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
