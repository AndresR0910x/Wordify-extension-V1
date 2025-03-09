// Escuchar mensajes desde content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'guardar_palabra') {
        chrome.storage.local.get({ palabras: [] }, (data) => {
            const palabrasActuales = data.palabras;
            palabrasActuales.push(request.palabra);

            chrome.storage.local.set({ palabras: palabrasActuales }, () => {
                console.log('Palabra guardada:', request.palabra);
            });
        });
    }
});
