chrome.storage.local.get(["access_token", "user_id"], function(data) {
    if (data.access_token && data.user_id) {
        console.log("Token almacenado:", data.access_token);
        console.log("ID de usuario almacenado:", data.user_id);
    } else {
        console.log("No se encontró el token o el ID de usuario en chrome.storage.local");
    }
});

// Cuando guardes una nueva palabra, envía un mensaje al background script
chrome.runtime.sendMessage({ action: "open_popup" });
