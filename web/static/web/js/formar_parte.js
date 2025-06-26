document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const spinner = document.getElementById("spinner");
  const btnSimular = document.querySelector(".button-formulario");
  const formulario = document.getElementById("formulario");
  const success_message = document.getElementById("success_message");
  const error_message = document.getElementById("error_message");
  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();
  const linkedin = document.getElementById("linkedin").value.trim();
  const mensaje = document.getElementById("mensaje").value.trim();
  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]'
  ).value;
  const error_nombre = document.getElementById("error_nombre");
  const error_apellido = document.getElementById("error_apellido");
  const error_email = document.getElementById("error_email");
  const error_linkedin = document.getElementById("error_linkedin");
  const error_mensaje = document.getElementById("error_mensaje");

  // Activar spinner y deshabilitar botón
  spinner.style.display = "inline-block";
  btnSimular.disabled = true;

  //validaciones de campos obligatorios
  if (!nombre || !apellido || !email || !linkedin || !mensaje) {
    error_nombre.textContent = !nombre ? "El nombre es obligatorio." : "";
    error_apellido.textContent = !apellido ? "El apellido es obligatorio." : "";
    error_email.textContent = !email ? "El email es obligatorio." : "";
    error_linkedin.textContent = !linkedin ? "El LinkedIn es obligatorio." : "";
    error_mensaje.textContent = !mensaje ? "El mensaje es obligatorio." : "";
    return;
  }

  // Validaciones adicionales
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const urlValida = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/;

  if (!soloLetras.test(nombre)) {
    error_nombre.textContent =
      "El nombre no debe contener números ni símbolos.";
    return;
  }

  if (!soloLetras.test(apellido)) {
    error_apellido.textContent =
      "El apellido no debe contener números ni símbolos.";
    return;
  }

  if (!emailValido.test(email)) {
    error_email.textContent = "El email no es válido.";
    return;
  }

  if (!urlValida.test(linkedin)) {
    error_linkedin.textContent = "Debe ser una URL válida de LinkedIn.";
    return;
  }
  if (!mensaje) {
    error_mensaje.textContent = "El mensaje es obligatorio.";
    return;
  }

  fetch('/forma_parte/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ nombre, apellido, email, linkedin, mensaje }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // dejar el formulario en blanco
        formulario.reset();
        error_nombre.textContent = "";
        error_apellido.textContent = "";
        error_email.textContent = "";
        error_linkedin.textContent = "";
        error_mensaje.textContent = "";

        // Mostrar mensaje de éxito
        success_message.textContent = "Formulario enviado con éxito. Nos estameos comunicando contigo.";

        // Limpiar mensaje de error
        error_message.textContent = "";
      } else {
        error_nombre.textContent = data.errores.nombre || "";
        error_apellido.textContent = data.errores.apellido || "";
        error_email.textContent = data.errores.email || "";
        error_linkedin.textContent = data.errores.linkedin || "";
        error_mensaje.textContent = data.errores.mensaje || "";
        error_message.textContent = "";
      }
    })
    .catch(() => {
      error_message.textContent =
        "Error inesperado. Intentá de nuevo más tarde.";
    })
    .finally(() => {
      // Ocultar spinner y restaurar texto del botón
      spinner.style.display = "none";
      btnSimular.disabled = false;
    });
});
