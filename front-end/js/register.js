document.addEventListener("DOMContentLoaded", function() {
    // Selecciona el formulario de registro
    const form = document.querySelector("form");
    
    // Agregar el listener de evento para el submit
    form.addEventListener("submit", function(event) {
      event.preventDefault();  // Evitar que el formulario se envíe de la forma tradicional
      
      // Obtener los valores de los campos de entrada
      const username = document.querySelector("#username").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const confirmPassword = document.querySelector("#confirm_password").value;
  
      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }
  
      // Realizar la solicitud POST para registrar al usuario
      fetch('http://127.0.0.1:8000/register?username=' + username + '&email=' + email + '&password=' + password, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        // Verificar si la respuesta contiene el mensaje de éxito
        if (data.message === "Usuario creado con éxito") {
          alert("¡Registro exitoso! Puedes iniciar sesión.");
          window.location.href = "login.html";  // Redirige a la página de login
        } else {
          alert("Error al registrar el usuario: " + data.detail);
        }
      })
      .catch(error => {
        console.error('Error al realizar el registro:', error);
        alert("Hubo un problema al registrar el usuario.");
      });
    });
  });
  