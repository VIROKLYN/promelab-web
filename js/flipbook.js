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

  var root = document.getElementById("book");
  if (!root) return;

  // Keep modal on body so fixed positioning never breaks
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
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    try {
      nextBtn.focus();
    } catch (e) {}
  }

  function closeBook() {
    if (!isOpen()) return;
    root.classList.remove("is-open");
    root.setAttribute("aria-hidden", "true");
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
