import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Función para obtener datos del usuario desde Firestore
async function obtenerDatosUsuario(uid) {
    try {
        const userRef = doc(db, "usuarios", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            console.error("❌ No se encontró el usuario en Firestore.");
            return null;
        }
    } catch (error) {
        console.error("❌ Error al obtener datos del usuario:", error);
        return null;
    }
}

// Cargar el formulario para ciudadanos
function cargarFormularioCiudadano(user) {
    if (!user) {
        console.error("❌ No se recibió información del usuario.");
        return;
    }

    console.log("✅ Datos de usuario obtenidos:", user);

    const ciudadanoContent = document.getElementById("ciudadano-content");
    const funcionarioContent = document.getElementById("funcionario-content");

    // Ocultar todas las secciones al inicio
    ciudadanoContent.classList.add("d-none");
    if (funcionarioContent) {
        funcionarioContent.classList.add("d-none");
    }

    if (user.rol === "ciudadano") {
        console.log("✅ Usuario es ciudadano, mostrando Inspección Técnica...");
        ciudadanoContent.classList.remove("d-none");
    } else {
        console.log("❌ Usuario NO es ciudadano, ocultando Inspección Técnica...");
    }

    inicializarGrafico();
}

// Inicializar gráfico con Chart.js
function inicializarGrafico() {
    const ctx = document.getElementById("chart").getContext("2d");
    let progressText = document.getElementById("progress-text");

    let chart = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completado", "Pendiente"],
            datasets: [{
                data: [0, 100], // Inicialmente en 0%
                backgroundColor: ["#ff6666", "#ddd"]
            }]
        },
        options: {
            cutout: "70%",
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });

    function actualizarGrafico(porcentaje) {
        chart.data.datasets[0].data = [porcentaje, 100 - porcentaje];
        chart.update();
        progressText.innerText = `${porcentaje}%`;
    }

    const form = document.getElementById("formulario-seguimiento");
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let numeroTramite = document.getElementById("numero-tramite").value.trim();
        let dniIngresado = document.getElementById("dni").value.trim();

        if (!numeroTramite || !dniIngresado) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (dniIngresado !== auth.currentUser?.dni) {
            alert("❌ El DNI ingresado no coincide con el usuario actual.");
            return;
        }

        // Simulación de búsqueda en la base de datos
        let tramite = tramitesDB.find(t => t.codigo === numeroTramite && t.dni === dniIngresado);

        if (!tramite) {
            alert("❌ Trámite no encontrado. Verifique los datos ingresados.");
            return;
        }

        document.getElementById("progress-container").style.display = "block";
        actualizarGrafico(tramite.porcentaje);
    });
}

// Obtener el usuario autenticado
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userData = await obtenerDatosUsuario(user.uid);
        cargarFormularioCiudadano(userData);
    } else {
        console.log("❌ No hay usuario autenticado.");
    }
});
