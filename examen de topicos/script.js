document.addEventListener("DOMContentLoaded", function () {
    let listaTareas = document.getElementById("listaTareas");
    let inputTarea = document.getElementById("nuevaTarea");
    let inputFecha = document.getElementById("fechaTarea");
    let inputDescripcion = document.getElementById("descripcionTarea");
    let botonAgregar = document.getElementById("agregarTarea");

    // Cargar tareas guardadas en localStorage
    let tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tarea => agregarElementoLista(tarea.texto, tarea.fecha, tarea.descripcion));

    botonAgregar.addEventListener("click", function () {
        let texto = inputTarea.value.trim();
        let fecha = inputFecha.value;
        let descripcion = inputDescripcion.value.trim();

        if (texto === "" || fecha === "") {
            alert("Por favor, ingresa una tarea, una fecha y una descripción.");
            return;
        }

        agregarElementoLista(texto, fecha, descripcion);
        guardarTareas();
        inputTarea.value = "";
        inputFecha.value = "";
        inputDescripcion.value = "";
    });

    function agregarElementoLista(texto, fecha, descripcion) {
        let li = document.createElement("li");
        let diasRestantes = calcularDiferenciaDias(fecha);

        // Asignar color según la cercanía de la tarea
        if (diasRestantes <= 2) {
            li.classList.add("rojo");  // Muy urgente (rojo)
        } else if (diasRestantes <= 6) {
            li.classList.add("verde");  // Próxima (verde)
        } else {
            li.classList.add("naranja");  // Lejana (naranja)
        }

        li.innerHTML = `<strong>${texto}</strong> - ${fecha}<br><small>${descripcion}</small> <button onclick="eliminarTarea(this)" class="eliminar">❌</button>`;
        listaTareas.appendChild(li);
    }

    window.eliminarTarea = function (boton) {
        boton.parentElement.remove();
        guardarTareas();
    };

    function guardarTareas() {
        let tareas = [];
        listaTareas.querySelectorAll("li").forEach(li => {
            let partes = li.innerHTML.split("<br>");
            let textoFecha = partes[0].replace("<strong>", "").replace("</strong>", "").trim();
            let descripcion = partes[1] ? partes[1].replace("<small>", "").replace("</small>", "").trim() : "";
            let [texto, fecha] = textoFecha.split(" - ");
            tareas.push({ texto, fecha, descripcion });
        });

        localStorage.setItem("tareas", JSON.stringify(tareas));
    }

    function calcularDiferenciaDias(fechaTarea) {
        let fechaTareaDate = new Date(fechaTarea);
        let hoy = new Date();
        let diferencia = fechaTareaDate - hoy;
        return Math.ceil(diferencia / (1000 * 60 * 60 * 24)); // Convertir ms a días
    }
});
