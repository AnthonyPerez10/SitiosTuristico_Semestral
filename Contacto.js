// POPUP

function showPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.className = `custom-popup ${type}`;
  popup.textContent = message;

  document.body.appendChild(popup);

  // Animación de entrada
  setTimeout(() => popup.classList.add("show"), 20);

  // Desaparecer después de 3s
  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
}

// VALIDACIÓN DE FORMULARIO

const form = document.getElementById("contactForm");
const charCount = document.getElementById("charCount");
const message = document.getElementById("message");

// Contador de caracteres 
message.addEventListener("input", () => {
  const length = message.value.length;
  charCount.textContent = `${length} / 1200`;

  if (length > 1200) {
    message.classList.add("invalid");
  } else {
    message.classList.remove("invalid");
  }
});

// Validación al enviar
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let valid = true;

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const email = form.email.value.trim();
  const msg = message.value.trim();

  // Validar nombre
  if (firstName === "") {
    marcarInvalido(form.firstName);
    valid = false;
  } else limpiar(form.firstName);

  // Validar apellido
  if (lastName === "") {
    marcarInvalido(form.lastName);
    valid = false;
  } else limpiar(form.lastName);

  // Validar email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    marcarInvalido(form.email);
    valid = false;
  } else limpiar(form.email);

  // Validar mensaje
  if (msg.length < 10 || msg.length > 1200) {
    marcarInvalido(message);
    valid = false;
  } else limpiar(message);

  // Resultado
  if (!valid) {
    showPopup("Completa correctamente los campos obligatorios.", "error");
    return;
  }

  // ÉXITO
  showPopup("¡Mensaje enviado correctamente!", "success");

  // Resetear
  form.reset();
  charCount.textContent = "0 / 1200";
});


// Utilidades
function marcarInvalido(campo) {
  campo.classList.add("invalid");
}

function limpiar(campo) {
  campo.classList.remove("invalid");
}
