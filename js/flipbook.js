(function () {
  var BOOKS = {
    industrial: { pages: 8, pdf: "assets/pdf/cuadriptico-industrial.pdf", folder: "industrial" },
    farmaceutica: { pages: 8, pdf: "assets/pdf/cuadriptico-farmaceutica.pdf", folder: "farmaceutica" },
    "ciencias-de-la-vida": { pages: 8, pdf: "assets/pdf/cuadriptico-ciencias-de-la-vida.pdf", folder: "ciencias-de-la-vida" },
    ambiental: { pages: 8, pdf: "assets/pdf/cuadriptico-ambiental.pdf", folder: "ambiental" },
    alimentos: { pages: 8, pdf: "assets/pdf/cuadriptico-alimentos.pdf", folder: "alimentos" },
    clinico: { pages: 8, pdf: "assets/pdf/cuadriptico-clinico.pdf", folder: "clinico" },
    catalogo: { pages: 8, pdf: "assets/pdf/catalogo-promelab-2026.pdf", folder: "catalogo" }
  };

  var CRITICAL_CSS = [
    "#book{position:fixed!important;inset:0!important;z-index:99999!important;display:none!important;",
    "align-items:center!important;justify-content:center!important;padding:18px!important;box-sizing:border-box!important;margin:0!important}",
    "#book.is-open{display:flex!important}",
    "#book .book__scrim{position:absolute!important;inset:0!important;background:rgba(30,8,18,.82)!important;cursor:pointer!important;border:0!important}",
    "#book .book__panel{position:relative!important;z-index:1!important;width:min(920px,100%)!important;",
    "height:min(860px,calc(100vh - 36px))!important;max-height:calc(100vh - 36px)!important;",
    "background:#fbf5f1!important;border:1px solid #ead9df!important;display:flex!important;",
    "flex-direction:column!important;overflow:hidden!important;box-shadow:0 24px 60px rgba(0,0,0,.35)!important}",
    "#book .book__bar{display:flex!important;justify-content:space-between!important;gap:16px!important;",
    "align-items:center!important;padding:16px 20px!important;background:#fff!important;border-bottom:1px solid #ead9df!important;flex:0 0 auto!important}",
    "#book .book__kicker{margin:0 0 2px!important;font-size:12px!important;font-weight:600!important;",
    "letter-spacing:.14em!important;text-transform:uppercase!important;color:#d63384!important}",
    "#book .book__bar h2{font-size:34px!important;margin:0!important;color:#8f0948!important;",
    "font-family:\"Bebas Neue\",Impact,sans-serif!important;font-weight:400!important;line-height:.95!important}",
    "#book .book__actions{display:flex!important;align-items:center!important;gap:10px!important}",
    "#book .book__x{width:42px!important;height:42px!important;border:0!important;background:#8f0948!important;",
    "color:#fff!important;font-size:28px!important;line-height:1!important;cursor:pointer!important}",
    "#book .book__stage{position:relative!important;flex:1 1 auto!important;display:flex!important;",
    "align-items:center!important;justify-content:center!important;gap:10px!important;padding:18px 12px!important;",
    "min-height:320px!important;background:#241018!important}",
    "#book .book__nav{width:48px!important;height:48px!important;border:0!important;background:#d63384!important;",
    "color:#fff!important;font-size:32px!important;line-height:1!important;cursor:pointer!important;flex:0 0 auto!important}",
    "#book .book__nav:disabled{opacity:.35!important;cursor:default!important}",
    "#book .book__scene{perspective:1800px!important;width:min(420px,62vw)!important;aspect-ratio:560/746!important;",
    "min-height:280px!important;height:auto!important;flex:0 0 auto!important;position:relative!important}",
    "#book .book__stack{position:relative!important;width:100%!important;height:100%!important;min-height:280px!important;",
    "transform-style:preserve-3d!important}",
    "#book .book__leaf{position:absolute!important;inset:0!important;transform-origin:left center!important;",
    "transform-style:preserve-3d!important;transition:transform .7s cubic-bezier(.19,1,.22,1)!important;",
    "border-radius:2px 8px 8px 2px!important;box-shadow:0 18px 40px rgba(0,0,0,.35)!important;background:#fff!important}",
    "#book .book__leaf.is-turned{transform:rotateY(-178deg)!important}",
    "#book .book__face{position:absolute!important;inset:0!important;backface-visibility:hidden!important;",
    "-webkit-backface-visibility:hidden!important;overflow:hidden!important;background:#fff!important}",
    "#book .book__face--front img{width:100%!important;height:100%!important;object-fit:cover!important;",
    "display:block!important;pointer-events:none!important;max-width:none!important}",
    "#book .book__face--back{transform:rotateY(180deg)!important;background:#fbf5f1!important}",
    "#book .book__foot{display:flex!important;justify-content:space-between!important;gap:12px!important;",
    "align-items:center!important;padding:12px 20px!important;background:#fff!important;",
    "border-top:1px solid #ead9df!important;font-size:14px!important;flex:0 0 auto!important}",
    "#book .book__foot p{margin:0!important}",
    "#book .book__hint{color:#6b5660!important}",
    "@media (max-width:700px){#book{padding:0!important}",
    "#book .book__panel{max-height:100vh!important;height:100vh!important;width:100%!important}",
    "#book .book__scene{width:min(320px,70vw)!important}#book .book__actions .btn{display:none!important}",
    "#book .book__hint{display:none!important}}"
  ].join("");

  if (!document.getElementById("book-critical-css")) {
    var styleTag = document.createElement("style");
    styleTag.id = "book-critical-css";
    styleTag.textContent = CRITICAL_CSS;
    document.head.appendChild(styleTag);
  }

  var root = document.getElementById("book");
  if (!root) return;

  // Keep modal on body so fixed positioning never breaks under transformed ancestors
  if (root.parentElement !== document.body) {
    document.body.appendChild(root);
  }

  var titleEl = document.getElementById("book-title");
  var countEl = document.getElementById("book-count");
  var scene = document.getElementById("book-scene");
  var pdfLink = document.getElementById("book-pdf");
  var prevBtn = document.getElementById("book-prev");
  var nextBtn = document.getElementById("book-next");
  var page = 0;
  var total = 0;
  var flipping = false;
  var touchX = null;
  var lastFocus = null;
  var openKey = "";

  function pad(n) {
    return (n < 10 ? "0" : "") + n;
  }

  function pageUrl(folder, n) {
    return "assets/img/flip/" + folder + "/" + pad(n) + ".webp";
  }

  function isOpen() {
    return root.classList.contains("is-open");
  }

  function forceOverlayStyles() {
    root.style.cssText =
      "position:fixed!important;inset:0!important;top:0!important;right:0!important;bottom:0!important;left:0!important;" +
      "z-index:99999!important;display:flex!important;align-items:center!important;justify-content:center!important;" +
      "padding:18px!important;box-sizing:border-box!important;margin:0!important;width:auto!important;height:auto!important;";
  }

  function clearOverlayStyles() {
    root.style.cssText = "display:none!important";
  }

  function updateChrome() {
    var hint = root.querySelector(".book__hint");
    countEl.textContent = page + 1 + " / " + total;
    prevBtn.disabled = page <= 0 || flipping;
    nextBtn.disabled = page >= total - 1 || flipping;
    if (hint) {
      hint.textContent =
        openKey === "catalogo"
          ? "Vista previa de las primeras páginas · descarga el PDF completo"
          : "Haz clic en la hoja, usa las flechas o desliza para pasar la página";
    }
  }

  function buildLeaves(folder, count) {
    scene.innerHTML = "";
    scene.className = "book__scene";
    var stack = document.createElement("div");
    stack.className = "book__stack";
    for (var i = count; i >= 1; i--) {
      var leaf = document.createElement("div");
      leaf.className = "book__leaf";
      leaf.dataset.index = String(i - 1);
      var front = document.createElement("div");
      front.className = "book__face book__face--front";
      var img = document.createElement("img");
      img.src = pageUrl(folder, i);
      img.alt = "Página " + i;
      img.draggable = false;
      img.decoding = "async";
      img.width = 560;
      img.height = 746;
      front.appendChild(img);
      var back = document.createElement("div");
      back.className = "book__face book__face--back";
      leaf.appendChild(front);
      leaf.appendChild(back);
      stack.appendChild(leaf);
    }
    scene.appendChild(stack);
    stack.addEventListener("click", function () {
      if (page < total - 1) next();
      else prev();
    });
  }

  function syncLeaves() {
    var leaves = scene.querySelectorAll(".book__leaf");
    leaves.forEach(function (leaf) {
      var idx = Number(leaf.dataset.index);
      leaf.classList.toggle("is-turned", idx < page);
      leaf.style.zIndex = idx < page ? String(idx + 1) : String(total - idx);
    });
  }

  function openBook(key, title) {
    var conf = BOOKS[key];
    if (!conf) return;
    lastFocus = document.activeElement;
    openKey = key;
    total = conf.pages;
    page = 0;
    flipping = false;
    titleEl.textContent = title || key;
    pdfLink.href = conf.pdf;
    buildLeaves(conf.folder, conf.pages);
    syncLeaves();
    updateChrome();
    root.setAttribute("aria-hidden", "false");
    root.classList.add("is-open");
    forceOverlayStyles();
    document.body.style.overflow = "hidden";
    try {
      nextBtn.focus();
    } catch (e) {}
  }

  function closeBook() {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
    clearOverlayStyles();
    document.body.style.overflow = "";
    scene.innerHTML = "";
    if (lastFocus && lastFocus.focus) {
      try {
        lastFocus.focus();
      } catch (e) {}
    }
  }

  function flipTo(nextPage) {
    if (flipping || nextPage < 0 || nextPage > total - 1 || nextPage === page) return;
    flipping = true;
    page = nextPage;
    syncLeaves();
    updateChrome();
    setTimeout(function () {
      flipping = false;
      updateChrome();
    }, 700);
  }

  function next() {
    flipTo(page + 1);
  }
  function prev() {
    flipTo(page - 1);
  }

  // Start closed even if old CSS left the block visible at the page foot
  clearOverlayStyles();

  document.addEventListener("click", function (e) {
    var openBtn = e.target.closest("[data-book]");
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      openBook(openBtn.getAttribute("data-book"), openBtn.getAttribute("data-title"));
      return;
    }
    if (e.target.closest("[data-book-close]")) {
      e.preventDefault();
      closeBook();
    }
  });

  prevBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    next();
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;
    if (e.key === "Escape") closeBook();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  scene.addEventListener(
    "touchstart",
    function (e) {
      touchX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );
  scene.addEventListener(
    "touchend",
    function (e) {
      if (touchX == null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      touchX = null;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );
})();
