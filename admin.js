// Verificar acceso 
const sesion = JSON.parse(sessionStorage.getItem("sesion"));

if (!sesion) {
    window.location.href = "login.html";
} else if (sesion.tipo !== "admin") {
    window.location.href = "index.html";
}

document.getElementById("adminNombre").textContent = "Administrador: " + sesion.usuario;

// USUARIOS
let usuarios = JSON.parse(localStorage.getItem("ct_usuarios_v1")) || [];

// Guardar usuarios
function guardarUsuarios() {
    localStorage.setItem("ct_usuarios_v1", JSON.stringify(usuarios));
}

// Mostrar usuarios
function mostrarUsuarios() {
    const cont = document.getElementById("ListaUsuarios");
    cont.innerHTML = "";

    usuarios.forEach((user, index) => {
        cont.innerHTML += `
            <div class="usuario-item">
                <p><b>${user.usuario}</b> (${user.tipo})</p>
                <button class="btn-editar" onclick="editarUsuario(${index})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarUsuario(${index})">Eliminar</button>
            </div>
        `;
    });
}

// Editar usuario
async function editarUsuario(index) {
    const u = usuarios[index];

    const nuevoNombre = prompt("Nuevo usuario:", u.usuario);
    const nuevaPass = prompt("Nueva contraseña (dejar en blanco si no desea cambiar):", "");
    const nuevoTipo = prompt("Tipo de usuario (admin/usuario):", u.tipo);

    if (!nuevoNombre || !nuevoTipo) return;

    let nuevoHash = u.passwordHash;
    if (nuevaPass) {
        nuevoHash = await hash(nuevaPass);
    }

    usuarios[index] = {
        ...u,
        usuario: nuevoNombre,
        passwordHash: nuevoHash,
        tipo: nuevoTipo
    };

    guardarUsuarios();
    mostrarUsuarios();
}

// Eliminar usuario
function eliminarUsuario(index) {
    if (confirm("¿Eliminar este usuario?")) {
        usuarios.splice(index, 1);
        guardarUsuarios();
        mostrarUsuarios();
    }
}

// PAQUETES
let paquetes = JSON.parse(localStorage.getItem("paquetes"));

if (!paquetes || paquetes.length === 0) {
    paquetes = [
        { id: 1, nombre: "Paquete Completo", descripcion: "Transporte ida y vuelta, caminata guiada y fotos.", precio: 85, imagen: "img/placeholder.jpg" },
        { id: 2, nombre: "Experiencia Premium", descripcion: "Transporte + guía + almuerzo + fotografía.", precio: 145, imagen: "img/placeholder.jpg" },
        { id: 3, nombre: "Senderismo Interno", descripcion: "Guía local + miradores + recorrido completo.", precio: 30, imagen: "img/placeholder.jpg" },
        { id: 4, nombre: "Tour Básico", descripcion: "$45 por persona.", precio: 45, imagen: "img/placeholder.jpg" },
        { id: 5, nombre: "Tour + Cascadas", descripcion: "$60 por persona.", precio: 60, imagen: "img/placeholder.jpg" },
        { id: 6, nombre: "Paquete Básico", descripcion: "Acceso a Playa Santa Clara + ranchos.", precio: 15, imagen: "img/placeholder.jpg" },
        { id: 7, nombre: "Full Playa", descripcion: "Transporte + playa + almuerzo + bebidas.", precio: 55, imagen: "img/placeholder.jpg" },
        { id: 8, nombre: "Cabaña Frente al Mar", descripcion: "Cabaña privada con baño interno.", precio: 120, imagen: "img/placeholder.jpg" }
    ];
    localStorage.setItem("paquetes", JSON.stringify(paquetes));
}


function guardarPaquetes() {
    localStorage.setItem("paquetes", JSON.stringify(paquetes));
    mostrarPaquetes();
}

function mostrarPaquetes() {
    const contenedor = document.getElementById("ListaPaquetes");
    contenedor.innerHTML = "";

    paquetes.forEach((paq, index) => {
        contenedor.innerHTML += `
            <div class="paquete-item">
                <h3>${paq.nombre}</h3>
                <p>${paq.descripcion} <b>$${paq.precio}</b></p>
                <button class="btn-editar" onclick="editarPaquete(${index})">Editar</button>
                <button class="btn-eliminar" onclick="eliminarPaquete(${index})">Eliminar</button>
            </div>
        `;
    });
}


document.getElementById("formPaquete").addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombrePaquete").value;
    const descripcion = document.getElementById("descripcionPaquete").value;
    const precio = parseFloat(document.getElementById("precioPaquete").value);
    const categoria = document.getElementById("categoriaPaquete").value;
    const archivoImagen = document.getElementById("imagenPaquete").files[0];

    const nuevoPaquete = {
        id: paquetes.length ? paquetes[paquetes.length - 1].id + 1 : 1,
        nombre,
        descripcion,
        precio,
        categoria,
        imagen: "img/placeholder.jpg" // por defecto
    };

    if (archivoImagen) {
        const lector = new FileReader();
        lector.onload = function (event) {
            nuevoPaquete.imagen = event.target.result;
            paquetes.push(nuevoPaquete);
            guardarPaquetes();
        };
        lector.readAsDataURL(archivoImagen);
    } else {
        paquetes.push(nuevoPaquete);
        guardarPaquetes();
    }

    e.target.reset();
});

// Editar paquete
function editarPaquete(index) {
    const p = paquetes[index];
    const nuevoNombre = prompt("Nuevo nombre:", p.nombre);
    const nuevaDesc = prompt("Nueva descripción:", p.descripcion);
    const nuevoPrecio = parseFloat(prompt("Nuevo precio:", p.precio));

    if (nuevoNombre && nuevaDesc && !isNaN(nuevoPrecio)) {
        paquetes[index] = { ...p, nombre: nuevoNombre, descripcion: nuevaDesc, precio: nuevoPrecio };
        guardarPaquetes();
    }
}

// Eliminar paquete
function eliminarPaquete(index) {
    if (confirm("¿Eliminar este paquete?")) {
        paquetes.splice(index, 1);
        guardarPaquetes();
    }
}

// SECCIONES Y CIERRE DE SESIÓN
function mostrarSeccion(nombre) {
    document.querySelectorAll(".seccion").forEach(s => s.classList.add("oculto"));
    const sec = document.getElementById(`seccion-${nombre}`);
    if (sec) sec.classList.remove("oculto");

    if (nombre === "usuarios") mostrarUsuarios();
    if (nombre === "paquetes") mostrarPaquetes();
}

function cerrarSesion() {
    sessionStorage.removeItem("sesion");
    window.location.href = "login.html";
}

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", () => {
    mostrarSeccion("paquetes"); // o "usuarios" según quieras mostrar primero
});
