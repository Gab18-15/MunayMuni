document.addEventListener("DOMContentLoaded", async function () {
    const userRole = sessionStorage.getItem("userRole");

    if (userRole === "ciudadano") {
        document.getElementById("ciudadanoSection").classList.remove("d-none");
    } else if (userRole === "funcionario") {
        document.getElementById("funcionarioSection").classList.remove("d-none");
    }
});
