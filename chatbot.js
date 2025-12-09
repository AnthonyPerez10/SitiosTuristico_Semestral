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
function agregarMensaje(tipo, contenido, html = false) {
  const box = document.getElementById("chatbot-messages");
  const burbuja = document.createElement("div");

  burbuja.style.margin = "6px 0";
  burbuja.style.padding = "8px 10px";
  burbuja.style.borderRadius = "10px";
  burbuja.style.maxWidth = "85%";
  burbuja.style.display = "inline-block";
  burbuja.style.cursor = "default";

  if (tipo === "usuario") {
    burbuja.style.background = "#d4fff3";
    burbuja.style.alignSelf = "flex-end";
  } else {
    burbuja.style.background = "#f1f1f1";
    burbuja.style.alignSelf = "flex-start";
  }

  if (html) burbuja.innerHTML = contenido;
  else burbuja.textContent = contenido;

  box.appendChild(burbuja);

  box.scrollTop = box.scrollHeight;
}


// Flujo de chat bor y sus preguntas 
// ESTADO DEL CHAT
let estadoChat = {
  paqueteSeleccionado: null,
  horarioPreferido: null,
  puntoSalida: null,
  modo: null
};

// ABRIR Y CERRAR VENTANA
document.getElementById("chatbot-bubble").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.remove("oculto");
});
document.getElementById("chatbot-close").addEventListener("click", () => {
  document.getElementById("chatbot-window").classList.add("oculto");
});

// ENVIAR MENSAJE
document.getElementById("chatbot-send").addEventListener("click", enviarMensaje);
document.getElementById("chatbot-input").addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensaje();
});

function enviarMensaje() {
  const input = document.getElementById("chatbot-input");
  const texto = input.value.trim();
  if (!texto) return;
  agregarMensaje("usuario", texto);
  input.value = "";
  setTimeout(() => responderBot(texto), 300);
}

// AGREGAR MENSAJE
function agregarMensaje(tipo, contenido, html = false) {
  const box = document.getElementById("chatbot-messages");
  const burbuja = document.createElement("div");
  burbuja.style.margin = "6px 0";
  burbuja.style.padding = "8px 10px";
  burbuja.style.borderRadius = "10px";
  burbuja.style.maxWidth = "85%";
  burbuja.style.display = "inline-block";
  burbuja.style.cursor = "default";
  if (tipo === "usuario") {
    burbuja.style.background = "#d4fff3";
    burbuja.style.alignSelf = "flex-end";
  } else {
    burbuja.style.background = "#f1f1f1";
    burbuja.style.alignSelf = "flex-start";
  }
  if (html) burbuja.innerHTML = contenido;
  else burbuja.textContent = contenido;
  box.appendChild(burbuja);
  box.scrollTop = box.scrollHeight;
}

// ESTILO BOTONES
const style = document.createElement("style");
style.innerHTML = `
.chat-btn { margin:3px; padding:6px 10px; border:none; border-radius:8px; background:#4e8cff; color:white; cursor:pointer; }
.chat-btn:hover { background:#3a6fd1; }
`;
document.head.appendChild(style);

// MOSTRAR MENÚ DE PAQUETES
function mostrarMenuPaquetes(filtrarPaquetes = null) {
  const todos = [
    "Paquete Completo – $85 (Parque Omar)",
    "Experiencia Premium – $145 (Parque Omar)",
    "Senderismo Interno – $30 (Parque Omar)",
    "Tour Básico – $45 (Picachos)",
    "Tour + Cascadas – $60 (Picachos)",
    "Paquete Básico – $15 (Santa Clara)",
    "Full Playa – $55 (Santa Clara)",
    "Cabaña Frente al Mar – $120 (Santa Clara)",
    "Tour Boulevard Básico – $50 (Boulevard de Coclé)",
    "Tour Boulevard Premium – $90 (Boulevard de Coclé)"
  ];

  const opciones = (filtrarPaquetes ? todos.filter(p => filtrarPaquetes.some(f => p.toLowerCase().includes(f.toLowerCase()))) : todos)
    .map((p, i) => `${i + 1}️⃣ ${p}`).join("<br>") + "<br><br>";

  let botones = "";
  for (let i = 0; i < (filtrarPaquetes ? filtrarPaquetes.length : todos.length); i++) {
    botones += `<button class="chat-btn" onclick="seleccionarPaquete(${i + 1})">${i + 1}</button>`;
  }

  agregarMensaje("bot", `<b>Elige un paquete:</b><br><br>${opciones}<div>${botones}</div>`, true);
}

// SELECCIONAR PAQUETE
function seleccionarPaquete(num) {
  const nombres = [
    "Paquete Completo – $85",
    "Experiencia Premium – $145",
    "Senderismo Interno – $30",
    "Tour Básico – $45",
    "Tour + Cascadas – $60",
    "Paquete Básico – $15",
    "Full Playa – $55",
    "Cabaña Frente al Mar – $120"
  ];

  estadoChat.paqueteSeleccionado = nombres[num - 1];
  mostrarOpcionesSalida();
}


// MOSTRAR HORARIOS
function mostrarOpcionesHorario() {
  const horarios = ["6:30 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM"];
  let opcionesHTML = "Selecciona un horario:<br><br>";
  horarios.forEach(h => {
    opcionesHTML += `<button class="chat-btn" onclick="seleccionarHorario('${h}')">${h}</button>`;
  });
  agregarMensaje("bot", opcionesHTML, true);
}

