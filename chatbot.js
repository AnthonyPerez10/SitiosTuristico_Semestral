// CHATBOT 

// abrir ventana
document.getElementById("chatbot-bubble").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.remove("oculto");
});

// cerrar ventana
document.getElementById("chatbot-close").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.add("oculto");
});

// enviar mensaje con botón
document.getElementById("chatbot-send").addEventListener("click", enviarMensaje);

// enviar con Enter
document.getElementById("chatbot-input").addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

function enviarMensaje() {
  const input = document.getElementById("chatbot-input");
  const texto = input.value.trim();
  if (texto === "") return;

  agregarMensaje("usuario", texto);
  input.value = "";

  setTimeout(() => responderBot(texto), 400);
}

// agregar mensaje al chat
function agregarMensaje(tipo, texto) {
  const box = document.getElementById("chatbot-messages");
  const burbuja = document.createElement("div");

  burbuja.style.margin = "6px 0";
  burbuja.style.padding = "8px 10px";
  burbuja.style.borderRadius = "10px";
  burbuja.style.maxWidth = "85%";
  burbuja.style.display = "inline-block";

  if (tipo === "usuario") {
    burbuja.style.background = "#d4fff3";
    burbuja.style.alignSelf = "flex-end";
  } else {
    burbuja.style.background = "#f1f1f1";
    burbuja.style.alignSelf = "flex-start";
  }

  burbuja.textContent = texto;
  box.appendChild(burbuja);

  // scroll hacia abajo
  box.scrollTop = box.scrollHeight;
}

// respuestas básicas del bot
function responderBot(texto) {
  const t = texto.toLowerCase();

  if (t.includes("hola")) 
    return agregarMensaje("bot", "Chupalo maricon");

  if (t.includes("admin")) 
    return agregarMensaje("bot", "Chupalo maricon");

  if (t.includes("usuario")) 
    return agregarMensaje("bot", "Chupalo maricon");

  if (t.includes("sitio") || t.includes("turismo")) 
    return agregarMensaje("bot", "Chupalo maricon");

  agregarMensaje("bot", "Lo siento, soy un bot básico todavía ");
}