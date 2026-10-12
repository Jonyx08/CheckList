import { Tarea } from "../models/Entity.js";
export class TareaController {
    constructor(storage, vista) {
        this.storage = storage;
        this.vista = vista;
        this.tareas = [];
        this.busqueda = "";
        this.editandoId = null;
    }
    iniciar() {
        this.tareas = this.cargarTareas();
        this.vista.onGuardar((titulo, descripcion) => this.guardar(titulo, descripcion));
        this.vista.onCancelar(() => this.cancelarEdicion());
        this.vista.onBuscar((texto) => {
            this.busqueda = texto;
            this.refrescar();
        });
        this.vista.onAccion((accion, id) => {
            if (accion === "alternar")
                this.alternar(id);
            if (accion === "editar")
                this.editar(id);
            if (accion === "eliminar")
                this.eliminar(id);
        });
        this.refrescar();
    }
    cargarTareas() {
        const resultado = [];
        for (const dto of this.storage.cargar()) {
            try {
                resultado.push(Tarea.fromJSON(dto));
            }
            catch {
                // Si un registro guardado es inválido, se ignora.
            }
        }
        return resultado;
    }
    guardar(titulo, descripcion) {
        try {
            if (this.editandoId) {
                this.buscarPorId(this.editandoId)?.actualizar(titulo, descripcion);
            }
            else {
                this.tareas.push(new Tarea(titulo, descripcion));
            }
            this.editandoId = null;
            this.persistir();
            this.vista.limpiarFormulario();
            this.vista.mostrarError("");
            this.refrescar();
        }
        catch (e) {
            this.vista.mostrarError(e instanceof Error ? e.message : "Ocurrió un error.");
        }
    }
    alternar(id) {
        this.buscarPorId(id)?.alternarEstado();
        this.persistir();
        this.refrescar();
    }
    editar(id) {
        const tarea = this.buscarPorId(id);
        if (!tarea)
            return;
        this.editandoId = id;
        this.vista.mostrarError("");
        this.vista.cargarFormulario(tarea);
    }
    cancelarEdicion() {
        this.editandoId = null;
        this.vista.limpiarFormulario();
        this.vista.mostrarError("");
    }
    eliminar(id) {
        if (!confirm("¿Eliminar esta tarea?"))
            return;
        this.tareas = this.tareas.filter((t) => t.id !== id);
        if (this.editandoId === id)
            this.cancelarEdicion();
        this.persistir();
        this.refrescar();
    }
    buscarPorId(id) {
        return this.tareas.find((t) => t.id === id);
    }
    persistir() {
        this.storage.guardar(this.tareas.map((t) => t.toJSON()));
    }
    refrescar() {
        const visibles = this.tareas.filter((t) => t.coincideCon(this.busqueda));
        this.vista.render(visibles, this.tareas.length, this.busqueda);
    }
}
