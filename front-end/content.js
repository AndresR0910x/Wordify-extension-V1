// Verificar si el usuario está autenticado antes de ejecutar el script
chrome.storage.local.get(["access_token", "user_id"], function (data) {
    if (data.access_token && data.user_id) {
        console.log("Usuario autenticado, activando subrayado...");
        document.addEventListener("mouseup", () => underlineSelectedWord(data.user_id, data.access_token));
    } else {
        console.log("Usuario no autenticado, el script no se ejecutará.");
    }
});

function underlineSelectedWord(userId, token) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
        let button = document.querySelector('.record-button');

        if (!button) {
            button = document.createElement('button');
            button.innerText = 'Recordar';
            button.classList.add('record-button');
            button.style.position = 'absolute';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.borderRadius = '5px';

            document.body.appendChild(button);
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        button.style.left = `${rect.left + window.scrollX}px`;
        button.style.top = `${rect.top + window.scrollY - 30}px`;

        // Evento cuando se hace clic en "Recordar"
        button.onclick = function () {
            const currentSelection = window.getSelection().toString().trim();
            if (currentSelection.length > 0) {
                console.log("Palabra recordada:", currentSelection);
                guardarPalabra(currentSelection, userId, token);
                button.remove();
            }
        };
    }
}

function guardarPalabra(palabra, userId, token) {
    fetch("http://127.0.0.1:8000/palabra/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Enviar token para autenticación
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
            alert(`Palabra guardada: ${data.palabra_original} - Traducción: ${data.palabra_traducida}`);
        } else {
            console.error("❌ Error al guardar la palabra en la API.");
        }
    })
    .catch(error => {
        console.error("❌ Error al enviar la palabra a la API:", error);
    });
}
