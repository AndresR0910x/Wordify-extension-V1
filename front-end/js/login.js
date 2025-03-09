document.addEventListener("DOMContentLoaded", function() {
    // Tu código aquí
  
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const username = document.querySelector("#username").value;
      const password = document.querySelector("#password").value;
  
      // Realizar la solicitud de login aquí
      fetch('http://127.0.0.1:8000/login?username=' + username + '&password=' + password, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          alert('Usuario ha iniciado sesión');
        } else {
          alert('Error al iniciar sesión');
        }
      })
      .catch(error => {
        console.error('Error al hacer el login:', error);
      });
    });
  });
  