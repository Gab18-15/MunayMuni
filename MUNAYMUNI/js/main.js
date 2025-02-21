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
        login: { selector: ".login-container form", campos: ["dni", "password"] },
        registro: { selector: ".registro-container form", campos: ["nombre", "dni", "password", "tipo_usuario"] },
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

/* Firebase */
import { auth, db } from "../js/firebase-config.js";  // Asegúrate de la ruta correcta

console.log("Firebase cargado en main.js sin inicialización duplicada.");


// Verificación de autenticación
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
                    console.warn("Usuario sin datos en Firestore.");
                    return;
                }
            } catch (error) {
                console.error("Error obteniendo datos del usuario:", error);
                return;
            }
        }

        // Redirección
        const currentPath = window.location.pathname;
        if (userRole === "ciudadano" && !currentPath.includes("../dashboard-ciudadano.html")) {
            window.location.href = "../dashboard-ciudadano.html";
        } else if (userRole === "funcionario" && !currentPath.includes("../dashboard-funcionario.html")) {
            window.location.href = "../dashboard-funcionario.html";
        }
    } else {
        if (!window.location.pathname.endsWith("../login.html") && !window.location.pathname.endsWith("../registro/registro.html")) {
            window.location.href = "../login.html";
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
                window.location.href = "../login.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});

// Registro con DNI
const registerForm = document.querySelector(".registro-container form");
if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const dni = document.getElementById("dni").value.trim();
        const password = document.getElementById("password").value.trim();
        const tipoUsuario = document.getElementById("tipo_usuario").value.trim();

        if (!dni || !password || !tipoUsuario) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            // Guardar en Firestore (Firebase Authentication no admite DNI directamente)
            const userRef = doc(db, "usuarios", dni);
            await setDoc(userRef, { dni, tipoUsuario, password });

            alert(`Registro exitoso como ${tipoUsuario}`);
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error en el registro:", error.message);
            alert("Error: " + error.message);
        }
    });
}

// Inicio de sesión con DNI
const loginForm = document.querySelector(".login-container form");
if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const dni = document.getElementById("dni").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!dni || !password) {
            alert("Ingrese su DNI y contraseña.");
            return;
        }

        try {
            const userRef = doc(db, "usuarios", dni);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                alert("DNI no registrado.");
                return;
            }

            const userData = userSnap.data();
            if (userData.password !== password) {
                alert("Contraseña incorrecta.");
                return;
            }

            // Simulación de autenticación con custom token
            const fakeToken = btoa(`${dni}:${password}`);
            await signInWithCustomToken(auth, fakeToken);

            alert("Inicio de sesión exitoso.");
            window.location.href = "dashboard.html";
        } catch (error) {
            console.error("Error en el inicio de sesión:", error.message);
            alert("Error: " + error.message);
        }
    });
}