// SELECCIONAR HORARIO
function seleccionarHorario(horario) {
  estadoChat.horarioPreferido = horario;
  estadoChat.modo = "confirmar";
  agregarMensaje("usuario", horario);
  agregarMensaje("bot", `Has elegido:<br><b>${estadoChat.paqueteSeleccionado}</b><br>
Horario: <b>${estadoChat.horarioPreferido}</b><br><br>
¿Quieres que te prepare un <b>plan del día</b>? (sí / no)<br>
Si quieres cambiar algo, escribe "modificar paquete" o "modificar horario".`, true);
}

// MOSTRAR OCPIONES DE SALIDA
function mostrarOpcionesSalida() {
  const salidas = [
    { lugar: "Albrook Mall, puerta principal", hora: "6:30 AM" },
    { lugar: "Boulevard de Penonomé, frente a Nikos Café", hora: "10:00 AM" }
  ];

  let html = "📅 Las salidas son todos los días desde:<br><br>";
  salidas.forEach((s, i) => {
    html += `<button class="chat-btn" onclick="seleccionarSalida('${s.lugar}', '${s.hora}')">${s.lugar} - ${s.hora}</button><br>`;
  });

  agregarMensaje("bot", html, true);
}

function seleccionarSalida(lugar, hora) {
  estadoChat.puntoSalida = lugar;
  estadoChat.horarioPreferido = hora;
  agregarMensaje("usuario", `${lugar} - ${hora}`);
  estadoChat.modo = "confirmar";

  agregarMensaje("bot", `Has elegido:<br>
Paquete: <b>${estadoChat.paqueteSeleccionado}</b><br>
Punto de salida: <b>${lugar}</b><br>
Horario: <b>${hora}</b><br><br>
¿Quieres que te prepare un plan del día? (sí / no)`, true);
}


// RESPONDER AL USUARIO
function responderBot(texto) {
  const t = texto.toLowerCase().trim();

  if (t.includes("modificar paquete")) return mostrarMenuPaquetes();
  if (t.includes("modificar horario") && estadoChat.paqueteSeleccionado) return mostrarOpcionesHorario();

  if (estadoChat.modo === "confirmar") {
    if (t.includes("sí") || t.includes("si")) return generarPlan();
    if (t.includes("no")) { estadoChat.modo = null; return agregarMensaje("bot", "Perfecto, puedes elegir otro paquete si quieres 😊"); }
  }

  if (t.includes("hola") || t.includes("buenas")) return agregarMensaje("bot", "¡Hola! ¿En qué paquete o destino necesitas ayuda?");
  if (t.includes("precio") || t.includes("paquete")) return mostrarMenuPaquetes();
  if (t.includes("horario") || t.includes("salida") || t.includes("partida")) {
    agregarMensaje("bot", `📅 Las salidas son todos los días desde:  
- Albrook Mall, puerta principal: 6:30 AM  
- Boulevard de Penonomé, frente a Nikos Café: 10:00 AM`);
    return;
  }


  if (t.includes("santa clara")) return mostrarMenuPaquetes(["Paquete Básico", "Full Playa", "Cabaña Frente al Mar"]);
  if (t.includes("parque") || t.includes("omar")) return mostrarMenuPaquetes(["Paquete Completo", "Experiencia Premium", "Senderismo Interno"]);
  if (t.includes("picachos")) return mostrarMenuPaquetes(["Tour Básico", "Tour + Cascadas"]);
  if (t.includes("boulevard") || t.includes("cocle")) return mostrarMenuPaquetes(["Tour Boulevard Básico", "Tour Boulevard Premium"]);

  const paquetes = [
    "paquete completo", "experiencia premium", "senderismo interno",
    "tour básico", "tour + cascadas", "paquete básico",
    "full playa", "cabaña frente al mar", "tour boulevard básico", "tour boulevard premium"
  ];
  for (let i = 0; i < paquetes.length; i++) if (t.includes(paquetes[i])) return seleccionarPaquete(i + 1);

  if (!isNaN(parseInt(t))) { const numero = parseInt(t); if (numero >= 1 && numero <= 10) return seleccionarPaquete(numero); }
  if (t.includes("gracias")) return agregarMensaje("bot", "¡De nada! 😊 Si quieres, puedes elegir un paquete o un horario.");

  agregarMensaje("bot", "No estoy seguro de eso… ¿Quieres información sobre precios, horarios o paquetes?");
}

// GENERAR PLAN Y LIMPIAR ESTADO
function generarPlan() {
  const plan = `
📝 Plan de Viaje Personalizado

📦 Paquete: ${estadoChat.paqueteSeleccionado}
⏰ Horario elegido: ${estadoChat.horarioPreferido}
📍 Punto de salida: ${estadoChat.puntoSalida}

⏳ 1. Check-in: 15 min antes del horario elegido
🚐 2. Salida: Según tu horario
📸 3. Actividades: Caminata + fotos + guía
🍽️ 4. Tiempo libre al finalizar
🏁 5. Regreso al punto de encuentro

Si quieres, escribe "modificar paquete" o "modificar horario" para cambiar tu plan.
`;

  agregarMensaje("bot", plan);

  // Limpiar estado para nueva conversación
  setTimeout(() => {
    estadoChat = { paqueteSeleccionado: null, horarioPreferido: null, puntoSalida: null, modo: null };
  }, 100);
}

