# Registro Detallado de Archivos y Líneas Editadas
## Parcial 2: Gestor Avanzado de Tareas (TypeScript + MVC)

Este documento contiene el desglose técnico exacto de los archivos, clases, métodos y líneas de código modificadas o creadas para la entrega del Parcial 2, a partir del proyecto base del Laboratorio #2.

---

### 1. `src/models/Entity.ts` (Capa de Modelo y Entidades)
* **Líneas 6-24:** Definición de tipos de unión y enums de TypeScript:
  - `Prioridad = "alta" | "media" | "baja"`
  - `EstadoFiltro = "todas" | "pendientes" | "completadas" | "vencidas"`
  - `CriterioOrden` con opciones de fecha, prioridad y creación.
* **Líneas 26-65:** Creación de la **segunda entidad relacionada** `Categoria` y su interfaz `CategoriaDTO` (id, nombre, color, icono).
* **Líneas 70-80:** Extensión de `TareaDTO` para incluir `fechaLimite`, `prioridad` y `categoriaId`.
* **Líneas 84-101:** Interfaces `FiltrosTarea` (para filtrado multi-criterio) y `EstadisticasTareas`.
* **Líneas 106-260 (Clase de Dominio `Tarea`):**
  - **Líneas 114-140:** Constructor extendido con `fechaLimite`, `prioridad` y `categoriaId`.
  - **Líneas 145-151 (`obtenerFechaHoy()`):** Función auxiliar estática que calcula la fecha actual en formato local `YYYY-MM-DD`.
  - **Líneas 156-174 (`validarTitulo()`):** Validación de rango (3-60 caracteres) y **control de duplicados** insensible a mayúsculas/minúsculas.
  - **Líneas 189-204 (`validarFechaLimite()`):** Expresión regular `^\d{4}-\d{2}-\d{2}$` y verificación de fechas reales en el calendario.
  - **Líneas 209-216 (`estaVencida()`):** **Reto adicional** que comprueba si la tarea está pendiente y su fecha límite es anterior a hoy.
  - **Líneas 221-228 (`diasRestantes()`):** Cálculo de días faltantes o de atraso.
  - **Líneas 230-244 (`actualizar()`):** Actualización atómica con revalidación completa.
* **Líneas 264-466 (Clase `TareaModel` - Requerimientos de la Rúbrica):**
  - **Líneas 315-328 (`addTarea()`):** Alta de tareas con validación previa de duplicados.
  - **Líneas 330-352 (`updateTarea()`):** Método requerido explícitamente para actualizar registros.
  - **Líneas 354-362 (`deleteTarea()`):** Método requerido explícitamente para eliminar registros.
  - **Líneas 374-380 (`searchTareas()`):** Método requerido explícitamente para búsqueda textual.
  - **Líneas 382-414 (`filterTareas()`):** Método requerido explícitamente para filtrado acumulativo (estado, prioridad, categoría, texto).
  - **Líneas 416-452 (`sortTareas()`):** Algoritmo de ordenación multi-variable.
  - **Líneas 454-465 (`getEstadisticas()`):** Métricas globales de cumplimiento y conteos.

---

### 2. `src/views/EntityView.ts` (Capa de Vista y Manejo de UI)
* **Líneas 13-19:** Definición del contrato `FormularioTareaPayload`.
* **Líneas 21-65:** Enlace y caché de elementos del DOM (pestañas, selectores de prioridad/categoría, input date, contenedores toast y modal).
* **Líneas 70-135:** Callbacks de eventos hacia el controlador (`onFiltrarPrioridad`, `onFiltrarCategoria`, `onOrdenar`, `onLimpiarFiltros`, `onCambiarTab`).
* **Líneas 140-167 (`render()`):** Renderizado reactivo que dibuja tarjetas con badges cromáticos, estados y categorías.
* **Líneas 169-175 (`renderCounter()`):** Método requerido explícitamente para mostrar contadores dinámicos de tareas totales, pendientes y vencidas.
* **Líneas 177-194 (`renderEditForm()`):** Método requerido explícitamente para cargar datos en el formulario y conmutar a modo edición con enfoque automático.
* **Líneas 196-265 (`renderEstadisticas()`):** Panel analítico con barras de progreso segmentadas y desgloses por categoría y prioridad.
* **Líneas 270-365 (`crearTarjetaTarea()`):** Construcción de tarjetas aplicando clase `.vencida` (borde rojo y badge de alerta), badge de prioridad y botones de acción.
* **Líneas 380-396 (`activarPestana()`):** Gestión de navegación por múltiples vistas/pestañas.
* **Líneas 425-483 (`mostrarNotificacion()`):** Sistema de notificaciones Toast flotantes con auto-cierre cronometrado (3.5s) y pausa en hover.
* **Líneas 485-520 (`confirmarEliminacion()`):** Diálogo modal accesible que retorna una promesa (`Promise<boolean>`).

