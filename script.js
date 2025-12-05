/* UTILIDADES */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/*  BIENVENIDA */
const welcomeModal = $("#welcomeModal");
const closeModal = $("#closeModal");
const enterSite = $("#enterSite");

function showModal(){
  if(!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden","false");
}
function hideModal(){
  if(!welcomeModal) return;
  welcomeModal.setAttribute("aria-hidden","true");
}

/* Mostrar bienvenida solo la primera vez (localStorage) */
try {
  if(!localStorage.getItem("seenWelcome")){
    showModal();
    localStorage.setItem("seenWelcome","1");
  }
} catch(e){ /* si storage bloqueado, no falla la página */ }

/* Eventos bienvenida */
if(closeModal) closeModal.addEventListener("click", hideModal);
if(enterSite) enterSite.addEventListener("click", hideModal);

/* Cerrar con Escape o clic en overlay */
if(welcomeModal){
  welcomeModal.addEventListener("click", (e)=>{
    if(e.target === welcomeModal) hideModal();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape" && welcomeModal.getAttribute("aria-hidden")==="false") hideModal();
  });
}

/*  NAV RESPONSIVE */
const navToggle = $("#navToggle");
const mainMenu = $("#mainMenu");
if(navToggle && mainMenu){
  navToggle.addEventListener("click", ()=>{
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    mainMenu.classList.toggle("show");
  });

  mainMenu.addEventListener("click", (e)=>{
    if(e.target.tagName === "A" && mainMenu.classList.contains("show")){
      mainMenu.classList.remove("show");
      navToggle.setAttribute("aria-expanded","false");
    }
  });
}

/*  SLIDER */
(function(){
  const slideEls = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const dotsWrap = document.getElementById("sliderDots");
  let idx = 0;
  let timer = null;
  const DELAY = 4500;

  if(slideEls.length === 0) return;

  // crear dots
  if(dotsWrap){
    dotsWrap.innerHTML = "";
    slideEls.forEach((_,i)=>{
      const b = document.createElement("button");
      b.addEventListener("click", ()=> { goTo(i); restart(); });
      if(i===0) b.classList.add("active");
      dotsWrap.appendChild(b);
    });
  }

  // preload check
  slideEls.forEach((slide,i)=>{
    const img = slide.querySelector("img");
    if(!img) return;
    img.addEventListener("error", ()=> {
      console.error("Fallo al cargar imagen:", img.src);
      img.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>Imagen no disponible</text></svg>";
    });
  });

  function goTo(i){
    slideEls.forEach((s,j)=> s.classList.toggle("active", j===i));
    if(dotsWrap){
      Array.from(dotsWrap.children).forEach((d,j)=> d.classList.toggle("active", j===i));
    }
    idx = i;
  }
  function next(){ goTo((idx+1) % slideEls.length); }
  function prev(){ goTo((idx-1 + slideEls.length) % slideEls.length); }
  function start(){ stop(); timer = setInterval(next, DELAY); }
  function stop(){ if(timer) { clearInterval(timer); timer = null; } }
  function restart(){ stop(); start(); }

  if(nextBtn) nextBtn.addEventListener("click", ()=> { next(); restart(); });
  if(prevBtn) prevBtn.addEventListener("click", ()=> { prev(); restart(); });

  slideEls.forEach(s=>{
    s.addEventListener("mouseenter", stop);
    s.addEventListener("mouseleave", start);
  });

  // iniciar el slider 
  goTo(0);
  start();

  // export minimal debugging handles 
  window._sliderControl = { goTo, next, prev, start, stop, restart };
})();


/*CARRITO SIMPLE (localStorage) */
const cart = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  save(){ localStorage.setItem("cartItems", JSON.stringify(this.items)); },
  add(item){
    const found = this.items.find(i=> i.id === item.id);
    if(found) found.qty += 1; else this.items.push({...item, qty:1});
    this.save(); renderCart();
  },
  total(){ return this.items.reduce((s,i)=> s + i.price * i.qty, 0); },
  clear(){ this.items = []; this.save(); renderCart(); }
};

const cartBtn = $("#cartBtn");
const cartDropdown = $("#cartDropdown");
const cartItemsEl = $("#cartItems");
const cartTotalEl = $("#cartTotal");
const cartCountEl = $("#cartCount");
const checkoutBtn = $("#checkout");

function renderCart(){
  if(!cartItemsEl) return;
  cartItemsEl.innerHTML = "";
  if(cart.items.length === 0){
    cartItemsEl.innerHTML = "<li style='padding:.6rem;color:#6b7280'>Carrito vacío</li>";
  } else {
    cart.items.forEach(it=>{
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.padding = ".4rem 0";
      li.innerHTML = `<span>${it.name} x${it.qty}</span><strong>$${(it.price*it.qty).toFixed(2)}</strong>`;
      cartItemsEl.appendChild(li);
    });
  }
  if(cartTotalEl) cartTotalEl.textContent = cart.total().toFixed(2);
  if(cartCountEl) cartCountEl.textContent = cart.items.reduce((s,i)=> s + i.qty,0);
}
renderCart();

if(cartBtn){
  cartBtn.addEventListener("click", ()=>{
    const isOpen = cartDropdown && cartDropdown.style.display === "block";
    if(cartDropdown) cartDropdown.style.display = isOpen ? "none" : "block";
    cartBtn.setAttribute("aria-expanded", String(!isOpen));
  });
}

/* Comprar botones */
document.addEventListener("click", (e)=>{
  if(e.target.matches(".btn.buy")){
    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    cart.add({id,name,price});
    e.target.textContent = "Añadido ✓";
    setTimeout(()=> e.target.textContent = "Comprar", 900);
  }
});

/* Finalizar compra*/
if(checkoutBtn) checkoutBtn.addEventListener("click", ()=>{
  if(cart.items.length === 0){ alert("El carrito está vacío."); return; }
  alert(`Compra finalizada. Total: $${cart.total().toFixed(2)}\n(Implementa pago en la siguiente fase).`);
  cart.clear();
  if(cartDropdown) cartDropdown.style.display = "none";
});

/* HAT (placeholder)  */
const openChat = $("#openChat");
if(openChat) openChat.addEventListener("click", ()=> alert("Chat: función básica. La implementamos en la siguiente iteración."));

/*  Cerrar dropdowns al click fuera  */
document.addEventListener("click", (e)=>{
  const cartEl = $("#cartWidget");
  if(cartDropdown && cartEl && !cartEl.contains(e.target) && cartDropdown.style.display === "block"){
    cartDropdown.style.display = "none";
  }
});

/*  AÑO FOOTER  */
const yearEl = $("#year");
if(yearEl) yearEl.textContent = new Date().getFullYear();
