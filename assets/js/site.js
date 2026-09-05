/* =========================================================================
   M2MOKO prototype — shared behaviour
   - injects the shared announcement bar / header / footer
   - mobile nav drawer + bag drawer (prototype, always empty)
   - sticky-header state, scroll reveal, accordions
   - option pickers, filter chips, non-functional form handling
   All content here is prototype scaffolding. No pricing, stock, materials
   or founder claims are asserted — see README.md.
   ========================================================================= */
(function () {
  "use strict";

  /* Mark JS as available so the reveal animation's hidden state applies
     (see site.css). Without JS, content stays visible. */
  document.documentElement.classList.add("js");

  var CONTACT = {
    phone: "+255 745 366 282",
    tel: "+255745366282",
    email: "Makalwehenry7@gmail.com",
    address: "366 Soko Muhogo St, Stone Town, Zanzibar, Tanzania",
    maps: "https://maps.app.goo.gl/AkDnaXj3PsjbapiY6",
    instagram: "https://www.instagram.com/m2moko/",
    facebook: "https://www.facebook.com/people/M2moko/100067398135092/"
  };

  var NAV = [
    { label: "New Arrivals", short: "New Arrivals", href: "shop.html#new", key: "new" },
    { label: "Shop All", short: "Shop", href: "shop.html", key: "shop" },
    { label: "About", short: "About", href: "about.html", key: "about" },
    { label: "Visit the Store", short: "Visit", href: "visit.html", key: "visit" },
    { label: "Contact", short: "Contact", href: "contact.html", key: "contact" }
  ];

  /* Secondary categories — shown in the mobile drawer only. */
  var NAV_CATS = [
    { label: "Sets", href: "shop.html?c=sets" },
    { label: "Shirts & Tops", href: "shop.html?c=tops" },
    { label: "Trousers", href: "shop.html?c=trousers" }
  ];

  var page = document.body.getAttribute("data-page") || "";

  /* ---------- markup builders ------------------------------------------ */
  function svgIcon(name) {
    var p = {
      search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
      bag: '<path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
      menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
      close: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (p[name] || "") + "</svg>";
  }

  function navLinks(mobile) {
    return NAV.map(function (item) {
      var current = item.key === page ? ' aria-current="page"' : "";
      var text = mobile ? item.label : (item.short || item.label);
      return '<a href="' + item.href + '"' + current + (mobile ? ' data-nav-close' : "") +
        ">" + text + "</a>";
    }).join("");
  }

  function buildHeader() {
    var mount = document.getElementById("site-header");
    if (!mount) return;
    mount.innerHTML =
      '<div class="announce" role="region" aria-label="Announcement">' +
        'Made in Zanzibar <span>&bull;</span> Worldwide shipping <span>&bull;</span> Visit us in Stone Town' +
      "</div>" +
      '<header class="site-header" id="header">' +
        '<div class="header-inner">' +
          '<div style="display:flex;align-items:center;gap:.5rem">' +
            '<button class="icon-btn nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-nav-open>' +
              svgIcon("menu") +
            "</button>" +
            '<nav class="nav-primary" aria-label="Primary">' + navLinks(false) + "</nav>" +
          "</div>" +
          '<a class="brand-mark" href="index.html" aria-label="M2MOKO home">M2MOKO</a>' +
          '<div class="header-utils">' +
            '<a class="icon-btn" href="shop.html" aria-label="Search the shop">' + svgIcon("search") + "</a>" +
            '<button class="icon-btn bag-btn" type="button" aria-label="Open shopping bag" data-bag-open>' +
              svgIcon("bag") + '<span class="bag-count" hidden>0</span>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</header>" +
      /* mobile nav drawer */
      '<div class="nav-drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden>' +
        '<div class="nav-drawer-top">' +
          '<span class="brand-mark" style="font-size:1.1rem">M2MOKO</span>' +
          '<button class="icon-btn" type="button" aria-label="Close menu" data-nav-close>' + svgIcon("close") + "</button>" +
        "</div>" +
        "<nav aria-label='Mobile'>" + navLinks(true) + "</nav>" +
        '<div class="nav-drawer-cats">' +
          "<span>Categories</span>" +
          NAV_CATS.map(function (c) {
            return '<a href="' + c.href + '" data-nav-close>' + c.label + "</a>";
          }).join("") +
        "</div>" +
        '<div class="nav-drawer-meta">' +
          "<div>" + CONTACT.address + "</div>" +
          '<div><a href="tel:' + CONTACT.tel + '">' + CONTACT.phone + "</a></div>" +
          '<div><a href="' + CONTACT.instagram + '" target="_blank" rel="noopener">Instagram</a> &nbsp; ' +
          '<a href="' + CONTACT.facebook + '" target="_blank" rel="noopener">Facebook</a></div>' +
        "</div>" +
      "</div>" +
      /* bag drawer */
      '<div class="overlay" data-close-drawers></div>' +
      '<aside class="bag-drawer" id="bag-drawer" role="dialog" aria-modal="true" aria-label="Shopping bag" hidden>' +
        '<div class="bag-drawer-head">' +
          "<h2>Shopping bag</h2>" +
          '<button class="icon-btn" type="button" aria-label="Close bag" data-close-drawers>' + svgIcon("close") + "</button>" +
        "</div>" +
        '<div class="bag-empty">' +
          "<p>Your bag is empty</p>" +
          '<p style="max-width:32ch">Online checkout opens once the M2MOKO catalogue, pricing and fulfilment are confirmed. Until then, enquire about any piece and we will reply personally.</p>' +
          '<a class="btn btn--solid" href="contact.html">Enquire about a piece</a>' +
        "</div>" +
      "</aside>";
  }

  function buildFooter() {
    var mount = document.getElementById("site-footer");
    if (!mount) return;
    var year = new Date().getFullYear();
    mount.innerHTML =
      '<footer class="site-footer">' +
        '<div class="wrap">' +
          '<div class="footer-grid">' +
            '<div class="footer-brand">' +
              '<span class="brand-mark">M2MOKO</span>' +
              "<p>Relaxed contemporary clothing made in Zanzibar and shipped worldwide. " +
              "Visit the store in Stone Town or enquire online.</p>" +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>Shop</h3>" +
              '<a href="shop.html#new">New Arrivals</a>' +
              '<a href="shop.html">Shop All</a>' +
              '<a href="shop.html?c=sets">Sets</a>' +
              '<a href="shop.html?c=tops">Shirts &amp; Tops</a>' +
              '<a href="shop.html?c=trousers">Trousers</a>' +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>M2MOKO</h3>" +
              '<a href="about.html">About &amp; Craftsmanship</a>' +
              '<a href="visit.html">Visit the Zanzibar Store</a>' +
              '<a href="contact.html">Contact</a>' +
              '<a href="' + CONTACT.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
              '<a href="' + CONTACT.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>Client Care</h3>" +
              '<a href="policies.html#shipping">Shipping</a>' +
              '<a href="policies.html#returns">Returns &amp; Exchanges</a>' +
              '<a href="policies.html#privacy">Privacy</a>' +
              '<a href="policies.html#terms">Terms</a>' +
              '<a href="tel:' + CONTACT.tel + '">' + CONTACT.phone + "</a>" +
            "</div>" +
          "</div>" +
          '<div class="footer-bottom">' +
            "<span>&copy; " + year + " M2MOKO. Made in Zanzibar, Tanzania.</span>" +
            '<span>Prototype build &mdash; content pending client confirmation.</span>' +
          "</div>" +
        "</div>" +
      "</footer>";
  }

  /* ---------- drawers ------------------------------------------------- */
  function initDrawers() {
    var body = document.body;
    var navDrawer = document.getElementById("nav-drawer");
    var bagDrawer = document.getElementById("bag-drawer");
    var overlay = document.querySelector(".overlay");
    var toggle = document.querySelector("[data-nav-open]");
    var lastFocus = null;

    function openEl(el) {
      lastFocus = document.activeElement;
      el.hidden = false;
      void el.offsetWidth; /* commit the shown state so the transition runs */
      el.classList.add("is-open");
      if (el === bagDrawer && overlay) { overlay.classList.add("is-open"); }
      body.classList.add("nav-open");
      var f = el.querySelector("a, button");
      if (f) f.focus();
      document.addEventListener("keydown", onKey);
    }
    function closeAll() {
      [navDrawer, bagDrawer].forEach(function (el) {
        if (!el) return;
        el.classList.remove("is-open");
        setTimeout(function () { el.hidden = true; }, 450);
      });
      if (overlay) overlay.classList.remove("is-open");
      body.classList.remove("nav-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("keydown", onKey);
      if (lastFocus) lastFocus.focus();
    }
    function onKey(e) { if (e.key === "Escape") closeAll(); }

    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-nav-open],[data-bag-open],[data-nav-close],[data-close-drawers]");
      if (!t) return;
      if (t.hasAttribute("data-nav-open")) { t.setAttribute("aria-expanded", "true"); openEl(navDrawer); }
      else if (t.hasAttribute("data-bag-open")) { openEl(bagDrawer); }
      else { closeAll(); }
    });
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-nav-close]")) return;
      var link = e.target.closest("#nav-drawer a");
      if (link) closeAll();
    });
  }

  /* ---------- sticky header shadow ---------------------------------------- */
  function initStickyHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- scroll reveal --------------------------------------------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- accordions ---------------------------------------------- */
  function initAccordions() {
    document.querySelectorAll(".acc-trigger").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".acc-item");
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  /* ---------- option pickers (swatch / size) --------------------------- */
  function initPickers() {
    document.querySelectorAll("[data-picker]").forEach(function (group) {
      group.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        group.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
      });
    });
  }

  /* ---------- forms (non-functional prototype) ----------------------- */
  function initForms() {
    document.querySelectorAll("form[data-proto]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var status = form.querySelector(".form-status");
        if (status) {
          status.textContent = "Thank you — this is a prototype form and nothing was sent. " +
            "Connect it to M2MOKO's email or newsletter tool before launch.";
          status.classList.add("ok");
        }
        form.reset();
      });
    });
  }

  /* ---------- shop filter chips -------------------------------------- */
  function initShopFilter() {
    var chips = document.querySelectorAll("[data-filter]");
    var cards = document.querySelectorAll("[data-cat]");
    var count = document.querySelector("[data-shop-count]");
    if (!chips.length || !cards.length) return;

    function apply(cat) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = cat === "all" || card.getAttribute("data-cat").split(" ").indexOf(cat) > -1;
        card.classList.toggle("hide", !match);
        if (match) shown++;
      });
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-filter") === cat ? "true" : "false");
      });
      if (count) count.textContent = shown + (shown === 1 ? " piece" : " pieces");
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var cat = chip.getAttribute("data-filter");
        apply(cat);
        history.replaceState(null, "", cat === "all" ? "shop.html" : "shop.html?c=" + cat);
      });
    });

    var params = new URLSearchParams(location.search);
    apply(params.get("c") || "all");
  }

  /* ---------- boot --------------------------------------------------- */
  function boot() {
    buildHeader();
    buildFooter();
    initDrawers();
    initStickyHeader();
    initReveal();
    initAccordions();
    initPickers();
    initForms();
    initShopFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
