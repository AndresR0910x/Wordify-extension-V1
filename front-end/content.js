let isAuthenticated = false;
let userId = null;
let accessToken = null;
let button = null;

// Función para verificar el estado de autenticación
function checkAuthentication() {
    chrome.storage.local.get(["access_token", "user_id"], function (data) {
        if (data.access_token && data.user_id) {
            isAuthenticated = true;
            userId = data.user_id;
            accessToken = data.access_token;
            console.log("✅ Usuario autenticado, activando subrayado...");
        } else {
            isAuthenticated = false;
            userId = null;
            accessToken = null;
            console.log("❌ Usuario no autenticado, limpiando la interfaz...");
            removeButton();
        }
    });
}

// Verificar autenticación al cargar el script
checkAuthentication();

// Escuchar mensajes desde otros scripts (login.js y wordify.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "login") {
        console.log("✅ Usuario ha iniciado sesión. Actualizando estado...");
        isAuthenticated = true;
        userId = request.user_id;
        accessToken = request.access_token;
    } else if (request.action === "logout") {
        console.log("🔴 Usuario ha cerrado sesión. Limpiando...");
        isAuthenticated = false;
        userId = null;
        accessToken = null;
        removeButton();
    }
});

// Evento para mostrar el botón de "Recordar"
document.addEventListener("mouseup", () => {
    if (isAuthenticated) {
        underlineSelectedWord(userId, accessToken);
    } else {
        removeButton();
    }
});

// Función para subrayar la palabra seleccionada
function underlineSelectedWord(userId, token) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    // Verificar si la selección es una sola palabra (sin espacios)
    const isSingleWord = selectedText.split(/\s+/).length === 1; // Verifica si no hay espacios

    if (selectedText.length > 0 && isSingleWord) {
        if (!button) {
            button = document.createElement("button");
            button.innerText = "Recordar";
            button.classList.add("record-button");
            button.style.position = "absolute";
            button.style.backgroundColor = "#4CAF50";
            button.style.color = "white";
            button.style.border = "none";
            button.style.padding = "5px 10px";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.zIndex = "9999";

            document.body.appendChild(button);
        }

        const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
        if (range) {
            const rect = range.getBoundingClientRect();
            button.style.left = `${rect.left + window.scrollX}px`;
            button.style.top = `${rect.top + window.scrollY - 30}px`;
        }

        // Evento cuando se hace clic en "Recordar"
        button.onclick = function () {
            console.log("📌 Palabra recordada:", selectedText);
            guardarPalabra(selectedText, userId, token);
        };
    } else {
        removeButton();
    }
}

// Función para eliminar el botón si el usuario hace clic fuera
document.addEventListener("click", (event) => {
    if (button && !button.contains(event.target) && window.getSelection().toString().trim() === "") {
        removeButton();
    }
});

// Función para eliminar el botón de la página
function removeButton() {
    if (button) {
        button.remove();
        button = null;
    }
}

// Función para guardar la palabra en el servidor
function guardarPalabra(palabra, userId, token) {
    fetch("http://127.0.0.1:8000/palabra/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            palabra_original: palabra,
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.palabra_traducida) {
            console.log(`✅ Palabra guardada: "${data.palabra_original}"`);
            console.log(`🔁 Traducción: "${data.palabra_traducida}"`);
            
            // Mostrar el mensaje en el alert con negrita simulada y salto de línea
            alert("Haz aprendido una nueva palabra!\n\nIngles: " + data.palabra_original + " - Significado: " + data.palabra_traducida);
            removeButton();
        } else {
            console.error("❌ Error al guardar la palabra en la API.");
        }
    })
    .catch(error => {
        console.error("❌ Error al enviar la palabra a la API:", error);
    });
}
