/* CARRITO SIMPLE  */

/* Evitar inyección */
function escapeHtml(t) {
  return t.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[c]));
}

/*  Carrito */
const cart = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),

  save() {
    localStorage.setItem("cartItems", JSON.stringify(this.items));
  },

  add(item) {
    const found = this.items.find(i => i.id === item.id);
    if (found) found.qty += item.qty;
    else this.items.push(item);

    this.save();
    renderCart();
  },

  total() {
    return this.items.reduce((s, i) => s + i.price * i.qty, 0);
  },

  clear() {
    this.items = [];
    this.save();
    renderCart();
  }
};

/*  Elementos DOM  */
const cartBtn = document.getElementById("cartBtn");
const cartDropdown = document.getElementById("cartDropdown");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkout");

/* Render */
function renderCart() {
  cartItemsEl.innerHTML = "";

  if (cart.items.length === 0) {
    cartItemsEl.innerHTML =
      "<li style='padding:.6rem;color:#6b7280'>Carrito vacío</li>";
  } else {
    cart.items.forEach(it => {
      const li = document.createElement("li");
      li.className = "item-carrito";

      li.innerHTML = `
        <span>${escapeHtml(it.name)} x${it.qty}</span>
        <strong>$${(it.price * it.qty).toFixed(2)}</strong>
      `;

      cartItemsEl.appendChild(li);
    });
  }

  cartTotalEl.textContent = cart.total().toFixed(2);
  cartCountEl.textContent = cart.items.reduce((s, i) => s + i.qty, 0);
}

renderCart();

/* Agregar al carrito  */
document.addEventListener("click", e => {
  const btn = e.target.closest(".agregar-carrito");
  if (!btn) return;

  // Card del paquete
  const card = btn.closest(".paquete-item");

  const name = card.querySelector("h3").textContent.trim();

  const priceMatch = card.querySelector("b").textContent.match(/\d+/);
  const price = parseFloat(priceMatch ? priceMatch[0] : 0);

  const qty = parseInt(card.querySelector("input[type='number']").value) || 1;

  const id = name.toLowerCase().replace(/\s+/g, "_");

  cart.add({ id, name, price, qty });

  btn.textContent = "Añadido ✓";
  setTimeout(() => (btn.textContent = "Agregar"), 800);
});

/* Finalizar la compra  */
checkoutBtn.addEventListener("click", () => {
  if (cart.items.length === 0) {
    mostrarModal("!Carrito vacío¡", "Agrega un paquete antes de continuar.");
    return;
  }

  mostrarModal(
    " ¡Compra realizada!",
    `Tu pago fue procesado con éxito.<br><br>Total pagado: <strong>$${cart.total().toFixed(2)}</strong>`
  );

  cart.clear();
  closeCart();
});

/*  Modal */
function mostrarModal(titulo, mensaje) {
  const modal = document.createElement("div");
  modal.className = "modal-compra";

  modal.innerHTML = `
    <div class="modal-contenido">
      <h2>${titulo}</h2>
      <p>${mensaje}</p>
      <button id="cerrarModal" class="btn primario">Aceptar</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("cerrarModal").onclick = () => modal.remove();
}

/*  Dropdown */
cartDropdown.style.opacity = "0";
cartDropdown.style.pointerEvents = "none";
cartDropdown.style.transform = "translateY(10px)";

function openCart() {
  cartDropdown.style.opacity = "1";
  cartDropdown.style.pointerEvents = "auto";
  cartDropdown.style.transform = "translateY(0)";
}

function closeCart() {
  cartDropdown.style.opacity = "0";
  cartDropdown.style.pointerEvents = "none";
  cartDropdown.style.transform = "translateY(10px)";
}

cartBtn.addEventListener("click", e => {
  e.stopPropagation();
  const isOpen = cartDropdown.style.opacity === "1";
  isOpen ? closeCart() : openCart();
});

cartDropdown.addEventListener("click", e => e.stopPropagation());
document.addEventListener("click", () => closeCart());
