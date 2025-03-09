function underlineSelectedWord() {
    const selection = window.getSelection(); // Obtiene la selección del usuario
    const selectedText = selection.toString().trim();

    
    if (selectedText.length > 0) {
        // Verificar si ya existe un botón
        let button = document.querySelector('.record-button');

        // Si no existe, crear el botón
        if (!button) {
            button = document.createElement('button');
            button.innerText = 'Recordar';
            button.classList.add('record-button');
            button.style.position = 'absolute';
            button.style.backgroundColor = '#4CAF50'; // Estilo del botón (opcional)
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '5px 10px';
            button.style.borderRadius = '5px';

            // Añadir el botón al documento
            document.body.appendChild(button);
        }

        // Calcular la posición de la palabra seleccionada
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        button.style.left = `${rect.left + window.scrollX}px`;
        button.style.top = `${rect.top + window.scrollY - 30}px`; // Ajuste para que esté encima

        // Actualizar el evento de clic del botón para usar la palabra actual
        button.onclick = function () {
            const currentSelection = window.getSelection().toString().trim();
            if (currentSelection.length > 0) {
                console.log('Palabra recordada:', currentSelection);
                
                button.remove()
                
            }
        };
    }
}

// El evento se ejecuta cuando se selecciona un texto
document.addEventListener("mouseup", underlineSelectedWord);