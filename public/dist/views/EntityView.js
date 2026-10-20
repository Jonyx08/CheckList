export class TareaView {
    constructor() {
        // Contenedores principales y vistas
        this.vistaTareas = this.obtener("#vista-tareas");
        this.vistaEstadisticas = this.obtener("#vista-estadisticas");
        this.pestanasNav = this.obtener(".pestanas-nav");
        this.toastContainer = this.obtener("#toast-container");
        // Formulario y campos
        this.form = this.obtener("#form-tarea");
        this.formTitulo = this.obtener("#form-titulo");
        this.inputId = this.obtener("#tarea-id");
        this.inputTitulo = this.obtener("#titulo");
        this.inputDescripcion = this.obtener("#descripcion");
        this.selectPrioridad = this.obtener("#prioridad");
        this.inputFechaLimite = this.obtener("#fecha-limite");
        this.selectCategoria = this.obtener("#categoria");
        this.btnGuardar = this.obtener("#btn-guardar");
        this.btnCancelar = this.obtener("#btn-cancelar");
        // Elementos de error
        this.errorBanner = this.obtener("#error");
        this.errorTitulo = this.obtener("#error-titulo");
        this.errorDescripcion = this.obtener("#error-descripcion");
        this.errorFecha = this.obtener("#error-fecha");
        // Filtros, búsqueda y orden
        this.inputBuscar = this.obtener("#buscar");
        this.selectFiltroPrioridad = this.obtener("#filtro-prioridad");
        this.selectFiltroCategoria = this.obtener("#filtro-categoria");
        this.selectOrden = this.obtener("#orden");
        this.btnLimpiarFiltros = this.obtener("#btn-limpiar-filtros");
        // Lista y contadores
        this.lista = this.obtener("#lista");
        this.contador = this.obtener("#contador");
        this.statTotal = this.obtener("#stat-total");
        this.statPendientes = this.obtener("#stat-pendientes");
        this.statCompletadas = this.obtener("#stat-completadas");
        this.statVencidas = this.obtener("#stat-vencidas");
        this.progresoTexto = this.obtener("#progreso-texto");
        this.progresoRelleno = this.obtener("#progreso-barra-relleno");
        this.statsContenedor = this.obtener("#stats-contenedor");
        // Modal de confirmación
        this.modalConfirmacion = this.obtener("#modal-confirmacion");
        this.modalMensaje = this.obtener("#modal-mensaje");
        this.modalBtnCancelar = this.obtener("#modal-btn-cancelar");
        this.modalBtnEliminar = this.obtener("#modal-btn-eliminar");
        this.resolverModalEliminar = null;
        this.configurarModalConfirmacion();
    }
    obtener(selector) {
        const el = document.querySelector(selector);
        if (!el) {
            throw new Error(`[TareaView] No se encontró el elemento con selector "${selector}".`);
        }
        return el;
    }
    // -------------------------------------------------------------
    // Configuración de eventos de la vista hacia el controlador
    // -------------------------------------------------------------
    onGuardar(cb) {
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            cb({
                id: this.inputId.value.trim() || undefined,
                titulo: this.inputTitulo.value,
                descripcion: this.inputDescripcion.value,
                fechaLimite: this.inputFechaLimite.value,
                prioridad: this.selectPrioridad.value,
                categoriaId: this.selectCategoria.value,
            });
        });
    }
    onCancelar(cb) {
        this.btnCancelar.addEventListener("click", cb);
    }
    onBuscar(cb) {
        this.inputBuscar.addEventListener("input", () => {
            cb(this.inputBuscar.value);
        });
    }
    onFiltrarPrioridad(cb) {
        this.selectFiltroPrioridad.addEventListener("change", () => {
            cb(this.selectFiltroPrioridad.value);
        });
    }
    onFiltrarCategoria(cb) {
        this.selectFiltroCategoria.addEventListener("change", () => {
            cb(this.selectFiltroCategoria.value);
        });
    }
    onOrdenar(cb) {
        this.selectOrden.addEventListener("change", () => {
            cb(this.selectOrden.value);
        });
    }
    onLimpiarFiltros(cb) {
        this.btnLimpiarFiltros.addEventListener("click", () => {
            this.inputBuscar.value = "";
            this.selectFiltroPrioridad.value = "todas";
            this.selectFiltroCategoria.value = "todas";
            this.selectOrden.value = "creacion-desc";
            cb();
        });
    }
    onCambiarTab(cb) {
        this.pestanasNav.addEventListener("click", (e) => {
            const boton = e.target.closest(".pestana-btn");
            if (!boton || !boton.dataset.tab)
                return;
            cb(boton.dataset.tab);
        });
    }
    onAccion(cb) {
        this.lista.addEventListener("click", (e) => {
            const boton = e.target.closest("[data-accion]");
            const tarjeta = e.target.closest("[data-id]");
            if (!boton || !tarjeta || !tarjeta.dataset.id)
                return;
            cb(boton.dataset.accion, tarjeta.dataset.id);
        });
    }
    // -------------------------------------------------------------
    // Renderizado general y componentes solicitados
    // -------------------------------------------------------------
    /**
     * Renderiza el estado actual de las tareas y la interfaz.
     */
    render(tareas, stats, filtros, criterioOrden, categorias) {
        this.renderCategorias(categorias);
        this.renderResumenHeader(stats);
        this.renderCounter(tareas.length, stats.total, stats.pendientes, stats.vencidas);
        this.actualizarControlesFiltros(filtros, criterioOrden);
        this.lista.replaceChildren();
        if (tareas.length === 0) {
            const vacio = document.createElement("div");
            vacio.className = "tarjeta-vacia";
            const esFiltroActivo = filtros.busqueda.trim() !== "" ||
                filtros.prioridad !== "todas" ||
                filtros.categoriaId !== "todas" ||
                filtros.estado !== "todas";
            vacio.innerHTML = `
        <div class="icono-vacio">📂</div>
        <h3>No se encontraron tareas</h3>
        <p>${esFiltroActivo
                ? "No hay elementos que coincidan con los filtros o la búsqueda aplicados."
                : "No tienes ninguna tarea registrada aún. ¡Comienza agregando una arriba!"}</p>
      `;
            this.lista.append(vacio);
            return;
        }
        for (const t of tareas) {
            const cat = categorias.find((c) => c.id === t.categoriaId);
            this.lista.append(this.crearTarjetaTarea(t, cat));
        }
    }
    /**
     * Renderiza el contador de tareas solicitados en RF-09 y cambios en TareaView.
     */
    renderCounter(visibles, total, pendientes, vencidas) {
        const textoVencidas = vencidas > 0 ? ` · <span class="alerta-roja">${vencidas} vencida(s)</span>` : "";
        this.contador.innerHTML = `Mostrando <strong>${visibles}</strong> de <strong>${total}</strong> tareas · <strong>${pendientes}</strong> pendientes${textoVencidas}`;
    }
    /**
     * Renderiza el formulario en modo edición (Requerimiento explícito: renderEditForm).
     */
    renderEditForm(tarea) {
        this.formTitulo.textContent = `Editar Tarea: "${tarea.titulo}"`;
        this.inputId.value = tarea.id;
        this.inputTitulo.value = tarea.titulo;
        this.inputDescripcion.value = tarea.descripcion;
        this.selectPrioridad.value = tarea.prioridad;
        this.inputFechaLimite.value = tarea.fechaLimite;
        this.selectCategoria.value = tarea.categoriaId;
        this.btnGuardar.textContent = "💾 Guardar cambios";
        this.btnCancelar.hidden = false;
        this.limpiarErrores();
        this.inputTitulo.focus();
        // Desplazamiento suave al formulario
        this.form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    /**
     * Renderiza el panel de estadísticas y gráficos resumidos.
     */
    renderEstadisticas(stats, tareas, categorias) {
        this.statsContenedor.replaceChildren();
        const grid = document.createElement("div");
        grid.className = "metricas-grid";
        // Tarjetas resumen
        grid.innerHTML = `
      <div class="metrica-bloque">
        <h3>Efectividad Global</h3>
        <div class="metrica-valor-grande">${stats.porcentajeCompletadas}%</div>
        <p class="metrica-sub">${stats.completadas} completadas de ${stats.total} totales</p>
      </div>

      <div class="metrica-bloque">
        <h3>Estado de Cumplimiento</h3>
        <div class="barra-estadistica">
          <div class="barra-seg barra-verde" style="width: ${stats.porcentajeCompletadas}%" title="Completadas: ${stats.completadas}"></div>
          <div class="barra-seg barra-amarilla" style="width: ${stats.total > 0 ? Math.round(((stats.pendientes - stats.vencidas) / stats.total) * 100) : 0}%" title="Pendientes en tiempo"></div>
          <div class="barra-seg barra-roja" style="width: ${stats.total > 0 ? Math.round((stats.vencidas / stats.total) * 100) : 0}%" title="Vencidas: ${stats.vencidas}"></div>
        </div>
        <div class="leyenda-stats">
          <span><i class="dot dot-verde"></i> Completadas (${stats.completadas})</span>
          <span><i class="dot dot-amarillo"></i> En curso (${Math.max(0, stats.pendientes - stats.vencidas)})</span>
          <span><i class="dot dot-rojo"></i> Vencidas (${stats.vencidas})</span>
        </div>
      </div>
    `;
        // Desglose por prioridad
        const desglosePrioridad = document.createElement("div");
        desglosePrioridad.className = "metrica-bloque";
        const alta = tareas.filter((t) => t.prioridad === "alta").length;
        const media = tareas.filter((t) => t.prioridad === "media").length;
        const baja = tareas.filter((t) => t.prioridad === "baja").length;
        desglosePrioridad.innerHTML = `
      <h3>Distribución por Prioridad</h3>
      <ul class="lista-metricas-detallada">
        <li>
          <span>🔴 Alta</span>
          <strong>${alta}</strong>
        </li>
        <li>
          <span>🟡 Media</span>
          <strong>${media}</strong>
        </li>
        <li>
          <span>🟢 Baja</span>
          <strong>${baja}</strong>
        </li>
      </ul>
    `;
        grid.append(desglosePrioridad);
        // Desglose por categoría relacionada
        const desgloseCat = document.createElement("div");
        desgloseCat.className = "metrica-bloque";
        let htmlCat = `<h3>Distribución por Categoría</h3><ul class="lista-metricas-detallada">`;
        for (const cat of categorias) {
            const cant = tareas.filter((t) => t.categoriaId === cat.id).length;
            htmlCat += `
        <li>
          <span>${cat.icono} ${cat.nombre}</span>
          <strong>${cant}</strong>
        </li>
      `;
        }
        htmlCat += `</ul>`;
        desgloseCat.innerHTML = htmlCat;
        grid.append(desgloseCat);
        this.statsContenedor.append(grid);
    }
    // -------------------------------------------------------------
    // Componentes individuales (Tarjetas, Fechas, Badges)
    // -------------------------------------------------------------
    crearTarjetaTarea(t, cat) {
        const tarjeta = document.createElement("article");
        const estaVencida = t.estaVencida();
        // Reto adicional: Marcar tareas vencidas automáticamente con color rojo
        tarjeta.className = "tarjeta-tarea" +
            (t.completada ? " completada" : "") +
            (estaVencida ? " vencida" : "");
        tarjeta.dataset.id = t.id;
        // Encabezado de la tarjeta con categoría y prioridad
        const cabecera = document.createElement("div");
        cabecera.className = "tarjeta-cabecera";
        const badgeCat = document.createElement("span");
        badgeCat.className = "badge-categoria";
        if (cat) {
            badgeCat.style.borderColor = cat.color;
            badgeCat.innerHTML = `${cat.icono} ${cat.nombre}`;
        }
        else {
            badgeCat.textContent = "📌 General";
        }
        const badgePrioridad = document.createElement("span");
        badgePrioridad.className = `badge-prioridad prioridad-${t.prioridad}`;
        const iconosPrioridad = {
            alta: "🔴 Prioridad Alta",
            media: "🟡 Prioridad Media",
            baja: "🟢 Prioridad Baja",
        };
        badgePrioridad.textContent = iconosPrioridad[t.prioridad];
        cabecera.append(badgeCat, badgePrioridad);
        // Cuerpo de la tarjeta
        const cuerpo = document.createElement("div");
        cuerpo.className = "tarjeta-cuerpo";
        const checkWrap = document.createElement("label");
        checkWrap.className = "check-contenedor";
        checkWrap.title = t.completada ? "Marcar como pendiente" : "Marcar como completada";
        const checkInput = document.createElement("input");
        checkInput.type = "checkbox";
        checkInput.checked = t.completada;
        checkInput.dataset.accion = "alternar";
        checkInput.setAttribute("aria-label", `Alternar estado de tarea: ${t.titulo}`);
        const checkCustom = document.createElement("span");
        checkCustom.className = "check-custom";
        checkWrap.append(checkInput, checkCustom);
        const infoTexto = document.createElement("div");
        infoTexto.className = "tarjeta-info";
        const titulo = document.createElement("h3");
        titulo.className = "tarjeta-titulo";
        titulo.textContent = t.titulo;
        infoTexto.append(titulo);
        if (t.descripcion) {
            const descripcion = document.createElement("p");
            descripcion.className = "tarjeta-descripcion";
            descripcion.textContent = t.descripcion;
            infoTexto.append(descripcion);
        }
        cuerpo.append(checkWrap, infoTexto);
        // Pie de la tarjeta con fecha límite y acciones
        const pie = document.createElement("div");
        pie.className = "tarjeta-pie";
        const infoFechas = document.createElement("div");
        infoFechas.className = "info-fechas";
        if (t.fechaLimite) {
            const badgeFecha = document.createElement("span");
            const dias = t.diasRestantes();
            if (estaVencida) {
                badgeFecha.className = "badge-fecha fecha-vencida";
                const diasAbs = Math.abs(dias ?? 0);
                badgeFecha.innerHTML = `⚠️ Venció hace ${diasAbs === 0 ? "hoy" : `${diasAbs} día(s)`} (${t.fechaLimite})`;
            }
            else if (dias === 0) {
                badgeFecha.className = "badge-fecha fecha-hoy";
                badgeFecha.innerHTML = `⏰ ¡Vence hoy! (${t.fechaLimite})`;
            }
            else if (dias !== null && dias > 0 && dias <= 3) {
                badgeFecha.className = "badge-fecha fecha-proxima";
                badgeFecha.innerHTML = `⏳ Vence en ${dias} día(s) (${t.fechaLimite})`;
            }
            else {
                badgeFecha.className = "badge-fecha";
                badgeFecha.innerHTML = `📅 Fecha límite: ${t.fechaLimite}`;
            }
            infoFechas.append(badgeFecha);
        }
        const acciones = document.createElement("div");
        acciones.className = "tarjeta-acciones";
        const btnAlternar = document.createElement("button");
        btnAlternar.type = "button";
        btnAlternar.className = "btn btn-sm " + (t.completada ? "btn-secundario" : "btn-exito");
        btnAlternar.dataset.accion = "alternar";
        btnAlternar.innerHTML = t.completada ? "↩ Reabrir" : "✓ Completar";
        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn btn-sm btn-outline";
        btnEditar.dataset.accion = "editar";
        btnEditar.innerHTML = "✏ Editar";
        const btnEliminar = document.createElement("button");
        btnEliminar.type = "button";
        btnEliminar.className = "btn btn-sm btn-peligro";
        btnEliminar.dataset.accion = "eliminar";
        btnEliminar.innerHTML = "🗑 Eliminar";
        acciones.append(btnAlternar, btnEditar, btnEliminar);
        pie.append(infoFechas, acciones);
        tarjeta.append(cabecera, cuerpo, pie);
        return tarjeta;
    }
    renderResumenHeader(stats) {
        this.statTotal.textContent = String(stats.total);
        this.statPendientes.textContent = String(stats.pendientes);
        this.statCompletadas.textContent = String(stats.completadas);
        this.statVencidas.textContent = String(stats.vencidas);
        this.progresoTexto.textContent = `${stats.porcentajeCompletadas}% completado`;
        this.progresoRelleno.style.width = `${stats.porcentajeCompletadas}%`;
    }
    renderCategorias(categorias) {
        // Solo repoblar si no tienen opciones cargadas
        if (this.selectCategoria.children.length === 0) {
            for (const cat of categorias) {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = `${cat.icono} ${cat.nombre}`;
                this.selectCategoria.append(opt);
            }
        }
        if (this.selectFiltroCategoria.children.length <= 1) {
            for (const cat of categorias) {
                const opt = document.createElement("option");
                opt.value = cat.id;
                opt.textContent = `${cat.icono} ${cat.nombre}`;
                this.selectFiltroCategoria.append(opt);
            }
        }
    }
    actualizarControlesFiltros(filtros, criterioOrden) {
        if (this.selectFiltroPrioridad.value !== filtros.prioridad) {
            this.selectFiltroPrioridad.value = filtros.prioridad;
        }
        if (this.selectFiltroCategoria.value !== filtros.categoriaId) {
            this.selectFiltroCategoria.value = filtros.categoriaId;
        }
        if (this.selectOrden.value !== criterioOrden) {
            this.selectOrden.value = criterioOrden;
        }
        if (this.inputBuscar.value !== filtros.busqueda) {
            this.inputBuscar.value = filtros.busqueda;
        }
    }
    // -------------------------------------------------------------
    // Gestión de pestañas y vistas
    // -------------------------------------------------------------
    activarPestana(tabSeleccionado) {
        const botones = this.pestanasNav.querySelectorAll(".pestana-btn");
        for (const b of botones) {
            const activo = b.dataset.tab === tabSeleccionado;
            b.classList.toggle("activa", activo);
            b.setAttribute("aria-selected", activo ? "true" : "false");
        }
        if (tabSeleccionado === "estadisticas") {
            this.vistaTareas.hidden = true;
            this.vistaEstadisticas.hidden = false;
        }
        else {
            this.vistaTareas.hidden = false;
            this.vistaEstadisticas.hidden = true;
        }
    }
    // -------------------------------------------------------------
    // Limpieza y manejo de formularios
    // -------------------------------------------------------------
    limpiarFormulario() {
        this.form.reset();
        this.inputId.value = "";
        this.formTitulo.textContent = "Nueva Tarea";
        this.btnGuardar.textContent = "➕ Agregar tarea";
        this.btnCancelar.hidden = true;
        this.limpiarErrores();
    }
    mostrarError(mensaje) {
        if (!mensaje) {
            this.errorBanner.hidden = true;
            this.errorBanner.textContent = "";
            return;
        }
        this.errorBanner.textContent = mensaje;
        this.errorBanner.hidden = false;
    }
    mostrarErrorCampo(campo, mensaje) {
        if (campo === "titulo")
            this.errorTitulo.textContent = mensaje;
        if (campo === "descripcion")
            this.errorDescripcion.textContent = mensaje;
        if (campo === "fecha")
            this.errorFecha.textContent = mensaje;
    }
    limpiarErrores() {
        this.mostrarError("");
        this.errorTitulo.textContent = "";
        this.errorDescripcion.textContent = "";
        this.errorFecha.textContent = "";
    }
    // -------------------------------------------------------------
    // Notificaciones flotantes (Toast con auto-cierre)
    // -------------------------------------------------------------
    mostrarNotificacion(mensaje, tipo = "info", duracionMs = 3500) {
        const toast = document.createElement("div");
        toast.className = `toast toast-${tipo}`;
        const iconos = {
            exito: "✅",
            error: "❌",
            advertencia: "⚠️",
            info: "ℹ️",
        };
        const iconoSpan = document.createElement("span");
        iconoSpan.className = "toast-icono";
        iconoSpan.textContent = iconos[tipo] ?? "ℹ️";
        const textoSpan = document.createElement("span");
        textoSpan.className = "toast-mensaje";
        textoSpan.textContent = mensaje;
        const btnCerrar = document.createElement("button");
        btnCerrar.type = "button";
        btnCerrar.className = "toast-cerrar";
        btnCerrar.setAttribute("aria-label", "Cerrar notificación");
        btnCerrar.textContent = "×";
        const barraProgreso = document.createElement("div");
        barraProgreso.className = "toast-progreso";
        barraProgreso.style.animationDuration = `${duracionMs}ms`;
        toast.append(iconoSpan, textoSpan, btnCerrar, barraProgreso);
        this.toastContainer.append(toast);
        let tiempoRestante = duracionMs;
        const inicio = Date.now();
        let timer = window.setTimeout(() => cerrar(), tiempoRestante);
        const cerrar = () => {
            window.clearTimeout(timer);
            toast.classList.add("desaparecer");
            toast.addEventListener("animationend", () => {
                toast.remove();
            });
        };
        btnCerrar.addEventListener("click", () => cerrar());
        // Pausar auto-cierre si el usuario pasa el mouse por encima
        toast.addEventListener("mouseenter", () => {
            window.clearTimeout(timer);
            tiempoRestante -= Date.now() - inicio;
            barraProgreso.style.animationPlayState = "paused";
        });
        toast.addEventListener("mouseleave", () => {
            barraProgreso.style.animationPlayState = "running";
            timer = window.setTimeout(() => cerrar(), Math.max(500, tiempoRestante));
        });
    }
    // -------------------------------------------------------------
    // Modal de confirmación para eliminar
    // -------------------------------------------------------------
    configurarModalConfirmacion() {
        this.cerrarModalConfirmacion(false);
        this.modalBtnCancelar.addEventListener("click", () => {
            this.cerrarModalConfirmacion(false);
        });
        this.modalBtnEliminar.addEventListener("click", () => {
            this.cerrarModalConfirmacion(true);
        });
        this.modalConfirmacion.addEventListener("click", (e) => {
            if (e.target === this.modalConfirmacion) {
                this.cerrarModalConfirmacion(false);
            }
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !this.modalConfirmacion.hidden) {
                this.cerrarModalConfirmacion(false);
            }
        });
    }
    confirmarEliminacion(tarea) {
        return new Promise((resolve) => {
            this.resolverModalEliminar = resolve;
            this.modalMensaje.textContent = `¿Estás seguro de que deseas eliminar permanentemente la tarea "${tarea.titulo}"? Esta acción no se puede revertir.`;
            this.modalConfirmacion.hidden = false;
            this.modalConfirmacion.classList.remove("oculto");
            this.modalConfirmacion.style.display = "flex";
            this.modalBtnCancelar.focus();
        });
    }
    cerrarModalConfirmacion(confirmado) {
        this.modalConfirmacion.hidden = true;
        this.modalConfirmacion.classList.add("oculto");
        this.modalConfirmacion.style.display = "none";
        if (this.resolverModalEliminar) {
            this.resolverModalEliminar(confirmado);
            this.resolverModalEliminar = null;
        }
    }
}
