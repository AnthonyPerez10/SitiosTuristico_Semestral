// --- HASH SHA-256 ---
async function hash(texto) {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto));
  return [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2,"0")).join("");
}

// --- Obtener usuarios ---
function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem("ct_usuarios_v1") || "[]");
}

// --- Guardar usuarios ---
function guardarUsuarios(lista) {
  localStorage.setItem("ct_usuarios_v1", JSON.stringify(lista));
}

// --- Crear ADMIN si no existe ---
async function inicializarDemo() {
  let usuarios = obtenerUsuarios();

  // Si no hay ningún usuario → crear admin
  if (usuarios.length === 0) {
    const passHash = await hash("Admin@123");
    usuarios = [{
      usuario: "admin",
      passwordHash: passHash,
      tipo: "admin"
    }];
    guardarUsuarios(usuarios);
    return;
  }

  // Normalizar usuarios viejos si existieran
  usuarios = usuarios.map(u => ({
    usuario: u.usuario,
    passwordHash: u.passwordHash,
    tipo: u.tipo || "usuario"
  }));

  guardarUsuarios(usuarios);
}

inicializarDemo();


// =============================================
// LOGIN
// =============================================
document.getElementById("btnLogin").addEventListener("click", async () => {
  const usuario = document.getElementById("usuario").value.trim();
  const contrasena = document.getElementById("contrasena").value;

  const usuarios = obtenerUsuarios();
  const hashIngresado = await hash(contrasena);

  const encontrado = usuarios.find(u =>
    u.usuario === usuario && u.passwordHash === hashIngresado
  );

  if (encontrado) {
    sessionStorage.setItem("sesion", JSON.stringify(encontrado));

    if (encontrado.tipo === "admin") window.location.href = "admin.html";
    else window.location.href = "index.html";

  } else {
    toast("Credenciales incorrectas");
  }
});


// =============================================
// REGISTRO
// =============================================
document.getElementById("btnRegistro").addEventListener("click", async () => {
  const usuario = document.getElementById("regUsuario").value.trim();
  const contrasena = document.getElementById("regContra").value;

  if (usuario === "" || contrasena.length < 4) {
    document.getElementById("msgReg").textContent = "Datos inválidos";
    document.getElementById("msgReg").style.display = "block";
    return;
  }

  const usuarios = obtenerUsuarios();

  if (usuarios.find(u => u.usuario === usuario)) {
    toast("Ese usuario ya existe");
return;

  }

  const passHash = await hash(contrasena);

  usuarios.push({
    usuario,
    passwordHash: passHash,
    tipo: "usuario" // siempre usuario normal
  });

  guardarUsuarios(usuarios);

  toast("Cuenta creada correctamente");
mostrarLogin();

});


// =============================================
// TRANSICIÓN ENTRE LOGIN Y REGISTRO
// =============================================
function mostrarRegistro() {
  document.getElementById("loginBox").classList.add("oculto");
  setTimeout(() => {
    document.getElementById("registroBox").classList.remove("oculto");
  }, 200);
}

function mostrarLogin() {
  document.getElementById("registroBox").classList.add("oculto");
  setTimeout(() => {
    document.getElementById("loginBox").classList.remove("oculto");
  }, 200);
}

function toast(mensaje) {
  const t = document.getElementById("toast");
  t.textContent = mensaje;
  t.classList.add("mostrar");

  setTimeout(() => {
    t.classList.remove("mostrar");
  }, 2000);
}
