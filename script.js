/*=============== JS Index.html ==================*/

/* UTILIDADES */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/*  BIENVENIDA */
const welcomeModal = $("#welcomeModal");
const closeModal = $("#closeModal");
const enterSite = $("#enterSite");

function showModal() {
  if (!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden", "false");
}
function hideModal() {
  if (!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden", "true");
}

/* Mostrar bienvenida solo la primera vez (localStorage) */
try {
  if (!localStorage.getItem("seenWelcome")) {
    showModal();
    localStorage.setItem("seenWelcome", "1");
  }
} catch (e) { /* si storage bloqueado, no falla la página */ }

/* Eventos bienvenida */
if (closeModal) closeModal.addEventListener("click", hideModal);
if (enterSite) enterSite.addEventListener("click", hideModal);

/* Cerrar con Escape o clic en overlay */
if (welcomeModal) {
  welcomeModal.addEventListener("click", (e) => {
    if (e.target === welcomeModal) hideModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && welcomeModal.getAttribute("aria-hidden") === "false") hideModal();
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

/*  SLIDER */
(function () {
  const slideEls = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const dotsWrap = document.getElementById("sliderDots");
  let idx = 0;
  let timer = null;
  const DELAY = 4500;

  if (slideEls.length === 0) return;

  // crear dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slideEls.forEach((_, i) => {
      const b = document.createElement("button");
      b.addEventListener("click", () => { goTo(i); restart(); });
      if (i === 0) b.classList.add("active");
      dotsWrap.appendChild(b);
    });
  }

  // preload check
  slideEls.forEach((slide, i) => {
    const img = slide.querySelector("img");
    if (!img) return;
    img.addEventListener("error", () => {
      console.error("Fallo al cargar imagen:", img.src);
      img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>Imagen no disponible</text></svg>";
    });
  });

  function goTo(i) {
    slideEls.forEach((s, j) => s.classList.toggle("active", j === i));
    if (dotsWrap) {
      Array.from(dotsWrap.children).forEach((d, j) => d.classList.toggle("active", j === i));
    }
    idx = i;
  }
  function next() { goTo((idx + 1) % slideEls.length); }
  function prev() { goTo((idx - 1 + slideEls.length) % slideEls.length); }
  function start() { stop(); timer = setInterval(next, DELAY); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { stop(); start(); }

  if (nextBtn) nextBtn.addEventListener("click", () => { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restart(); });

  // iniciar el slider 
  goTo(0);
  start();

  // export minimal debugging handles 
  window._sliderControl = { goTo, next, prev, start, stop, restart };
})();


/*CARRITO SIMPLE (localStorage) */
const cart = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  save() { localStorage.setItem("cartItems", JSON.stringify(this.items)); },
  add(item) {
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
      li.innerHTML = `<span>${it.name} x${it.qty}</span><strong>$${(it.price * it.qty).toFixed(2)}</strong>`;
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

/* Comprar botones */
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn.buy")) {
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    cart.add({ id, name, price });
    e.target.textContent = "Añadido ✓";
    setTimeout(() => e.target.textContent = "Comprar", 900);
  }
});

/* Finalizar compra*/
if (checkoutBtn) checkoutBtn.addEventListener("click", () => {
  if (cart.items.length === 0) { 
    alert("El carrito está vacío."); 
    return; 
  }

  // Mostrar total real del carrito
  alert(`Compra finalizada.\nTotal: $${cart.total().toFixed(2)}\n(Implementa pago en la siguiente fase).`);

  // Limpiar carrito
  cart.clear();

  // Ocultar dropdown
  if (cartDropdown) cartDropdown.style.display = "none";

  // Actualizar UI
  renderCart();
});

/* HAT (placeholder)  */
const openChat = $("#openChat");
if (openChat) openChat.addEventListener("click", () => alert("Chat: función básica. La implementamos en la siguiente iteración."));

/*  Cerrar dropdowns al click fuera  */
document.addEventListener("click", (e) => {
  const cartEl = $("#cartWidget");
  if (cartDropdown && cartEl && !cartEl.contains(e.target) && cartDropdown.style.display === "block") {
    cartDropdown.style.display = "none";
  }
});

/*  AÑO FOOTER  */
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ==== Paquetes Picachos de Olá y paquete de Omar torrijos ==== */
let paqueteSeleccionado = null;
const modalCompra = document.getElementById("modalCompra");
const closeModalCompra = document.getElementById("closeModalCompra");
const formCompra = document.getElementById("formCompra");

// Abrir modal al hacer clic en cualquier botón de agregar
document.querySelectorAll(".agregar-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const nombre = btn.dataset.nombre;
        const precio = parseFloat(btn.dataset.precio);

        // Encontrar el input de cantidad dentro del mismo paquete
        const paqueteCard = btn.closest(".paquete-card");
        const cantidadInput = paqueteCard.querySelector("input[type=number]");
        const cantidad = parseInt(cantidadInput.value);

        if (cantidad < 1) return alert("Ingresa al menos 1 persona.");

        // Generar ID único basado en tiempo + nombre
        const id = `paquete_${nombre.replace(/\s+/g, "_")}_${Date.now()}`;
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

        // Mostrar modal
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
        id: paqueteSeleccionado.id, // ID único
        name: `${paqueteSeleccionado.nombre} - ${detallesPersonas} - ${horario}`,
        price: paqueteSeleccionado.precio,
        qty: cantidad
    });
    cart.save();
    renderCart();

    modalCompra.setAttribute("aria-hidden", "true");

    alert(`Paquete agregado al carrito!\nCantidad: ${cantidad}\nTotal: $${(paqueteSeleccionado.precio * cantidad).toFixed(2)}`);
});