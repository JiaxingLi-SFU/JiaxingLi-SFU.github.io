// Interactive touches for the homepage. Every section is readable without JavaScript.
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;

  function each(selector, fn, scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll(selector), fn);
  }

  /* ---------------- Light / dark mode ---------------- */
  // The saved choice is applied in <head> before the page paints.
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  each(".theme-toggle", function (btn) {
    btn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  });

  /* ---------------- Navigation ---------------- */
  var nav = document.querySelector("[data-nav]");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var menuBtn = nav.querySelector(".nav__menu");
    var closeMenu = function () {
      nav.classList.remove("is-open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    };
    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        var open = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      each(".nav__links a", function (a) { a.addEventListener("click", closeMenu); }, nav);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
      document.addEventListener("click", function (e) { if (!nav.contains(e.target)) closeMenu(); });
    }

    // Highlight the link of the section on screen.
    var links = Array.prototype.slice.call(nav.querySelectorAll(".nav__links a"));
    var bySection = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1] || "";
      if (id && document.getElementById(id)) bySection[id] = a;
    });
    var ids = Object.keys(bySection);
    if (ids.length && "IntersectionObserver" in window) {
      var navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-active"); });
          bySection[entry.target.id].classList.add("is-active");
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      ids.forEach(function (id) { navObserver.observe(document.getElementById(id)); });
    }
  }

  /* ---------------- Copy to clipboard ---------------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  each("[data-copy], [data-copy-text]", function (btn) {
    var label = btn.querySelector(".copy-btn__label");
    var original = label ? label.textContent : "";
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy-text");
      if (text === null) {
        var target = document.getElementById(btn.getAttribute("data-copy"));
        if (!target) return;
        text = target.textContent;
      }
      var show = function (ok) {
        if (label) label.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
        btn.classList.toggle("is-copied", ok);
        window.setTimeout(function () {
          if (label) label.textContent = original;
          btn.classList.remove("is-copied");
        }, 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { show(true); }, function () { show(fallbackCopy(text)); });
      } else {
        show(fallbackCopy(text));
      }
    });
  });

  /* ---------------- BibTeX dialog ---------------- */
  var dialog = document.getElementById("bib-dialog");
  var hasDialog = dialog && typeof dialog.showModal === "function";
  each("[data-bibtex]", function (btn) {
    btn.addEventListener("click", function () {
      if (!hasDialog) {
        window.location.href = btn.getAttribute("data-href");
        return;
      }
      document.getElementById("bib-dialog-title").textContent = btn.getAttribute("data-title") || "BibTeX";
      document.getElementById("bib-dialog-code").textContent = btn.getAttribute("data-bibtex");
      dialog.showModal();
    });
  });
  if (hasDialog) {
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
    });
  }

  /* ---------------- Publication filters ---------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".pcard"));
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var f = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      cards.forEach(function (card) {
        var match = f === "all" ||
          (f === "first" ? card.getAttribute("data-first") === "true" : card.getAttribute("data-year") === f);
        card.classList.remove("reveal", "is-entering");
        card.hidden = !match;
        if (match && !reduceMotion) {
          void card.offsetWidth; // restart the entrance animation
          card.classList.add("is-entering");
        }
      });
    });
  });

  /* ---------------- Cursor spotlight on cards ---------------- */
  if (canHover && !reduceMotion) {
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest(".spot");
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* ---------------- Night-sky network ----------------
     Small nodes are edge devices, the glowing hubs are cloud servers,
     and bright packets travel from devices to their nearest hub. */
  function initSky(canvas) {
    var ctx = canvas.getContext && canvas.getContext("2d");
    if (!ctx) return;
    var host = canvas.parentElement;
    var quiet = canvas.classList.contains("sky--quiet");
    var w = 0, h = 0, dpr = 1;
    var nodes = [], hubs = [], packets = [];
    var raf = 0, visible = true, last = 0, nextPacket = 0;
    var mouse = { x: -1e4, y: -1e4 };
    var LINK = 118, MOUSE_LINK = 150;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function build() {
      var density = quiet ? 26000 : 15000;
      var count = Math.max(24, Math.min(96, Math.round((w * h) / density)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({ x: rand(0, w), y: rand(0, h), vx: rand(-0.13, 0.13), vy: rand(-0.09, 0.09), r: rand(0.7, 1.8), tw: rand(0, 6.28) });
      }
      var spots = w > 880
        ? [[0.47, 0.17], [0.93, 0.2], [0.6, 0.84]]
        : [[0.2, 0.12], [0.84, 0.18]];
      if (quiet) spots = w > 880 ? [[0.82, 0.3], [0.94, 0.78]] : [[0.88, 0.2]];
      hubs = spots.map(function (p) { return { ox: p[0] * w, oy: p[1] * h, x: p[0] * w, y: p[1] * h, t: rand(0, 6.28) }; });
      packets = [];
    }

    function resize() {
      var r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function spawnPacket() {
      var n = nodes[(Math.random() * nodes.length) | 0];
      var best = null, bestD = Infinity;
      hubs.forEach(function (hub) {
        var d = Math.hypot(hub.x - n.x, hub.y - n.y);
        if (d < bestD) { bestD = d; best = hub; }
      });
      if (best && bestD > 40 && bestD < Math.max(w, h) * 0.6) {
        packets.push({ from: n, to: best, t: 0, speed: rand(0.0035, 0.008) });
      }
    }

    function step(k) {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx * k;
        n.y += n.vy * k;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }
      hubs.forEach(function (hub) {
        hub.t += 0.006 * k;
        hub.x = hub.ox + Math.sin(hub.t) * 7;
        hub.y = hub.oy + Math.cos(hub.t * 0.8) * 5;
      });
      for (var p = packets.length - 1; p >= 0; p--) {
        packets[p].t += packets[p].speed * k;
        if (packets[p].t >= 1) packets.splice(p, 1);
      }
    }

    function draw(time) {
      ctx.clearRect(0, 0, w, h);
      var i, j, a, dx, dy, d2, n, m;

      // Links between nearby devices
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          m = nodes[j];
          dx = n.x - m.x; dy = n.y - m.y; d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            a = (1 - Math.sqrt(d2) / LINK) * 0.26;
            ctx.strokeStyle = "rgba(143, 211, 255, " + a.toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
      }

      // Links from the cursor
      if (mouse.x > -1e3) {
        for (i = 0; i < nodes.length; i++) {
          n = nodes[i];
          dx = n.x - mouse.x; dy = n.y - mouse.y; d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_LINK * MOUSE_LINK) {
            a = (1 - Math.sqrt(d2) / MOUSE_LINK) * 0.5;
            ctx.strokeStyle = "rgba(255, 210, 125, " + a.toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(n.x, n.y); ctx.stroke();
          }
        }
      }

      // Devices (twinkling)
      for (i = 0; i < nodes.length; i++) {
        n = nodes[i];
        a = 0.45 + 0.4 * Math.sin(time * 0.0016 + n.tw);
        ctx.fillStyle = "rgba(238, 242, 250, " + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.2832); ctx.fill();
      }

      // Cloud hubs
      hubs.forEach(function (hub, idx) {
        var g = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 34);
        g.addColorStop(0, "rgba(255, 168, 110, 0.55)");
        g.addColorStop(1, "rgba(255, 143, 94, 0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(hub.x, hub.y, 34, 0, 6.2832); ctx.fill();
        ctx.fillStyle = "#ffd27d";
        ctx.beginPath(); ctx.arc(hub.x, hub.y, 3.2, 0, 6.2832); ctx.fill();
        var ring = 9 + 2.5 * Math.sin(time * 0.002 + idx);
        ctx.strokeStyle = "rgba(255, 210, 125, 0.45)";
        ctx.beginPath(); ctx.arc(hub.x, hub.y, ring, 0, 6.2832); ctx.stroke();
      });

      // Packets on their way to a hub
      packets.forEach(function (p) {
        var e = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;
        var x = p.from.x + (p.to.x - p.from.x) * e;
        var y = p.from.y + (p.to.y - p.from.y) * e;
        var len = Math.hypot(p.to.x - p.from.x, p.to.y - p.from.y) || 1;
        var tx = x - ((p.to.x - p.from.x) / len) * 16;
        var ty = y - ((p.to.y - p.from.y) / len) * 16;
        var fade = Math.sin(Math.PI * p.t);
        var trail = ctx.createLinearGradient(tx, ty, x, y);
        trail.addColorStop(0, "rgba(255, 210, 125, 0)");
        trail.addColorStop(1, "rgba(255, 210, 125, " + (0.85 * fade).toFixed(3) + ")");
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgba(255, 236, 200, " + fade.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(x, y, 1.9, 0, 6.2832); ctx.fill();
      });
    }

    function frame(ts) {
      if (!visible) { raf = 0; return; }
      var k = last ? Math.min(ts - last, 48) / 16.7 : 1;
      last = ts;
      step(k);
      if (ts > nextPacket) {
        spawnPacket();
        nextPacket = ts + rand(quiet ? 500 : 160, quiet ? 1100 : 420);
      }
      draw(ts);
      raf = window.requestAnimationFrame(frame);
    }
    function start() {
      if (raf || reduceMotion) return;
      last = 0;
      raf = window.requestAnimationFrame(frame);
    }
    function stop() {
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    if (reduceMotion) draw(0); else start();

    var resizeTimer = 0;
    window.addEventListener("resize", function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () { resize(); if (reduceMotion) draw(0); }, 150);
    });
    host.addEventListener("pointermove", function (e) {
      var r = host.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    host.addEventListener("pointerleave", function () { mouse.x = mouse.y = -1e4; });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(host);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (visible) start();
    });
  }
  each("canvas.sky", initSky);
})();
