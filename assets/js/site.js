// Small enhancements for the homepage. The site works without JavaScript.
(function () {
  "use strict";

  var root = document.documentElement;

  // Light / dark mode toggle. The saved choice is applied in <head> before paint.
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Show a border under the sticky header once the page scrolls.
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // BibTeX panels in the publication list.
  document.querySelectorAll("[data-bibtex-toggle]").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });

  // Copy-to-clipboard buttons.
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

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    var label = btn.querySelector(".copy-btn__label");
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy"));
      if (!target) return;
      var text = target.textContent;
      var show = function (ok) {
        if (label) label.textContent = ok ? "Copied" : "Press Ctrl+C";
        btn.classList.toggle("is-copied", ok);
        window.setTimeout(function () {
          if (label) label.textContent = "Copy";
          btn.classList.remove("is-copied");
        }, 1600);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
          function () { show(true); },
          function () { show(fallbackCopy(text)); }
        );
      } else {
        show(fallbackCopy(text));
      }
    });
  });

  // Highlight the nav link of the section currently on screen.
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var bySection = {};
  navLinks.forEach(function (a) {
    var id = (a.getAttribute("href").split("#")[1] || "");
    var section = id && document.getElementById(id);
    if (section) bySection[id] = a;
  });
  var ids = Object.keys(bySection);
  if (ids.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove("is-active"); });
        bySection[entry.target.id].classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ids.forEach(function (id) { observer.observe(document.getElementById(id)); });
  }
})();
