import { auth } from "js/firebase-config.js";  // Asegúrate de la ruta correcta

// Función para cerrar sesión
export async function logout() {
    try {
        await auth.signOut();
        sessionStorage.removeItem("userRole");
        alert("Sesión cerrada");
        window.location.href = "../login.html";
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
}

// Escuchar cambios en la autenticación
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario autenticado:", user.email);
    } else {
        console.log("Usuario no autenticado.");
    }
});



// Verificar autenticación y rol
onAuthStateChanged(auth, async (user) => {
    console.log('🔹 Verificando usuario autenticado:', user);

    if (user) {
        let userRole = sessionStorage.getItem("userRole") || "";

        if (!userRole) {
            try {
                const userRef = doc(db, "usuarios", user.uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    userRole = userSnap.data().rol;
                    sessionStorage.setItem("userRole", userRole);
                } else {
                    console.warn("⚠️ No se encontró el documento del usuario en Firestore.");
                }
            } catch (error) {
                console.error("❌ Error al obtener el rol del usuario:", error);
                return;
            }
        }

        // Verificación de rutas según el rol
        const currentPath = window.location.pathname;

        if (userRole === "ciudadano" && !currentPath.includes("dashboard-ciudadano.html")) {
            window.location.href = "dashboard-ciudadano.html";
        } else if (userRole === "funcionario" && !currentPath.includes("dashboard-funcionario.html")) {
            window.location.href = "dashboard-funcionario.html";
        }

        // Mostrar contenido según el rol
        if (userRole === "ciudadano") {
            document.getElementById("ciudadano-content").style.display = "block";
        } else if (userRole === "funcionario") {
            document.getElementById("funcionario-content").style.display = "block";
        }
    } else {
        // Si el usuario no está autenticado, redirigir a login, excepto en index.html
        const currentPath = window.location.pathname;
        if (!currentPath.includes("index.html")) {
            window.location.href = "../registro/login.html";
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("chat-toggle").addEventListener("click", function() {
        let chatFrame = document.getElementById("chat-frame");
        chatFrame.style.display = (chatFrame.style.display === "block") ? "none" : "block";
    });
});



