import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, query, where, addDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js';

// Inicialización de Firebase
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();
const ciudadanoSection = document.getElementById("ciudadano-content");
const funcionarioSection = document.getElementById("funcionario-content");
const solicitudForm = document.getElementById("solicitudForm");
const tablaSolicitudes = document.getElementById("tablaSolicitudes");
const tablaRevisiones = document.getElementById("tablaRevisiones");

// Verificación de usuario autenticado y su rol
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userId = user.uid;
        const userRole = localStorage.getItem("userRole");

        if (!userRole) {
            alert("Error: No se encontró el rol del usuario.");
            return;
        }

        if (userRole === "ciudadano") {
            ciudadano-content.classList.remove("d-none");
            cargarMisSolicitudes(userId);
        } else if (userRole === "funcionario") {
            funcionarioSection.classList.remove("d-none");
            cargarSolicitudesPendientes();
        }
    } else {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "../registro/login.html";
    }
});

// Función para enviar solicitud de autorización
solicitudForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nombreProyecto = document.getElementById("nombreProyecto").value.trim();
    const ubicacion = document.getElementById("ubicacion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const archivo = document.getElementById("archivo").files[0];

    if (!nombreProyecto || !ubicacion || !descripcion) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const userId = auth.currentUser.uid;
    const usuarioRef = doc(db, "usuarios", userId);
    const usuarioDoc = await getDocs(query(collection(db, "usuarios"), where("userId", "==", userId)));

    let nombreUsuario = "Ciudadano Anónimo";
    usuarioDoc.forEach((doc) => {
        nombreUsuario = doc.data().nombre;
    });

    let archivoURL = "";
    if (archivo) {
        const storageRef = ref(storage, `solicitudes/${userId}/${archivo.name}`);
        await uploadBytes(storageRef, archivo);
        archivoURL = await getDownloadURL(storageRef);
    }

    // Utilizando addDoc para evitar sobrescribir documentos
    await addDoc(collection(db, "solicitudes"), {
        userId,
        nombreUsuario,
        nombreProyecto,
        ubicacion,
        descripcion,
        archivoURL,
        estado: "Pendiente",
        comentarios: ""
    });

    solicitudForm.reset();
    cargarMisSolicitudes(userId);
});

// Función para cargar solicitudes del ciudadano
async function cargarMisSolicitudes(userId) {
    tablaSolicitudes.innerHTML = "";
    try {
        const snapshot = await getDocs(query(collection(db, "solicitudes"), where("userId", "==", userId)));

        snapshot.forEach(doc => {
            const data = doc.data();
            tablaSolicitudes.innerHTML += `
                <tr>
                    <td>${data.nombreProyecto}</td>
                    <td>${data.ubicacion}</td>
                    <td>${data.estado}</td>
                    <td>${data.comentarios || "N/A"}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar las solicitudes:", error);
    }
}

// Función para cargar solicitudes pendientes para funcionarios
async function cargarSolicitudesPendientes() {
    tablaRevisiones.innerHTML = "";
    try {
        const snapshot = await getDocs(query(collection(db, "solicitudes"), where("estado", "==", "Pendiente")));

        snapshot.forEach(doc => {
            const data = doc.data();
            tablaRevisiones.innerHTML += `
                <tr>
                    <td>${data.nombreUsuario}</td>
                    <td>${data.nombreProyecto}</td>
                    <td>${data.ubicacion}</td>
                    <td>${data.estado}</td>
                    <td>
                        <button class="btn btn-success btn-sm" onclick="actualizarEstado('${doc.id}', 'Aprobado')">✅ Aprobar</button>
                        <button class="btn btn-danger btn-sm" onclick="actualizarEstado('${doc.id}', 'Rechazado')">❌ Rechazar</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error al cargar las solicitudes pendientes:", error);
    }
}

// Función para actualizar estado de solicitud
window.actualizarEstado = async function (id, estado) {
    try {
        const docRef = doc(db, "solicitudes", id);
        await updateDoc(docRef, { estado });

        alert(`Solicitud actualizada a: ${estado}`);
        cargarSolicitudesPendientes();
    } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error);
    }
};
