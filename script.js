/*=============== JS Index.html ==================*/

/* UTILIDADES */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/*  BIENVENIDA (modal) */
const welcomeModal = $("#welcomeModal");
const closeModal = $("#closeModal");
const enterSite = $("#enterSite");

function mostrarModal() {
  if (!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden", "false");
}
function ocultarModal() {
  if (!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden", "true");
}

/* Mostrar bienvenida solo la primera vez (localStorage) */
try {
  if (!localStorage.getItem("seenWelcome")) {
    mostrarModal();
    localStorage.setItem("seenWelcome", "1");
  }
} catch (e) { /* si storage bloqueado, no rompe la página */ }

/* Eventos bienvenida */
if (closeModal) closeModal.addEventListener("click", ocultarModal);
if (enterSite) enterSite.addEventListener("click", ocultarModal);

/* Cerrar con Escape o clic en overlay */
if (welcomeModal) {
  welcomeModal.addEventListener("click", (e) => {
    if (e.target === welcomeModal) ocultarModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && welcomeModal.getAttribute("aria-hidden") === "false") ocultarModal();
  });
}

/*  NAV RESPONSIVE */
const navToggle = $("#navToggle");
const mainMenu = $("#mainMenu");
if (navToggle && mainMenu) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mainMenu.classList.toggle("show");
  });

  mainMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && mainMenu.classList.contains("show")) {
      mainMenu.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/*  CARRUSEL / SLIDER */

(function () {
  const slideEls = Array.from(document.querySelectorAll(".diapo"));
  const prevBtn = document.querySelector(".anterior");
  const nextBtn = document.querySelector(".siguiente");
  const dotsWrap = document.getElementById("sliderDots"); // id mantenido
  let idx = 0;
  let timer = null;
  const DELAY = 4500;

  if (slideEls.length === 0) return;

  // crear puntos (dots)
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slideEls.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.addEventListener("click", () => { irA(i); reiniciar(); });
      if (i === 0) b.classList.add("activo");
      dotsWrap.appendChild(b);
    });
  }


  function irA(i) {
    slideEls.forEach((s, j) => s.classList.toggle("activa", j === i));
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, j) => d.classList.toggle("activo", j === i));
    }
    idx = i;
  }
  function siguiente() { irA((idx + 1) % slideEls.length); }
  function anterior() { irA((idx - 1 + slideEls.length) % slideEls.length); }
  function iniciar() { detener(); timer = setInterval(siguiente, DELAY); }
  function detener() { if (timer) { clearInterval(timer); timer = null; } }
  function reiniciar() { detener(); iniciar(); }

  if (nextBtn) nextBtn.addEventListener("click", () => { siguiente(); reiniciar(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { anterior(); reiniciar(); });

  // iniciar el slider 
  irA(0);
  iniciar();

  // export minimal debugging handles 
  window._sliderControl = { irA, siguiente, anterior, iniciar, detener, reiniciar };
})();

/* Cerrar dropdowns al click fuera */
document.addEventListener("click", (e) => {
  const cartEl = $("#cartWidget");
  if (cartDropdown && cartEl && !cartEl.contains(e.target) && cartDropdown.style.display === "block") {
    cartDropdown.style.display = "none";
  }

  // cerrar menú móvil al hacer click fuera (si está abierto)
  if (mainMenu && mainMenu.classList.contains("show")) {
    const navToggleEl = $("#navToggle");
    const navWrap = document.querySelector(".navegacion");
    if (navWrap && !navWrap.contains(e.target) && navToggleEl && e.target !== navToggleEl) {
      mainMenu.classList.remove("show");
      if (navToggleEl) navToggleEl.setAttribute("aria-expanded", "false");
    }
  }
});

/* AÑO EN FOOTER */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

//cerrarSesion
document.getElementById("logoutBtn").addEventListener("click", function () {
  
  localStorage.removeItem("usuario");

  // Redirección
  window.location.href = "login.html";
});
