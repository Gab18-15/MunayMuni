// Función para alternar el menú hamburguesa
function toggleMenu() {
    const nav = document.querySelector("nav");
    const hamburger = document.querySelector(".hamburger-menu");

    if (nav && hamburger) {
        nav.classList.toggle("active");
        hamburger.classList.toggle("active");
    } else {
        console.warn("No se encontró el menú de navegación o el ícono de hamburguesa.");
    }
}

// Verificar rol del usuario y mostrar la sección correspondiente
document.addEventListener("DOMContentLoaded", function () {
    const userRole = sessionStorage.getItem("userRole");

    if (userRole) {
        if (userRole === "ciudadano") {
            document.getElementById("ciudadanoSection")?.classList.remove("d-none");
        } else if (userRole === "funcionario") {
            document.getElementById("funcionarioSection")?.classList.remove("d-none");
        }
    } else {
        console.warn("No se encontró un rol de usuario en sessionStorage.");
    }
});
