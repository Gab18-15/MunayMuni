document.addEventListener("DOMContentLoaded", function () {
    // Validación de formularios
    function validarFormulario(formulario, campos) {
        for (const campo of campos) {
            if (document.getElementById(campo).value.trim() === "") {
                alert("Por favor, complete todos los campos.");
                return false;
            }
        }
        return true;
    }

    // Manejo de formularios
    const formularios = {
        login: { selector: ".login-container form", campos: ["email", "password"] },
        registro: { selector: ".registro-container form", campos: ["nombre", "email", "password", "tipo_usuario"] },
        diagnostico: { selector: ".diagnostico-container form", campos: ["municipio", "evaluacion"] },
        contacto: { selector: ".contacto-container form", campos: ["nombre", "email", "mensaje"] }
    };

    for (const key in formularios) {
        const form = document.querySelector(formularios[key].selector);
        if (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                if (validarFormulario(form, formularios[key].campos)) {
                    alert("Formulario enviado exitosamente.");
                }
            });
        }
    }
});

/* Firebase Authentication */
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// ⚠️ Mueve la configuración a variables de entorno en backend si es posible
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

// Verificar estado de autenticación y redirigir según tipo de usuario
onAuthStateChanged(auth, async (user) => {
    console.log("Verificando autenticación...");

    if (user) {
        console.log("Usuario detectado:", user.uid);
        let userRole = sessionStorage.getItem("userRole");

        if (!userRole) {
            try {
                const userDocRef = doc(db, "usuarios", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    userRole = userDoc.data().tipoUsuario;
                    sessionStorage.setItem("userRole", userRole);
                } else {
                    console.error("Usuario autenticado sin datos en Firestore.");
                    return;
                }
            } catch (error) {
                console.error("Error al obtener datos del usuario en Firestore:", error);
                return;
            }
        }

        // Redirección según rol
        const currentPath = window.location.pathname;
        if (userRole === "ciudadano" && !currentPath.includes("dashboard-ciudadano.html")) {
            window.location.href = "dashboard-ciudadano.html";
        } else if (userRole === "funcionario" && !currentPath.includes("dashboard-funcionario.html")) {
            window.location.href = "dashboard-funcionario.html";
        }
    } else {
        console.log("No hay usuario autenticado.");
        if (!window.location.pathname.endsWith("login.html") && !window.location.pathname.endsWith("registro.html")) {
            window.location.href = "login.html";
        }
    }
});

// Cerrar sesión
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                sessionStorage.removeItem("userRole");
                alert("Sesión cerrada");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});

// Registro de usuario en Firebase
const registerForm = document.querySelector(".registro-container form");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const tipoUsuario = document.getElementById("tipo_usuario").value.trim();

        if (!email || !password || !tipoUsuario) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuario registrado:", user.uid);

            // Guardar información en Firestore
            await setDoc(doc(db, "usuarios", user.uid), { email, tipoUsuario });

            alert(`Registro exitoso como ${tipoUsuario}`);
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error en el registro:", error.message);
            alert("Error: " + error.message);
        }
    });
}
