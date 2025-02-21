import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Configuración de Firebase (⚠️ Mejor usar variables de entorno en backend)
const firebaseConfig = {
    apiKey: "AIzaSyAQnPwCSfxQftT2WI8c5cf8oIBbhAmWK6Q",
    authDomain: "habitad-para-la-humanidad.firebaseapp.com",
    projectId: "habitad-para-la-humanidad",
    storageBucket: "habitad-para-la-humanidad.firebasestorage.app",
    messagingSenderId: "337876665141",
    appId: "1:337876665141:web:239d6ae37273d3cb87827c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Verificar autenticación y rol
onAuthStateChanged(auth, async (user) => {
    if (user) {
        let userRole = sessionStorage.getItem("userRole");

        if (!userRole) {
            try {
                const userDocRef = doc(db, "usuarios", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    userRole = userDoc.data().tipoUsuario;
                    sessionStorage.setItem("userRole", userRole);
                } else {
                    console.warn("El usuario no tiene datos en Firestore.");
                    return;
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario:", error);
                return;
            }
        }

        // Verificación robusta de rutas
        const currentPath = window.location.pathname;
        if (userRole === "ciudadano" && !currentPath.includes("dashboard-ciudadano.html")) {
            window.location.href = "dashboard-ciudadano.html";
        } else if (userRole === "funcionario" && !currentPath.includes("dashboard-funcionario.html")) {
            window.location.href = "dashboard-funcionario.html";
        }
    } else {
        // Redirigir solo si NO está en index.html
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.href = "index.html";
        }
    }
});

// Función para cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                sessionStorage.removeItem("userRole");
                window.location.href = "index.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});
