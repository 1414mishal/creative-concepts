/* ===== Creative Concepts — shared behaviour ===== */
(function () {
  "use strict";

  /* ---------- Loading screen (subtle bar, no numbers) ---------- */
  var loader = document.getElementById("loader");
  var animsStarted = false;
  if (loader) {
    var fill = document.getElementById("loader-bar-fill");
    var p = 0;
    var tick = setInterval(function () {
      p += Math.random() * 14 + 4;
      if (p >= 92) { p = 92; clearInterval(tick); }
      if (fill) fill.style.width = p + "%";
    }, 130);

    var finish = function () {
      clearInterval(tick);
      if (fill) { fill.style.transition = "width 0.4s ease"; fill.style.width = "100%"; }
      setTimeout(function () {
        loader.classList.add("done");
        document.body.classList.remove("is-loading");
        startPageAnims();
      }, 450);
    };
    window.addEventListener("load", function () { setTimeout(finish, 450); });
    setTimeout(finish, 4000); // safety fallback
  } else {
    document.body.classList.remove("is-loading");
    window.addEventListener("load", startPageAnims);
  }

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById("mobile-menu");
  var openBtn = document.getElementById("menu-btn");
  var closeBtn = document.getElementById("menu-close");
  function showMenu() { if (!menu) return; menu.classList.remove("hidden"); menu.classList.add("flex"); document.body.style.overflow = "hidden"; }
  function hideMenu() { if (!menu) return; menu.classList.add("hidden"); menu.classList.remove("flex"); document.body.style.overflow = ""; }
  if (openBtn) openBtn.addEventListener("click", showMenu);
  if (closeBtn) closeBtn.addEventListener("click", hideMenu);
  Array.prototype.forEach.call(document.querySelectorAll(".mobile-link"), function (l) {
    l.addEventListener("click", hideMenu);
  });

  /* ---------- FAQ accordion ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".faq-toggle"), function (toggle) {
    toggle.addEventListener("click", function () {
      var content = toggle.nextElementSibling;
      var icon = toggle.querySelector("iconify-icon");
      var isOpen = content.classList.contains("is-open");
      Array.prototype.forEach.call(document.querySelectorAll("#faq .accordion-content"), function (c) {
        if (c !== content) {
          c.classList.remove("is-open");
          var i = c.previousElementSibling.querySelector("iconify-icon");
          if (i) { i.setAttribute("icon", "solar:alt-arrow-down-linear"); i.classList.remove("rotate-180"); }
        }
      });
      if (!isOpen) {
        content.classList.add("is-open");
        if (icon) { icon.setAttribute("icon", "solar:alt-arrow-up-linear"); icon.classList.add("rotate-180"); }
      } else {
        content.classList.remove("is-open");
        if (icon) { icon.setAttribute("icon", "solar:alt-arrow-down-linear"); icon.classList.remove("rotate-180"); }
      }
    });
  });

  /* ---------- Portfolio category filter (show/hide only) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".filter-btn"), function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-cat");
      Array.prototype.forEach.call(document.querySelectorAll(".filter-btn"), function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      Array.prototype.forEach.call(document.querySelectorAll(".proj-item"), function (item) {
        var show = cat === "all" || item.getAttribute("data-cat") === cat;
        item.classList.toggle("is-hidden", !show);
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------- Page animations (run after loader) ---------- */
  function startPageAnims() {
    if (animsStarted) return;
    animsStarted = true;
    if (typeof gsap === "undefined") { revealFallback(); return; }
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".gsap-hero", { opacity: 0, y: 40 });
    gsap.to(".gsap-hero", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15, delay: 0.15 });

    gsap.utils.toArray(".gsap-fade-up").forEach(function (el) {
      gsap.set(el, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: el, start: "top 88%",
        onEnter: function () { gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }); },
      });
    });

    /* count-up stats */
    gsap.utils.toArray(".stat").forEach(function (stat) {
      var num = stat.querySelector(".stat-num");
      var target = +stat.getAttribute("data-target");
      ScrollTrigger.create({
        trigger: stat, start: "top 90%", once: true,
        onEnter: function () {
          var obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: function () { num.textContent = Math.round(obj.v); } });
        },
      });
    });

    buildDisciplines();
    heroWebGL();
  }

  function revealFallback() {
    Array.prototype.forEach.call(document.querySelectorAll(".gsap-hero,.gsap-fade-up"), function (el) {
      el.style.opacity = "1"; el.style.transform = "none";
    });
    buildDisciplines(); heroWebGL();
  }

  /* ---------- Disciplines marquee-hover (no innerHTML) ---------- */
  function makeMarqueePart(text, img) {
    var part = document.createElement("div");
    part.className = "marquee-part flex items-center flex-shrink-0 text-bg";
    var span = document.createElement("span");
    span.className = "whitespace-nowrap uppercase font-serif tracking-tight text-[3vh] lg:text-[3.4vh] leading-none px-[1vw]";
    span.textContent = text;
    var thumb = document.createElement("div");
    thumb.className = "w-[70px] lg:w-[110px] h-[3vh] lg:h-[3.4vh] my-[1.6em] mx-[1vw] rounded-full bg-cover bg-center border border-white/10";
    thumb.style.backgroundImage = "url('" + img + "')";
    part.appendChild(span); part.appendChild(thumb);
    return part;
  }

  function buildDisciplines() {
    if (typeof gsap === "undefined") return;
    var sections = document.querySelectorAll("#disciplines .col-section");
    if (!sections.length) return;
    var defaults = { duration: 0.5, ease: "power3.out" };
    function closestEdge(x, y, w, h) {
      var top = Math.pow(x - w / 2, 2) + Math.pow(y, 2);
      var bottom = Math.pow(x - w / 2, 2) + Math.pow(y - h, 2);
      return top < bottom ? "top" : "bottom";
    }
    Array.prototype.forEach.call(sections, function (section) {
      var overlay = section.querySelector(".marquee-overlay");
      var inner = section.querySelector(".marquee-inner");
      if (!overlay || !inner) return;
      var text = inner.getAttribute("data-text");
      var img = inner.getAttribute("data-img");
      var anim = null;

      function render() {
        while (inner.firstChild) inner.removeChild(inner.firstChild);
        var base = makeMarqueePart(text, img);
        inner.appendChild(base);
        var cw = base.offsetWidth || 280;
        var reps = Math.max(4, Math.ceil(window.innerWidth / cw) + 2);
        for (var i = 1; i < reps; i++) inner.appendChild(base.cloneNode(true));
        if (anim) anim.kill();
        setTimeout(function () {
          var w = inner.querySelector(".marquee-part").offsetWidth || 280;
          anim = gsap.to(inner, { x: -w, duration: 8, ease: "none", repeat: -1 });
        }, 40);
      }
      setTimeout(render, 80);
      window.addEventListener("resize", render);

      section.addEventListener("mouseenter", function (e) {
        var r = section.getBoundingClientRect();
        var edge = closestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        gsap.timeline({ defaults: defaults })
          .set(overlay, { y: edge === "top" ? "-101%" : "101%" }, 0)
          .set(inner, { y: edge === "top" ? "101%" : "-101%" }, 0)
          .to([overlay, inner], { y: "0%" }, 0);
      });
      section.addEventListener("mouseleave", function (e) {
        var r = section.getBoundingClientRect();
        var edge = closestEdge(e.clientX - r.left, e.clientY - r.top, r.width, r.height);
        gsap.timeline({ defaults: defaults })
          .to(overlay, { y: edge === "top" ? "-101%" : "101%" }, 0)
          .to(inner, { y: edge === "top" ? "101%" : "-101%" }, 0);
      });
    });
  }

  /* ---------- Hero WebGL tint (subtle blue wash) ---------- */
  function heroWebGL() {
    var canvas = document.getElementById("hero-webgl");
    if (!canvas) return;
    var gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;
    function resize() { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; gl.viewport(0, 0, canvas.width, canvas.height); }
    window.addEventListener("resize", resize); resize();
    var vs = "attribute vec2 p; varying vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }";
    var fs =
      "precision mediump float; varying vec2 uv; uniform float t;" +
      "vec3 a = vec3(0.07,0.08,0.16); vec3 b = vec3(0.18,0.27,0.44);" +
      "void main(){" +
      " float n = sin(uv.x*3.0 + t*0.4)*cos(uv.y*2.0 + t*0.25);" +
      " float m = smoothstep(0.0,1.0,uv.y + n*0.2);" +
      " vec3 c = mix(a,b,m);" +
      " float s = exp(-9.0*length(uv - vec2(0.75,0.25) + vec2(sin(t)*0.08,cos(t)*0.08)));" +
      " c = mix(c, vec3(0.27,0.40,0.62), s*0.25);" +
      " gl_FragColor = vec4(c,1.0); }";
    function sh(ty, src) { var s = gl.createShader(ty); gl.shaderSource(s, src); gl.compileShader(s); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var tl = gl.getUniformLocation(prog, "t"); var start = Date.now();
    (function render() { gl.uniform1f(tl, (Date.now() - start) * 0.001); gl.drawArrays(gl.TRIANGLES, 0, 6); requestAnimationFrame(render); })();
  }
})();
