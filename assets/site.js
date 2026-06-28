/* ===== Creative Concepts — shared behaviour ===== */
(function () {
  "use strict";

  /* ---- Loader (subtle bar, no numbers) ---- */
  var loader = document.getElementById("loader");
  function startReveals() {
    if (typeof gsap === "undefined") {
      document.querySelectorAll(".reveal").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      runStats(); return;
    }
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".reveal").forEach(function (el) {
      var d = parseFloat(el.getAttribute("data-delay") || 0);
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: function () { gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: d }); },
      });
    });
    runStats();
  }
  function runStats() {
    document.querySelectorAll(".stat").forEach(function (stat) {
      var num = stat.querySelector(".stat-num"); if (!num) return;
      var target = +stat.getAttribute("data-target");
      if (typeof gsap === "undefined") { num.textContent = target; return; }
      ScrollTrigger.create({
        trigger: stat, start: "top 92%", once: true,
        onEnter: function () { var o = { v: 0 }; gsap.to(o, { v: target, duration: 1.7, ease: "power2.out", onUpdate: function () { num.textContent = Math.round(o.v); } }); },
      });
    });
  }
  if (loader) {
    var fill = document.getElementById("loader-fill");
    var p = 0;
    var tick = setInterval(function () { p += Math.random() * 13 + 5; if (p >= 92) { p = 92; clearInterval(tick); } if (fill) fill.style.width = p + "%"; }, 120);
    function finish() {
      clearInterval(tick);
      if (fill) { fill.style.transition = "width 0.4s ease"; fill.style.width = "100%"; }
      setTimeout(function () { loader.classList.add("done"); document.body.classList.remove("is-loading"); startReveals(); }, 420);
    }
    window.addEventListener("load", function () { setTimeout(finish, 400); });
    setTimeout(finish, 3500);
  } else {
    document.body.classList.remove("is-loading");
    if (document.readyState === "complete") startReveals();
    else window.addEventListener("load", startReveals);
  }

  /* ---- Header scroll state ---- */
  var header = document.querySelector(".site-header");
  function onScroll() { if (!header) return; if (window.scrollY > 40) header.classList.add("solid"); else header.classList.remove("solid"); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---- Mobile menu ---- */
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.getElementById("menu-btn");
  var closeBtn = document.getElementById("menu-close");
  if (openBtn) openBtn.addEventListener("click", function () { menu.classList.add("open"); document.body.style.overflow = "hidden"; });
  function close() { if (menu) { menu.classList.remove("open"); document.body.style.overflow = ""; } }
  if (closeBtn) closeBtn.addEventListener("click", close);
  document.querySelectorAll(".mobile-nav a").forEach(function (a) { a.addEventListener("click", close); });

  /* ---- Portfolio filter ---- */
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-cat");
      document.querySelectorAll(".filter-btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      document.querySelectorAll(".proj-item").forEach(function (item) {
        item.classList.toggle("is-hidden", !(cat === "all" || item.getAttribute("data-cat") === cat));
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
})();
