// Small enhancements for the homepage. Every section is readable without JavaScript.
(function () {
  "use strict";

  var root = document.documentElement;

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

  /* ---------------- Header: border on scroll, mobile menu, active section ---------------- */
  var header = document.querySelector("[data-nav]");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 4); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var menuBtn = header.querySelector(".nav-menu");
    var closeMenu = function () {
      header.classList.remove("is-open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Open menu");
      }
    };
    if (menuBtn) {
      menuBtn.addEventListener("click", function () {
        var open = !header.classList.contains("is-open");
        header.classList.toggle("is-open", open);
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      });
      each(".site-nav a", function (a) { a.addEventListener("click", closeMenu); }, header);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
      document.addEventListener("click", function (e) { if (!header.contains(e.target)) closeMenu(); });
    }

    var links = Array.prototype.slice.call(header.querySelectorAll(".site-nav a"));
    var bySection = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1] || "";
      if (id && document.getElementById(id)) bySection[id] = a;
    });
    var ids = Object.keys(bySection);
    if (ids.length && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("is-active"); });
          bySection[entry.target.id].classList.add("is-active");
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      ids.forEach(function (id) { observer.observe(document.getElementById(id)); });
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
  each("[data-copy]", function (btn) {
    var label = btn.querySelector(".copy-btn__label");
    var original = label ? label.textContent : "";
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy"));
      if (!target) return;
      var text = target.textContent;
      var show = function (ok) {
        if (label) label.textContent = ok ? "Copied" : "Press Ctrl+C to copy";
        btn.classList.toggle("is-copied", ok);
        window.setTimeout(function () {
          if (label) label.textContent = original;
          btn.classList.remove("is-copied");
        }, 1600);
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

  /* ---------------- Publication filter (all / first author) ---------------- */
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var onlyFirst = btn.getAttribute("data-filter") === "first";
      filterButtons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      each(".pub-group", function (group) {
        var shown = 0;
        each(".pub", function (item) {
          var match = !onlyFirst || item.getAttribute("data-first") === "true";
          item.hidden = !match;
          if (match) shown++;
        }, group);
        group.hidden = shown === 0;
      });
    });
  });
})();
