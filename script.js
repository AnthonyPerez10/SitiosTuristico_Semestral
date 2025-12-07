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


/* CARRITO SIMPLE (localStorage)
*/
const cart = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  save() { localStorage.setItem("cartItems", JSON.stringify(this.items)); },
  add(item) {
    // item: { id, name, price }
    const found = this.items.find(i => i.id === item.id);
    if (found) found.qty += 1; else this.items.push({ ...item, qty: 1 });
    this.save(); renderCart();
  },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  clear() { this.items = []; this.save(); renderCart(); }
};

const cartBtn = $("#cartBtn");
const cartDropdown = $("#cartDropdown");
const cartItemsEl = $("#cartItems");
const cartTotalEl = $("#cartTotal");
const cartCountEl = $("#cartCount");
const checkoutBtn = $("#checkout");

function renderCart() {
  if (!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  if (cart.items.length === 0) {
    cartItemsEl.innerHTML = "<li style='padding:.6rem;color:#6b7280'>Carrito vacío</li>";
  } else {
    cart.items.forEach(it => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.padding = ".4rem 0";
      li.innerHTML = `<span>${escapeHtml(it.name)} x${it.qty}</span><strong>$${(it.price * it.qty).toFixed(2)}</strong>`;
      cartItemsEl.appendChild(li);
    });
  }
  if (cartTotalEl) cartTotalEl.textContent = cart.total().toFixed(2);
  if (cartCountEl) cartCountEl.textContent = cart.items.reduce((s, i) => s + i.qty, 0);
}
renderCart();

if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    const isOpen = cartDropdown && cartDropdown.style.display === "block";
    if (cartDropdown) cartDropdown.style.display = isOpen ? "none" : "block";
    cartBtn.setAttribute("aria-expanded", String(!isOpen));
  });
}

/* Comprar / Agregar al carrito*/
document.addEventListener("click", (e) => {
  const target = e.target;
  if (target.matches(".comprar") || target.matches(".agregar-carrito") || target.closest(".comprar") || target.closest(".agregar-carrito")) {
    const btn = target.matches(".comprar") || target.matches(".agregar-carrito") ? target : target.closest(".comprar") || target.closest(".agregar-carrito");
    const id = btn.dataset.id || ("p_" + Math.random().toString(36).slice(2,9));
    const name = btn.dataset.name || btn.dataset.nombre || (btn.textContent || "Producto").trim();
    const price = parseFloat(btn.dataset.price || btn.dataset.precio || "0") || 0;
    cart.add({ id, name, price });
    // feedback UI
    const orig = btn.textContent;
    btn.textContent = "Añadido ✓";
    setTimeout(() => btn.textContent = orig, 900);
  }
});

/* Finalizar compra */
if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
  if (cart.items.length === 0) {
    alert("El carrito está vacío.");
    return;
  }

  //Mostrar total real del carrito
  alert(`Compra finalizada.\nTotal: $${cart.total().toFixed(2)}\n(Implementa pago en la siguiente fase).`);
 
  //Limpiar carrito 
  cart.clear();

  //Ocultar dropdown
  if (cartDropdown) cartDropdown.style.display = "none";

  //Actualizar
  renderCart();
});

/* CHAT (placeholder) */
const openChat = $("#openChat");
if (openChat) openChat.addEventListener("click", () => alert("Chat: función básica. La implementamos en la siguiente iteración."));

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

/* ===== helpers ===== */
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"'`=\/]/g, function (s) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    })[s];
  });
}


/* ==== Paquetes Picachos de Olá ==== */
// Variable global única
let paqueteSeleccionado = null;
const modalCompra = document.getElementById("modalCompra");
const closeModalCompra = document.getElementById("closeModalCompra");
const formCompra = document.getElementById("formCompra");

// Abrir modal al hacer clic en cualquier botón de agregar
document.querySelectorAll(".agregar-btn").forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);
        const id = `picachos${index+1}`;
        const cantidadInput = document.getElementById(`cantidad${index+1}`);
        const cantidad = parseInt(cantidadInput.value);

        if (cantidad < 1) return alert("Ingresa al menos 1 persona.");

        paqueteSeleccionado = { id, nombre, precio, cantidad };

        // Limpiar formulario
        formCompra.innerHTML = "";

        // Campos dinámicos para cada persona
        for (let i = 1; i <= cantidad; i++) {
            formCompra.innerHTML += `
                <h3>Persona ${i}</h3>
                <label>Nombre completo:
                    <input type="text" class="nombreCliente" required>
                </label>
                <label>Edad:
                    <input type="number" class="edadCliente" required>
                </label>
            `;
        }

        // Campo horario
        formCompra.innerHTML += `
            <label>Horario de llegada:
                <input type="time" id="horarioCliente" required>
            </label>
            <button type="submit">Confirmar Compra</button>
        `;

        modalCompra.setAttribute("aria-hidden", "false");
    });
});

// Cerrar modal
closeModalCompra.addEventListener("click", () => modalCompra.setAttribute("aria-hidden", "true"));

// Confirmar compra desde modal
formCompra.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombres = Array.from(document.querySelectorAll(".nombreCliente")).map(i => i.value.trim());
    const edades = Array.from(document.querySelectorAll(".edadCliente")).map(i => i.value.trim());
    const cantidad = nombres.length;
    const horario = document.getElementById("horarioCliente").value;

    if (nombres.includes("") || edades.includes("") || !horario) {
        alert("Completa todos los campos de todas las personas.");
        return;
    }

    // Detalle personas
    const detallesPersonas = nombres.map((n, i) => `${n} (${edades[i]} años)`).join(", ");

    // Agregar al carrito global
    cart.items.push({
        id: paqueteSeleccionado.id + "-" + new Date().getTime(), // id único para no sobrescribir
        name: `${paqueteSeleccionado.nombre} - ${detallesPersonas} - ${horario}`,
        price: paqueteSeleccionado.precio,
        qty: cantidad
    });
    cart.save();
    renderCart();

    modalCompra.setAttribute("aria-hidden", "true");

    alert(`Paquete agregado al carrito!\nCantidad: ${cantidad}\nTotal: $${(paqueteSeleccionado.precio * cantidad).toFixed(2)}`);
});
