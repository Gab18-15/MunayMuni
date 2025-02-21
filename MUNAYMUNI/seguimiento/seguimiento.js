function cargarFormularioCiudadano(dniUsuario) {
    const form = document.getElementById("formSeguimiento");
    const numeroTramiteInput = document.getElementById("numeroTramite");
    const progressText = document.getElementById("progressText");
    const progressContainer = document.getElementById("progress-container");
    const ctx = document.getElementById("progressCanvas").getContext("2d");

    // Inicializar gráfico con Chart.js
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

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        let numeroTramite = numeroTramiteInput.value.trim();
        let dniIngresado = document.getElementById("dni").value.trim();

        if (numeroTramite === "" || dniIngresado === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }

        if (dniIngresado !== dniUsuario) {
            alert("❌ El DNI ingresado no coincide con el usuario actual.");
            return;
        }

        // Buscar trámite por DNI
        let tramite = tramitesDB.find(t => t.codigo === numeroTramite && t.dni === dniUsuario);

        if (!tramite) {
            alert("❌ Trámite no encontrado. Verifique los datos ingresados.");
            return;
        }

        progressContainer.style.display = "block";
        actualizarGrafico(tramite.porcentaje);
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const userData = localStorage.getItem("usuario");

    if (!userData) {
        alert("No tienes acceso a esta página. Inicia sesión.");
        window.location.href = "../registro/login.html";
        return;
    }

    const user = JSON.parse(userData);

    console.log("Usuario logueado:", user); // 🔹 Verificación en consola

    if (user.rol === "ciudadano") {
        document.getElementById("ciudadano-content").classList.remove("d-none");
        cargarFormularioCiudadano(user.dni);
    } else if (user.rol === "funcionario") {
        document.getElementById("funcionario-content").classList.remove("d-none");
        cargarTablaFuncionarios();
    } else {
        alert("No tienes acceso a esta página.");
        window.location.href = "../index.html";
    }
});
