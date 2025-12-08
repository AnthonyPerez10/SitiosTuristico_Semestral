// // Verificar acceso
// const sesion = JSON.parse(sessionStorage.getItem("sesion"));

// if (!sesion) {
//   // Nadie sin login entra
//   window.location.href = "login.html";
// } else if (sesion.tipo !== "admin") {
//   // Usuarios normales vuelven al home
//   window.location.href = "index.html";
// }

// // Mostrar nombre
// document.getElementById("adminNombre").textContent =
//   "Administrador: " + sesion.usuario;

// // Cambiar secciones
// function mostrarSeccion(nombre) {
//   document.querySelectorAll(".seccion").forEach(sec => sec.classList.add("oculto"));
//   document.getElementById(`seccion-${nombre}`).classList.remove("oculto");
//   document.getElementById(`seccion-${nombre}`).classList.add("activo");
// }

// // Cerrar sesión
// function cerrarSesion() {
//   sessionStorage.removeItem("sesion");
//   window.location.href = "login.html";
// }
