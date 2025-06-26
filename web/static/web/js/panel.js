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
    const fecha = new Date(consulta.fecha_postulante).toLocaleDateString("es-AR");

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
      <td>${consulta.mail}</td>
      <td>${consulta.linkedin}</td>
      <td>${consulta.mensaje}</td>
      <td>
        <a href="{% url 'editar_consulta' consulta.id %}" title="Editar">
          <i class="bi bi-pencil-square"></i>
        </a>
        <a href="{% url 'eliminar_consulta' consulta.id %}" title="Eliminar">
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
