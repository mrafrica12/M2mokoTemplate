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
    whatsapp: "255745366282", /* wa.me format, no + or spaces */
    email: "Makalwehenry7@gmail.com",
    address: "366 Soko Muhogo St, Stone Town, Zanzibar, Tanzania",
    maps: "https://maps.app.goo.gl/atzRvAVsEML9krUZ9",
    instagram: "https://www.instagram.com/m2moko/",
    facebook: "https://www.facebook.com/people/M2moko/100067398135092/",
    youtube: "https://www.youtube.com/@Makalwehenry"
  };

  /* Public social channels for the "Follow us" row. Instagram and Facebook are
     verified (see COMPANY_RESEARCH.md); the YouTube channel was supplied by the
     client. LinkedIn / Pinterest / TikTok are intentionally omitted until an
     official account is confirmed. */
  var SOCIAL = [
    { key: "instagram", label: "Instagram", href: CONTACT.instagram },
    { key: "facebook",  label: "Facebook",  href: CONTACT.facebook },
    { key: "youtube",   label: "YouTube",   href: CONTACT.youtube }
  ];

  /* Quick topics for the WhatsApp panel. The `topic` text is folded into the
     pre-filled message; the customer can still type their own question. */
  var WA_TOPICS = [
    { label: "A piece on the site", topic: "a piece I saw on the M2MOKO website" },
    { label: "Custom order", topic: "a custom or made-to-measure order" },
    { label: "Fitting / store visit", topic: "a fitting or a visit to the Stone Town store" },
    { label: "Shipping", topic: "shipping and delivery to my country" },
    { label: "Wholesale / press", topic: "a wholesale or press enquiry" }
  ];

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

  /* Every page except the homepage lives in /pages/. Build links and asset
     URLs that resolve correctly whether the current document is the root
     index.html or a file inside /pages/ (works over file:// and any mount). */
  var IN_PAGES = /(^|\/)pages\/[^/]*$/.test(location.pathname);
  function P(name) { return (IN_PAGES ? "" : "pages/") + name; }
  var HOME = IN_PAGES ? "../index.html" : "index.html";
  var ASSETS = IN_PAGES ? "../assets/" : "assets/";
  var LOGO = ASSETS + "logo/m2moko-logo-header.webp";

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

  /* Solid brand glyphs for the social row (source: Simple Icons, CC0). */
  function brandIcon(name) {
    var p = {
      instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
      facebook: '<path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647z"/>',
      youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + (p[name] || "") + "</svg>";
  }

  function socialRow() {
    return '<div class="footer-social">' +
      '<span class="footer-social-label">Follow us</span>' +
      '<ul class="footer-social-list">' +
        SOCIAL.map(function (s) {
          return '<li><a class="footer-social-link is-' + s.key + '" href="' + s.href + '" ' +
            'target="_blank" rel="noopener" aria-label="M2MOKO on ' + s.label + '">' +
            brandIcon(s.key) + "</a></li>";
        }).join("") +
      "</ul>" +
    "</div>";
  }

  function navLinks(mobile) {
    return NAV.map(function (item, i) {
      var current = item.key === page ? ' aria-current="page"' : "";
      if (mobile) {
        return '<a href="' + P(item.href) + '"' + current + ' data-nav-close style="--i:' + (i + 1) + '">' +
          '<span class="nav-ix">' + ("0" + (i + 1)).slice(-2) + "</span>" +
          '<span class="nav-lbl">' + item.label + "</span>" +
          '<span class="nav-arw" aria-hidden="true">&rarr;</span>' +
          "</a>";
      }
      return '<a href="' + P(item.href) + '"' + current + ">" + (item.short || item.label) + "</a>";
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
          '<a class="brand-logo-link" href="' + HOME + '" aria-label="M2MOKO — home">' +
            '<img class="brand-logo" src="' + LOGO + '" alt="M2MOKO" width="600" height="397">' +
          "</a>" +
          '<div class="header-utils">' +
            '<a class="icon-btn" href="' + P("shop.html") + '" aria-label="Search the shop">' + svgIcon("search") + "</a>" +
            '<button class="icon-btn bag-btn" type="button" aria-label="Open shopping bag" data-bag-open>' +
              svgIcon("bag") + '<span class="bag-count" hidden>0</span>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</header>" +
      /* mobile nav drawer */
      '<div class="nav-drawer" id="nav-drawer" role="dialog" aria-modal="true" aria-label="Menu" hidden>' +
        '<div class="nav-drawer-top">' +
          '<a href="' + HOME + '" data-nav-close aria-label="M2MOKO — home">' +
            '<img class="brand-logo brand-logo--sm" src="' + LOGO + '" alt="M2MOKO" width="600" height="397">' +
          "</a>" +
          '<button class="icon-btn" type="button" aria-label="Close menu" data-nav-close>' + svgIcon("close") + "</button>" +
        "</div>" +
        "<nav aria-label='Mobile'>" + navLinks(true) + "</nav>" +
        '<div class="nav-drawer-cats" style="--i:' + (NAV.length + 1) + '">' +
          "<span>Categories</span>" +
          NAV_CATS.map(function (c) {
            return '<a href="' + P(c.href) + '" data-nav-close>' + c.label + "</a>";
          }).join("") +
        "</div>" +
        '<div class="nav-drawer-meta" style="--i:' + (NAV.length + 2) + '">' +
          "<div>" + CONTACT.address + "</div>" +
          '<div><a href="tel:' + CONTACT.tel + '">' + CONTACT.phone + "</a></div>" +
          '<div><a href="' + CONTACT.maps + '" target="_blank" rel="noopener">Directions &middot; Google Maps</a></div>' +
          '<div><a href="' + CONTACT.instagram + '" target="_blank" rel="noopener">Instagram</a> &nbsp; ' +
          '<a href="' + CONTACT.facebook + '" target="_blank" rel="noopener">Facebook</a> &nbsp; ' +
          '<a href="' + CONTACT.youtube + '" target="_blank" rel="noopener">YouTube</a></div>' +
          '<p class="nav-drawer-sign">Made in Zanzibar</p>' +
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
          '<a class="btn btn--solid" href="' + P("contact.html") + '">Enquire about a piece</a>' +
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
              '<a href="' + HOME + '" aria-label="M2MOKO — home">' +
                '<img class="brand-logo brand-logo--footer" src="' + LOGO + '" alt="M2MOKO" width="600" height="397">' +
              "</a>" +
              "<p>Relaxed contemporary clothing made in Zanzibar and shipped worldwide. " +
              "Visit the store in Stone Town or enquire online.</p>" +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>Shop</h3>" +
              '<a href="' + P("shop.html#new") + '">New Arrivals</a>' +
              '<a href="' + P("shop.html") + '">Shop All</a>' +
              '<a href="' + P("shop.html?c=sets") + '">Sets</a>' +
              '<a href="' + P("shop.html?c=tops") + '">Shirts &amp; Tops</a>' +
              '<a href="' + P("shop.html?c=trousers") + '">Trousers</a>' +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>M2MOKO</h3>" +
              '<a href="' + P("about.html") + '">About &amp; Craftsmanship</a>' +
              '<a href="' + P("visit.html") + '">Visit the Zanzibar Store</a>' +
              '<a href="' + P("contact.html") + '">Contact</a>' +
              '<a href="' + CONTACT.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
              '<a href="' + CONTACT.facebook + '" target="_blank" rel="noopener">Facebook</a>' +
              '<a href="' + CONTACT.youtube + '" target="_blank" rel="noopener">YouTube</a>' +
            "</div>" +
            '<div class="footer-col">' +
              "<h3>Client Care</h3>" +
              '<a href="' + P("policies.html#shipping") + '">Shipping</a>' +
              '<a href="' + P("policies.html#returns") + '">Returns &amp; Exchanges</a>' +
              '<a href="' + P("policies.html#privacy") + '">Privacy</a>' +
              '<a href="' + P("policies.html#terms") + '">Terms</a>' +
              '<a href="tel:' + CONTACT.tel + '">' + CONTACT.phone + "</a>" +
              '<a href="' + CONTACT.maps + '" target="_blank" rel="noopener">Find us on Google Maps</a>' +
            "</div>" +
          "</div>" +
          socialRow() +
          '<div class="footer-bottom">' +
            "<span>&copy; " + year + " M2MOKO. Made in Zanzibar, Tanzania.</span>" +
            '<span class="footer-bottom-end">' +
              "<span>Prototype build &mdash; content pending client confirmation.</span>" +
              '<span class="site-credit">Site Design by ' +
                '<a href="https://umojaserv.com/" target="_blank" rel="noopener">UmojaServ</a>' +
              "</span>" +
            "</span>" +
          "</div>" +
        "</div>" +
      "</footer>";
  }

  /* ---------- floating WhatsApp button ------------------------------- */
  function waGlyph(cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">' +
      '<path d="M16.004 3.2C8.944 3.2 3.2 8.94 3.2 16c0 2.257.59 4.46 1.71 6.402L3.2 28.8l6.573-1.674A12.74 12.74 0 0 0 16.004 28.8h.006c7.06 0 12.8-5.74 12.8-12.8 0-3.42-1.332-6.635-3.75-9.053A12.72 12.72 0 0 0 16.004 3.2Zm0 2.133c2.848 0 5.523 1.11 7.537 3.124a10.6 10.6 0 0 1 3.126 7.543c0 5.884-4.786 10.667-10.67 10.667h-.005a10.62 10.62 0 0 1-5.41-1.48l-.388-.23-4.006 1.02 1.07-3.903-.253-.4a10.6 10.6 0 0 1-1.63-5.664c.002-5.884 4.786-10.667 10.67-10.667Zm-4.13 5.53c-.195 0-.51.073-.777.365-.267.292-1.02.997-1.02 2.432 0 1.435 1.045 2.82 1.19 3.015.146.195 2.06 3.145 4.99 4.41.696.3 1.24.48 1.664.615.7.222 1.336.19 1.84.115.56-.084 1.727-.706 1.97-1.388.243-.68.243-1.264.17-1.386-.073-.122-.267-.195-.56-.34-.292-.147-1.726-.852-1.993-.95-.267-.097-.462-.146-.657.146-.195.292-.753.95-.924 1.145-.17.195-.34.22-.632.073-.292-.146-1.232-.454-2.347-1.448-.868-.773-1.453-1.73-1.624-2.022-.17-.292-.018-.45.128-.596.132-.13.292-.34.438-.51.146-.17.195-.292.292-.487.097-.195.05-.365-.024-.51-.073-.147-.638-1.593-.898-2.18-.235-.53-.475-.46-.657-.47-.17-.008-.365-.01-.56-.01Z"/></svg>';
  }

  function buildWhatsApp() {
    if (document.querySelector(".wa-widget")) return;
    var wrap = document.createElement("div");
    wrap.className = "wa-widget";
    wrap.innerHTML =
      '<div class="wa-panel" id="wa-panel" role="dialog" aria-label="Message M2MOKO on WhatsApp" hidden>' +
        '<div class="wa-panel-head">' +
          '<span class="wa-avatar" aria-hidden="true">M2</span>' +
          '<span class="wa-id">' +
            '<span class="wa-name">M2MOKO</span>' +
            '<span class="wa-status">Made in Zanzibar &middot; replies personally</span>' +
          "</span>" +
          '<button class="wa-close icon-btn" type="button" aria-label="Close" data-wa-close>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>' +
          "</button>" +
        "</div>" +
        '<div class="wa-panel-body">' +
          '<p class="wa-intro">Hello &mdash; how can we help? Pick a topic or write your own message, and we&rsquo;ll continue on WhatsApp.</p>' +
          '<div class="wa-chips" data-wa-chips role="group" aria-label="Topic">' +
            WA_TOPICS.map(function (t, i) {
              return '<button type="button" class="wa-chip" data-topic="' + t.topic + '" aria-pressed="false">' + t.label + "</button>";
            }).join("") +
          "</div>" +
          '<label class="wa-label" for="wa-msg">Your message</label>' +
          '<textarea id="wa-msg" class="wa-textarea" rows="3" placeholder="Write your question here…"></textarea>' +
          '<a class="btn btn--wa wa-send" data-wa-send target="_blank" rel="noopener" href="#">' +
            waGlyph("wa-send-icon") + "<span>Continue on WhatsApp</span>" +
          "</a>" +
          '<p class="wa-fine">Opens WhatsApp with your message ready to send &middot; ' + CONTACT.phone + "</p>" +
        "</div>" +
      "</div>" +
      '<button class="wa-fab" type="button" data-wa-toggle aria-expanded="false" aria-controls="wa-panel" aria-label="Message M2MOKO on WhatsApp">' +
        waGlyph("wa-fab-icon") +
        '<span class="wa-fab-label">Message us</span>' +
        '<span class="wa-fab-dot" aria-hidden="true"></span>' +
      "</button>";
    document.body.appendChild(wrap);
  }

  function initWhatsApp() {
    var widget = document.querySelector(".wa-widget");
    if (!widget) return;
    var panel = widget.querySelector(".wa-panel");
    var fab = widget.querySelector("[data-wa-toggle]");
    var chipsWrap = widget.querySelector("[data-wa-chips]");
    var textarea = widget.querySelector("#wa-msg");
    var sendLink = widget.querySelector("[data-wa-send]");
    var selectedTopic = "";
    var lastFocus = null;

    function buildMessage() {
      var parts = ["Hello M2MOKO,"];
      if (selectedTopic) parts.push("I'd like to ask about " + selectedTopic + ".");
      var custom = (textarea.value || "").trim();
      if (custom) parts.push(custom);
      parts.push("— sent from the M2MOKO website");
      return parts.join("\n\n");
    }
    function refreshLink() {
      sendLink.href = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(buildMessage());
    }
    function openPanel() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      void panel.offsetWidth;
      widget.classList.add("is-open");
      fab.setAttribute("aria-expanded", "true");
      refreshLink();
      var firstChip = chipsWrap.querySelector("button");
      (firstChip || textarea).focus();
      document.addEventListener("keydown", onKey);
      document.addEventListener("click", onOutside, true);
    }
    function closePanel(returnFocus) {
      widget.classList.remove("is-open");
      fab.setAttribute("aria-expanded", "false");
      setTimeout(function () { panel.hidden = true; }, 320);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onOutside, true);
      if (returnFocus !== false && lastFocus) lastFocus.focus();
    }
    function onKey(e) { if (e.key === "Escape") closePanel(); }
    function onOutside(e) { if (!widget.contains(e.target)) closePanel(false); }

    fab.addEventListener("click", function () {
      if (widget.classList.contains("is-open")) closePanel(); else openPanel();
    });
    widget.querySelector("[data-wa-close]").addEventListener("click", function () { closePanel(); });

    chipsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var active = btn.getAttribute("aria-pressed") === "true";
      chipsWrap.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      if (active) { selectedTopic = ""; }
      else { btn.setAttribute("aria-pressed", "true"); selectedTopic = btn.getAttribute("data-topic"); }
      refreshLink();
    });
    textarea.addEventListener("input", refreshLink);
    sendLink.addEventListener("click", function () { setTimeout(function () { closePanel(false); }, 60); });

    refreshLink();
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
    buildWhatsApp();
    initDrawers();
    initWhatsApp();
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
