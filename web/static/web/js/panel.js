function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

function renderizarConsultas(consultas) {
  const tabla = document.getElementById("tabla_consultas");
  const consulta_comercial = document.getElementById("consulta_comercial");
  const consulta_tecnica = document.getElementById("consulta_tecnica");
  const consulta_rrhh = document.getElementById("consulta_rrhh");
  const consulta_general = document.getElementById("consulta_general");
  let cantidadComercial = 0;
  let cantidadTecnica = 0;
  let cantidadRRHH = 0;
  let cantidadGeneral = 0;

  tabla.innerHTML = "";
  consultas.forEach((consulta) => {
    const fila = document.createElement("tr");
    const fecha = new Date(consulta.fecha_postulante).toLocaleDateString(
      "es-AR"
    );

    // Actualizar contadores según la categoría de la consulta
    if (consulta.categoria === "Comercial") {
      cantidadComercial++;
    } else if (consulta.categoria === "Técnica") {
      cantidadTecnica++;
    } else if (consulta.categoria === "RRHH") {
      cantidadRRHH++;
    } else if (consulta.categoria === "General") {
      cantidadGeneral++;
    }

    fila.innerHTML = `
      <td>${consulta.categoria}</td>
      <td>${fecha}</td>
      <td>${consulta.nombre}</td>
      <td>${consulta.apellido}</td>
      <td>${consulta.mail}</td>
      <td>${consulta.linkedin}</td>
      <td>${consulta.mensaje}</td>
      <td>
        <button class="btn-editar btn btn-sm btn-outline-primary" 
          data-id="${consulta.id}"
          data-categoria="${consulta.categoria}"
          data-fecha="${consulta.fecha_postulante}"
          data-nombre="${consulta.nombre}"
          data-apellido="${consulta.apellido}"
          data-mail="${consulta.mail}"
          data-linkedin="${consulta.linkedin}"
          data-mensaje="${consulta.mensaje}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <a href="/eliminar/${consulta.id}/" title="Eliminar">
          <i class="bi bi-trash"></i>
        </a>
      </td>
    `;
    tabla.appendChild(fila);
    consulta_comercial.textContent = `Consulta Comercial: ${cantidadComercial}`;
    consulta_tecnica.textContent = `Consulta Técnica: ${cantidadTecnica}`;
    consulta_rrhh.textContent = `Consulta de RRHH: ${cantidadRRHH}`;
    consulta_general.textContent = `Consulta General: ${cantidadGeneral}`;
  });
}

// Manejo del formulario de nueva consulta
document.addEventListener("click", function (e) {
  if (e.target.closest(".btn-editar")) {
    const btn = e.target.closest(".btn-editar");
    document.getElementById("editarId").value = btn.dataset.id;
    document.getElementById("editarCategoria").value = btn.dataset.categoria;
    console.log(btn.dataset.fecha);
    document.getElementById("editarFecha").value = new Date(btn.dataset.fecha).toLocaleDateString(
      "es-AR"
    );
    document.getElementById("editarNombre").value = btn.dataset.nombre;
    document.getElementById("editarApellido").value = btn.dataset.apellido;
    document.getElementById("editarMail").value = btn.dataset.mail;
    document.getElementById("editarLinkedin").value = btn.dataset.linkedin;
    document.getElementById("editarMensaje").value = btn.dataset.mensaje;

    new bootstrap.Modal(document.getElementById("modalEditar")).show();
  }
});

// Manejo del formulario de edición
document.getElementById("formEditar").addEventListener("submit", function (e) {
  e.preventDefault();

  const id = document.getElementById("editarId").value;
  const datos = {
    categoria: document.getElementById("editarCategoria").value,
    fecha_postulante: document.getElementById("editarFecha").value,
    nombre: document.getElementById("editarNombre").value,
    apellido: document.getElementById("editarApellido").value,
    mail: document.getElementById("editarMail").value,
    linkedin: document.getElementById("editarLinkedin").value,
    mensaje: document.getElementById("editarMensaje").value,
  };
  console.log(JSON.stringify(datos))

  fetch(`/editar/${id}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: JSON.stringify(datos),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al actualizar");
      return res.json();
    })
    .then((data) => {
      if (data.success) {
        bootstrap.Modal.getInstance(
          document.getElementById("modalEditar")
        ).hide();
        return fetch("/api/consultas/");
      } else {
        alert("Error: " + data.error);
      }
    })
    .then((res) => res.json())
    .then((data) => {
      renderizarConsultas(data);
    })
    .catch((err) => {
      alert("Hubo un problema al actualizar.");
      console.error(err);
    });
});

// api de consultas
fetch("/api/consultas/")
  .then((res) => {
    if (!res.ok) throw new Error("No autorizado o error en la respuesta");
    return res.json();
  })
  .then((data) => {
    renderizarConsultas(data);
  })
  .catch((err) => {
    document.getElementById("error_tabla").textContent =
      "No se pudieron cargar las consultas.";
  });
