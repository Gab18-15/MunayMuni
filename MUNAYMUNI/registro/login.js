import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

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

document.getElementById("registro-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dni = document.getElementById("dni").value;
    const password = document.getElementById("password").value;
    const nombre = document.getElementById("nombre").value;
    const rol = document.getElementById("rol").value; // "ciudadano" o "funcionario"

    try {
        // Revisar si el DNI ya existe en Firestore
        const usuarioRef = doc(db, "usuarios", dni);
        const usuarioSnap = await getDoc(usuarioRef);

        if (usuarioSnap.exists()) {
            alert("❌ Este DNI ya está registrado.");
        } else {
            // Guardar usuario en Firestore
            await setDoc(usuarioRef, {
                dni: dni,
                password: password, // Se recomienda cifrar en producción
                nombre: nombre,
                rol: rol
            });

            alert("✅ Registro exitoso.");

            // Redirigir según el rol
            window.location.href = rol === "ciudadano"
            ? "../dashboard-ciudadano.html"
            : "../dashboard-funcionario.html";
        
        }
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        alert("⚠ Error al registrar usuario.");
    }
});