---

### 3. `src/controllers/EntityController.ts` (Capa de Controlador)
* **Líneas 11-20:** Estado reactivo con filtros activos (`FiltrosTarea`), criterio de orden y control del ID en edición.
* **Líneas 52-84 (`handleUpdate()`):** Método requerido explícitamente que valida y guarda las modificaciones de una tarea.
* **Líneas 86-107 (`handleDelete()`):** Método requerido explícitamente que solicita confirmación modal interactiva antes de eliminar y notifica vía Toast.
* **Líneas 109-114 (`handleSearch()`):** Método requerido explícitamente para canalizar la búsqueda en vivo.
* **Líneas 116-146 (`handleGuardar()`):** Orquestador inteligente que decide entre creación o edición, con validaciones defensivas.
* **Líneas 172-195:** Manejadores de eventos de filtrado y orden (`handleFiltrarPrioridad`, `handleFiltrarCategoria`, `handleOrdenar`, `handleLimpiarFiltros`).
* **Líneas 197-215 (`handleTabChange()`):** Alternancia entre vistas de tareas y panel de métricas.
* **Líneas 217-236 (`refrescar()`):** Pipeline unificado que filtra, ordena y renderiza de forma consistente.

---

### 4. `src/services/StorageService.ts` (Persistencia Genérica)
* **Líneas 4-45:** Implementación genérica `StorageService<T>` con manejo de excepciones (`try...catch`), tolerancia a datos corruptos y métodos `cargar()`, `guardar()` y `limpiar()`.

---

### 5. `src/main.ts` (Punto de Entrada de la Aplicación)
* **Líneas 1-16:** Instanciación separada de `StorageService` para tareas y categorías, inyección de dependencias en `TareaModel`, `TareaView` y `TareaController`, y arranque con `controlador.iniciar()`.

---

### 6. `index.html` (Estructura Semántica HTML5)
* **Líneas 11-12:** Contenedor accesible `#toast-container` para alertas flotantes.
* **Líneas 14-25:** Estructura del modal interactivo de confirmación `#modal-confirmacion`.
* **Líneas 33-58:** Tarjetas KPI de resumen ejecutivo (Total, Pendientes, Completadas, Vencidas) y barra de progreso.
* **Líneas 61-77:** Navegación por pestañas/vistas (`.pestanas-nav`).
* **Líneas 85-150:** Formulario extendido con campos de prioridad, fecha límite y categoría.
* **Líneas 153-200:** Barra de herramientas combinada con buscador en tiempo real, selectores de filtro y selector de orden.
* **Líneas 207-220:** Panel de la segunda vista dedicada a estadísticas y análisis (`#vista-estadisticas`).

---

### 7. `src/style/style.css` (Diseño, Animaciones y Responsividad)
* **Líneas 6-36:** Paleta de variables CSS semánticas para estados (éxito, advertencia, peligro, bordes, sombras).
* **Líneas 88-124:** Estilos de barras de progreso y tarjetas KPI.
* **Líneas 126-160:** Estilos de navegación por pestañas con indicador activo.
* **Líneas 300-340:** **Regla `.tarjeta-tarea.vencida`** con borde izquierdo rojo `#ef4444`, fondo tenue `#fffbfb` y distintivo de vencimiento (**Reto Adicional**).
* **Líneas 350-380:** Badges cromáticos para prioridades alta, media y baja.
* **Líneas 470-550:** Estilos de notificaciones Toast flotantes, animaciones `@keyframes slideInRight`, barra regresiva y modal con `backdrop-filter: blur(4px)`.

---

### 8. `package.json`
* **Líneas 4-9:** Se añadió `"type": "module"` y el script `"start": "npx serve ."` para permitir la ejecución directa con `npm start`.
