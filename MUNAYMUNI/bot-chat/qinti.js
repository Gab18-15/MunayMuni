document.addEventListener("DOMContentLoaded", function() {
    let chatContainer = document.getElementById("chat-container");
    let chatIcon = document.getElementById("chat-icon");

    // Mostrar u ocultar el chat al hacer clic en la imagen de la mascota
    chatIcon.addEventListener("click", function() {
        if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
            chatContainer.style.display = "flex";
        } else {
            chatContainer.style.display = "none";
        }
    });
});

// Enviar mensaje con Enter
function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    let chatBox = document.getElementById("chat-box");

    // Agregar mensaje del usuario (a la derecha)
    let userMessage = document.createElement("div");
    userMessage.className = "user-message";
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    // Respuesta automática del bot (a la izquierda)
    setTimeout(() => {
        let botResponse = document.createElement("div");
        botResponse.className = "bot-message";
        botResponse.textContent = getBotResponse(userInput);
        chatBox.appendChild(botResponse);

        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll hacia abajo
    }, 500);

    document.getElementById("user-input").value = ""; // Limpiar input
}

// Respuestas del bot
let firstResponseGiven = false;

function getBotResponse(input) {
    input = input.toLowerCase();

    if (!firstResponseGiven) {
        let greetings = ["hola", "buenas", "qué tal", "hey", "ayúdame", "saludos","ayuda","que tal","me ayudas","buen dia","buen día","disculpa","dime","cuéntame"];
        for (let word of greetings) {
            if (input.includes(word)) {
                firstResponseGiven = true;
    
                let botMessage = `
                    <div class="bot-message">
                        <div>Hola, Soy Q'inti, te puedo ayudar con lo siguiente:</div>
                        <ul>
                            <li>✅ <b>¿Para qué sirve esta página?</b></li>
                            <li>✅ <b>¿Cómo me registro o inicio sesión?</b></li>
                            <li>✅ <b>¿Cómo realizar un trámite?</b></li>
                            <li>✅ <b>¿Cómo ver el progreso de mi trámite?</b></li>
                            <li>✅ <b>Sobre la ONG Hábitat para la Humanidad</b></li>
                        </ul>
                    </div>
                `;
    
                document.getElementById("chat-box").innerHTML += botMessage;
                return; // Detiene la función para que no siga ejecutándose
            }
        }
        return "Puedes saludarme o pedirme ayuda diciendo 'Hola' o 'Ayúdame' 😊";
    }
    
    

    let responses = {
        // Explicación de la página
        "para qué sirve esta página": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "qué hace esta página": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "qué función tiene esta web": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "funcion": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "funcionamiento": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "funcionalidad": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "pagina": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",
        "1": "Sea bienvenido a Munay Muni, en esta página prodras gestionar y tramitar de manera rápida y sencilla sus tramites de viviendas 😊.",

        // Registro
        "cómo registrarte": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "quiero registrarme": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "crear una cuenta": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "2": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "cuenta": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "registarme": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "registrar": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "iniciar sesión": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "iniciar sesion": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "iniciar": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",
        "sesion": "Haz click en el icono superior derecha, inicia sesión si cuentas con una cuenta previa, si no es asi registrate agredando tus datos siendo dolamente tu N° de DNI y crea una contraseña.",

        // Trámites
        "cómo realizar un trámite": "Para realizar un trámite, inicia sesión o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado",
        "quiero hacer un trámite": "Para realizar un trámite, inicia sesión o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "dónde hago un trámite": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "trámite": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "tramite": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "3": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "tramites": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "como hago un tramite": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",
        "como realizo mi tramite": "Para realizar un trámite, inicia o registrate, seleccione en la barra de navegación 'Tramites' y asi podras empezar a realizar el tramite deseado.",

        // Progreso de trámites
        "cómo ver el progreso de mi trámite": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "ver mi trámite": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "estado de mi trámite": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "4": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "progreso": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "estado": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "porcentaje": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "ver estado": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",
        "ver porcentaje": "Puedes ver el progreso de tu trámite en la pestaña del navegador 'Seguimiento de Trámite', rellene el formulario con su código correspondiente junto su DNI y listo 👌.",

        // ONG
        "sobre la ong hábitat para la humanidad": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "qué hace la ong": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "ong": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "ONG": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "qué ong": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "que ong": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",
        "5": "Es una ONG que ayuda a construir viviendas dignas para personas de bajos recursos.",

    };

    return responses[input] || "Por favor, use otra palabra para poder ayudarlo 🤔.";
}
