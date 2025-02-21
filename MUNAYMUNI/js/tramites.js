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




    // Código para procesar los documentos
    //  catch (error) {
    console.error("Error al cargar los trámites:", error);
    alert("Hubo un error al cargar los trámites. Intenta de nuevo.");
