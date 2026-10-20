import { Tarea, } from "../models/Entity.js";
export class TareaController {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
        this.pestanaActiva = "todas";
        this.filtros = {
            estado: "todas",
            prioridad: "todas",
            categoriaId: "todas",
            busqueda: "",
        };
        this.criterioOrden = "creacion-desc";
        this.idEnEdicion = null;
    }
    iniciar() {
        // Configuración de listeners desde la vista
        this.vista.onGuardar((datos) => this.handleGuardar(datos));
        this.vista.onCancelar(() => this.cancelarEdicion());
        this.vista.onBuscar((texto) => this.handleSearch(texto));
        this.vista.onFiltrarPrioridad((prioridad) => this.handleFiltrarPrioridad(prioridad));
        this.vista.onFiltrarCategoria((categoriaId) => this.handleFiltrarCategoria(categoriaId));
        this.vista.onOrdenar((criterio) => this.handleOrdenar(criterio));
        this.vista.onLimpiarFiltros(() => this.handleLimpiarFiltros());
        this.vista.onCambiarTab((tab) => this.handleTabChange(tab));
        this.vista.onAccion((accion, id) => {
            if (accion === "alternar")
                this.handleToggle(id);
            if (accion === "editar")
                this.handleEdit(id);
            if (accion === "eliminar")
                void this.handleDelete(id);
        });
        this.refrescar();
    }
    // -------------------------------------------------------------
    // Métodos requeridos explícitamente en el Parcial 2 (Imagen 3)
    // -------------------------------------------------------------
    /**
     * Actualiza los datos de una tarea existente (Requerimiento explícito: handleUpdate).
     */
    handleUpdate(id, datos) {
        try {
            this.vista.limpiarErrores();
            // Validaciones avanzadas antes de invocar al modelo
            const tareasActuales = this.modelo.getTareas();
            Tarea.validarTitulo(datos.titulo, tareasActuales, id);
            Tarea.validarDescripcion(datos.descripcion);
            Tarea.validarFechaLimite(datos.fechaLimite);
            Tarea.validarPrioridad(datos.prioridad);
            const actualizada = this.modelo.updateTarea(id, {
                titulo: datos.titulo,
                descripcion: datos.descripcion,
                fechaLimite: datos.fechaLimite,
                prioridad: datos.prioridad,
                categoriaId: datos.categoriaId,
            });
            this.idEnEdicion = null;
            this.vista.limpiarFormulario();
            this.vista.mostrarNotificacion(`Tarea "${actualizada.titulo}" actualizada correctamente.`, "exito");
            this.refrescar();
        }
        catch (e) {
            const mensaje = e instanceof Error ? e.message : "Error al actualizar la tarea.";
            this.vista.mostrarError(mensaje);
            this.vista.mostrarNotificacion(mensaje, "error");
        }
    }
    /**
     * Elimina una tarea solicitando confirmación previa (Requerimiento explícito: handleDelete).
     */
    async handleDelete(id) {
        const tarea = this.modelo.getTareaPorId(id);
        if (!tarea) {
            this.vista.mostrarNotificacion("La tarea ya no existe.", "advertencia");
            return;
        }
        const confirmado = await this.vista.confirmarEliminacion(tarea);
        if (!confirmado)
            return;
        const eliminada = this.modelo.deleteTarea(id);
        if (eliminada) {
            if (this.idEnEdicion === id) {
                this.cancelarEdicion();
            }
            this.vista.mostrarNotificacion(`Tarea "${tarea.titulo}" eliminada.`, "info");
            this.refrescar();
        }
        else {
            this.vista.mostrarNotificacion("No se pudo eliminar la tarea solicitada.", "error");
        }
    }
    /**
     * Maneja la búsqueda en tiempo real (Requerimiento explícito: handleSearch).
     */
    handleSearch(texto) {
        this.filtros.busqueda = texto;
        this.refrescar();
    }
    // -------------------------------------------------------------
    // Flujo CRUD complementario y lógica de negocio
    // -------------------------------------------------------------
    handleGuardar(datos) {
        if (datos.id) {
            this.handleUpdate(datos.id, datos);
            return;
        }
        try {
            this.vista.limpiarErrores();
            // Validaciones previas de formato y duplicados
            const tareasActuales = this.modelo.getTareas();
            Tarea.validarTitulo(datos.titulo, tareasActuales);
            Tarea.validarDescripcion(datos.descripcion);
            Tarea.validarFechaLimite(datos.fechaLimite);
            Tarea.validarPrioridad(datos.prioridad);
            const nueva = this.modelo.addTarea(datos.titulo, datos.descripcion, datos.fechaLimite, datos.prioridad, datos.categoriaId);
            this.vista.limpiarFormulario();
            this.vista.mostrarNotificacion(`Tarea "${nueva.titulo}" creada exitosamente.`, "exito");
            this.refrescar();
        }
        catch (e) {
            const mensaje = e instanceof Error ? e.message : "Error al registrar la tarea.";
            this.vista.mostrarError(mensaje);
            this.vista.mostrarNotificacion(mensaje, "error");
        }
    }
    handleToggle(id) {
        try {
            const tarea = this.modelo.toggleTarea(id);
            const estado = tarea.completada ? "completada" : "marcada como pendiente";
            this.vista.mostrarNotificacion(`Tarea "${tarea.titulo}" ${estado}.`, "info");
            this.refrescar();
        }
        catch (e) {
            const mensaje = e instanceof Error ? e.message : "Error al cambiar el estado.";
            this.vista.mostrarNotificacion(mensaje, "error");
        }
    }
    handleEdit(id) {
        const tarea = this.modelo.getTareaPorId(id);
        if (!tarea) {
            this.vista.mostrarNotificacion("La tarea a editar no fue encontrada.", "advertencia");
            return;
        }
        this.idEnEdicion = id;
        this.vista.renderEditForm(tarea);
    }
    cancelarEdicion() {
        this.idEnEdicion = null;
        this.vista.limpiarFormulario();
        this.vista.mostrarNotificacion("Edición cancelada.", "info");
    }
    handleFiltrarPrioridad(prioridad) {
        this.filtros.prioridad = prioridad;
        this.refrescar();
    }
    handleFiltrarCategoria(categoriaId) {
        this.filtros.categoriaId = categoriaId;
        this.refrescar();
    }
    handleOrdenar(criterio) {
        this.criterioOrden = criterio;
        this.refrescar();
    }
    handleLimpiarFiltros() {
        this.filtros = {
            estado: this.pestanaActiva === "estadisticas" ? "todas" : this.pestanaActiva,
            prioridad: "todas",
            categoriaId: "todas",
            busqueda: "",
        };
        this.criterioOrden = "creacion-desc";
        this.refrescar();
        this.vista.mostrarNotificacion("Filtros restablecidos.", "info");
    }
    handleTabChange(tab) {
        this.pestanaActiva = tab;
        this.vista.activarPestana(tab);
        if (tab === "estadisticas") {
            this.vista.renderEstadisticas(this.modelo.getEstadisticas(), this.modelo.getTareas(), this.modelo.getCategorias());
            return;
        }
        if (tab === "todas" || tab === "pendientes" || tab === "completadas" || tab === "vencidas") {
            this.filtros.estado = tab;
        }
        this.refrescar();
    }
    /**
     * Refresca la vista aplicando filtros combinados, ordenamiento y cálculo de métricas.
     */
    refrescar() {
        const tareasFiltradas = this.modelo.filterTareas(this.filtros);
        const tareasOrdenadas = this.modelo.sortTareas(this.criterioOrden, tareasFiltradas);
        const estadisticas = this.modelo.getEstadisticas();
        const categorias = this.modelo.getCategorias();
        this.vista.render(tareasOrdenadas, estadisticas, this.filtros, this.criterioOrden, categorias);
        if (this.pestanaActiva === "estadisticas") {
            this.vista.renderEstadisticas(estadisticas, this.modelo.getTareas(), categorias);
        }
    }
}
