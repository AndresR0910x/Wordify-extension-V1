document.addEventListener("DOMContentLoaded", async () => {
    chrome.storage.local.get(["user_id"], async function (data) {
        const userId = data.user_id;

        if (!userId) {
            console.error("No se encontró el ID del usuario logeado.");
            window.location.href = "../html/login.html";
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

            palabras = palabras.map((palabra, index) => ({
                ...palabra,
                numero: index + 1
            }));

            let index = palabras.length - 1;
            const wordsList = document.getElementById("wordsList");
            const leftButton = document.querySelector(".nav-button.left");
            const rightButton = document.querySelector(".nav-button.right");

            function actualizarPalabra() {
                wordsList.innerHTML = "";
                const palabra = palabras[index];
                const listItem = document.createElement("li");
                listItem.innerHTML = `<strong>${palabra.numero}.</strong> ${palabra.palabra_original} → ${palabra.palabra_traducida}`;
                listItem.classList.add("text-sm"); // Reducir tamaño de fuente aún más si es necesario
                wordsList.appendChild(listItem);
            }

            leftButton.addEventListener("click", () => {
                index = (index - 1 + palabras.length) % palabras.length;
                actualizarPalabra();
            });

            rightButton.addEventListener("click", () => {
                index = (index + 1) % palabras.length;
                actualizarPalabra();
            });

            actualizarPalabra();

        } catch (error) {
            console.error("Error al cargar las palabras:", error);
        }
    });

    document.querySelector(".logout-button").addEventListener("click", () => {
        chrome.storage.local.get(["access_token", "user_id"], function (data) {
            console.log("Antes de eliminar:", data);

            chrome.storage.local.clear(function () {
                console.log("Sesión cerrada. Datos eliminados.");
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "logout" });
                });

                window.location.href = "../html/login.html";
            });
        });
    });
});
