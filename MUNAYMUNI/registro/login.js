import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAQnPwCSfxQftT2WI8c5cf8oIBbhAmWK6Q",
    authDomain: "habitad-para-la-humanidad.firebaseapp.com",
    projectId: "habitad-para-la-humanidad",
    storageBucket: "habitad-para-la-humanidad.appspot.com",
    messagingSenderId: "832391400472",
    appId: "1:832391400472:web:14c64e9200e01a4eb31517"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dni = document.getElementById("dni").value;
    const password = document.getElementById("password").value;

    try {
        // Revisar si el DNI existe en Firestore
        const usuarioRef = doc(db, "usuarios", dni);
        const usuarioSnap = await getDoc(usuarioRef);

        if (!usuarioSnap.exists()) {
            alert("❌ El DNI no está registrado.");
            return;
        }

        const usuarioData = usuarioSnap.data();

        // Verificar que la contraseña coincide
        if (usuarioData.password === password) {
            alert("✅ Inicio de sesión exitoso.");

            // Redirigir según el rol
            window.location.href = usuarioData.rol === "ciudadano"
                ? "../dashboard-ciudadano.html"
                : "../dashboard-funcionario.html";
        } else {
            alert("❌ Contraseña incorrecta.");
        }

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("⚠ Error al iniciar sesión.");
    }
});
