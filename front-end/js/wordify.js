document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.local.get(["user_id"], async function (data) {
        const userId = data.user_id;

        if (!userId) {
            console.error("No se encontró el ID del usuario logeado.");
            window.location.href = "../html/login.html"; // Redirigir al login si no hay sesión activa
            return;
        }

        console.log("ID de usuario obtenido:", userId);

        try {
            const response = await fetch(`http://localhost:8000/palabras/${userId}`);
            if (!response.ok) {
                throw new Error("Error al obtener las palabras");
            }
            let palabras = await response.json();

            if (!palabras || palabras.length === 0) {
                console.log("No hay palabras guardadas.");
                return;
            }

            // Asignar numeración correcta desde la primera palabra hasta la última
            palabras = palabras.map((palabra, index) => ({
                ...palabra,
                numero: index + 1 // Asigna 1, 2, 3... en orden
            }));

            let index = palabras.length - 1; // Iniciar en la última palabra
            const wordsList = document.querySelector(".saved-words ul");
            const leftButton = document.querySelector(".nav-button.left");
            const rightButton = document.querySelector(".nav-button.right");

            function actualizarPalabra() {
                wordsList.innerHTML = ""; // Limpiar lista
                const palabra = palabras[index]; // Obtener palabra actual
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${palabra.numero}.</strong> ${palabra.palabra_original} → ${palabra.palabra_traducida}`;
                wordsList.appendChild(listItem);
            }

            // Navegación infinita
            leftButton.addEventListener("click", () => {
                index = (index - 1 + palabras.length) % palabras.length; // Retrocede en bucle
                actualizarPalabra();
            });

            rightButton.addEventListener("click", () => {
                index = (index + 1) % palabras.length; // Avanza en bucle
                actualizarPalabra();
            });

            actualizarPalabra(); // Mostrar la última palabra agregada al cargar

        } catch (error) {
            console.error("Error al cargar las palabras:", error);
        }
    });

    // Función para cerrar sesión
    document.querySelector(".logout-button").addEventListener("click", () => {
        chrome.storage.local.get(["access_token", "user_id"], function (data) {
            console.log("Antes de eliminar:", data);

            chrome.storage.local.clear(function () {
                console.log("Sesión cerrada. Datos eliminados.");

                // Enviar un mensaje a content.js para notificar que el usuario ha cerrado sesión
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "logout" });
                });

                // Redirigir al login
                window.location.href = "../html/login.html";
            });
        });
    });
});