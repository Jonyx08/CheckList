export class TareaView {
    constructor() {
        this.form = this.obtener("#form-tarea");
        this.inputTitulo = this.obtener("#titulo");
        this.inputDescripcion = this.obtener("#descripcion");
        this.btnGuardar = this.obtener("#btn-guardar");
        this.btnCancelar = this.obtener("#btn-cancelar");
        this.error = this.obtener("#error");
        this.inputBuscar = this.obtener("#buscar");
        this.lista = this.obtener("#lista");
        this.contador = this.obtener("#contador");
    }
    obtener(selector) {
        const el = document.querySelector(selector);
        if (!el)
            throw new Error(`No se encontró el elemento ${selector}`);
        return el;
    }
    // ---- Eventos que la vista le expone al controlador ----
    onGuardar(cb) {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            cb(this.inputTitulo.value, this.inputDescripcion.value);
        });
    }
    onCancelar(cb) {
        this.btnCancelar.addEventListener("click", cb);
    }
    onBuscar(cb) {
        this.inputBuscar.addEventListener("input", () => cb(this.inputBuscar.value));
    }
    onAccion(cb) {
        this.lista.addEventListener("click", (e) => {
            const boton = e.target.closest("[data-accion]");
            const id = boton?.closest("[data-id]")?.dataset.id;
            if (!boton || !id)
                return;
            cb(boton.dataset.accion, id);
        });
    }
    // ---- Render ----
    render(tareas, total, busqueda) {
        this.lista.replaceChildren();
        if (tareas.length === 0) {
            const vacio = document.createElement("p");
            vacio.className = "vacio";
            vacio.textContent = busqueda.trim()
                ? "No hay tareas que coincidan con la búsqueda."
                : "Aún no hay tareas. ¡Agrega la primera!";
            this.lista.append(vacio);
        }
        for (const t of tareas)
            this.lista.append(this.crearTarjeta(t));
        const pendientes = tareas.filter((t) => !t.completada).length;
        this.contador.textContent = `${tareas.length} de ${total} tareas · ${pendientes} pendientes`;
    }
    crearTarjeta(t) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarea" + (t.completada ? " completada" : "");
        tarjeta.dataset.id = t.id;
        const titulo = document.createElement("h3");
        titulo.textContent = t.titulo;
        const descripcion = document.createElement("p");
        descripcion.textContent = t.descripcion;
        const fecha = document.createElement("small");
        fecha.textContent = new Date(t.fechaCreacion).toLocaleDateString("es");
        const acciones = document.createElement("div");
        acciones.className = "acciones";
        acciones.append(this.crearBoton(t.completada ? "Reabrir" : "Completar", "alternar", "btn"), this.crearBoton("Editar", "editar", "btn"), this.crearBoton("Eliminar", "eliminar", "btn peligro"));
        tarjeta.append(titulo);
        if (t.descripcion)
            tarjeta.append(descripcion);
        tarjeta.append(fecha, acciones);
        return tarjeta;
    }
    crearBoton(texto, accion, clase) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = clase;
        b.dataset.accion = accion;
        b.textContent = texto;
        return b;
    }
    // ---- Formulario ----
    cargarFormulario(t) {
        this.inputTitulo.value = t.titulo;
        this.inputDescripcion.value = t.descripcion;
        this.btnGuardar.textContent = "Guardar cambios";
        this.btnCancelar.hidden = false;
        this.inputTitulo.focus();
    }
    limpiarFormulario() {
        this.form.reset();
        this.btnGuardar.textContent = "Agregar tarea";
        this.btnCancelar.hidden = true;
    }
    mostrarError(mensaje) {
        this.error.textContent = mensaje;
    }
}
