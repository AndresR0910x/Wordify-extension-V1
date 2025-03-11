document.addEventListener("DOMContentLoaded", function () {
    // Verificar si el usuario ya está autenticado
    chrome.storage.local.get(["access_token"], function (data) {
        if (data.access_token) {
            console.log("Usuario ya autenticado. Redirigiendo a wordify.html...");
            window.location.href = "wordify.html"; // Redirige si hay sesión activa
        }
    });

    // Manejar el envío del formulario de login
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que la página recargue

        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;

        fetch('http://127.0.0.1:8000/login?username=' + username + '&password=' + password, {
            method: 'POST',
            headers: { 'accept': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            if (data.access_token) {
                // Guardar credenciales en chrome.storage.local
                chrome.storage.local.set({ 
                    access_token: data.access_token,
                    user_id: data.user_id
                }, function () {
                    console.log("Usuario autenticado. Redirigiendo...");

                    // Enviar un mensaje a content.js para notificar que el usuario está autenticado
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, { 
                            action: "login", 
                            access_token: data.access_token, 
                            user_id: data.user_id 
                        });
                    });

                    window.location.href = "wordify.html"; // Redirigir a la vista principal
                });
            } else {
                alert('Error al iniciar sesión. Verifica tus credenciales.');
            }
        })
        .catch(error => {
            console.error('Error al hacer el login:', error);
        });
    });
});