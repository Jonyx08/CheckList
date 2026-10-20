# Gestor de Tareas MVC - Parcial 2

> 🌐 **Demo en vivo desplegada en la nube (Vercel):**  
> 🔗 **[https://lista-rosy-ten.vercel.app/](https://lista-rosy-ten.vercel.app/)**  
> *(Acceso directo para evaluación inmediata sin necesidad de clonar o compilar en local).*

Aplicación web profesional para la gestión avanzada de tareas, desarrollada con **TypeScript puro** (sin frameworks externos), implementando estrictamente el patrón de arquitectura **MVC (Modelo - Vista - Controlador)**, persistencia en `localStorage`, validaciones avanzadas, filtros combinados y sistema reactivo de eventos.

---

## 🚀 Novedades y Requerimientos del Parcial 2

| Requerimiento | Descripción | Estado |
| :--- | :--- | :---: |
| **RF-01** | Fecha límite para cada tarea con formateo y cálculo de días restantes. | ✅ Completo |
| **RF-02** | Prioridad asignable (`alta`, `media`, `baja`) con distintivos cromáticos. | ✅ Completo |
| **RF-03** | Edición en caliente de tareas existentes (`updateTarea`, `renderEditForm`, `handleUpdate`). | ✅ Completo |
| **RF-04** | Eliminación segura mediante modal interactivo de confirmación (`deleteTarea`, `handleDelete`). | ✅ Completo |
| **RF-05** | Búsqueda instantánea multi-criterio por título o contenido (`searchTareas`, `handleSearch`). | ✅ Completo |
| **RF-06** | Filtros combinados simultáneos (Estado + Prioridad + Categoría). | ✅ Completo |
| **RF-07** | Ordenamiento configurable por fecha límite, nivel de prioridad y fecha de creación. | ✅ Completo |
| **RF-08** | Persistencia atómica y resiliente en `localStorage` con servicio genérico tipado. | ✅ Completo |
| **RF-09** | Contadores y métricas dinámicas (`renderCounter`, resumen KPI y panel de estadísticas). | ✅ Completo |
| **Reto Adicional** | Detección automática y resaltado en color rojo de tareas vencidas. | ✅ Completo |
| **2ª Entidad** | Integración de la entidad relacionada `Categoria` (General, Trabajo, Estudio, Personal, Urgente). | ✅ Completo |
| **UI Pulida** | Notificaciones flotantes tipo Toast con auto-cierre y sistema de pestañas/vistas. | ✅ Completo |

---

## 🏛️ Arquitectura MVC

```
src/
├── models/
│   └── Entity.ts           # Entidades Tarea, Categoria, DTOs y TareaModel (lógica de negocio)
├── views/
│   └── EntityView.ts       # Renderizado DOM, formularios, toasts, modal y delegación de eventos
├── controllers/
│   └── EntityController.ts # Orquestador de eventos, mediador entre Model y View
├── services/
│   └── StorageService.ts   # Persistencia genérica tipada en localStorage
├── style/
│   └── style.css           # Sistema de diseño con variables CSS, estados y responsividad
└── main.ts                 # Punto de entrada y arranque de la aplicación
```

---

## 🛠️ Tecnologías y Herramientas

- **Lenguaje:** TypeScript 5.9+ (Modo estricto, tipos e interfaces desacoplados)
- **Motor Web:** HTML5 Semántico + CSS3 Moderno (Grid, Flexbox, variables y animaciones CSS)
- **Persistencia:** Web Storage API (`localStorage`) con deserialización tolerante a fallos
- **Gestor de paquetes:** `pnpm`
- **Despliegue:** Optimizado para Vercel (`scripts/prepare-deploy.mjs`)

---

## 💻 Instalación y Ejecución Local

Puedes ejecutar el proyecto utilizando **npm** (estándar de Node.js) o **pnpm**:

### Opción A: Usando npm (Recomendado)

1. Abrir una terminal en la carpeta del proyecto.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Compilar el código TypeScript:
   ```bash
   npm run build
   ```
4. Servir la aplicación en local:
   ```bash
   npm start
   ```
   *Nota: Esto levantará un servidor local (por defecto en `http://localhost:3000`). Se requiere servidor HTTP local debido a que los módulos ES nativos (`type="module"`) están protegidos por políticas CORS en los navegadores al abrir por `file://`.*

### Opción B: Usando pnpm

```bash
pnpm install
pnpm run build
pnpm start
```

### Opción C: VS Code Live Server
Si utilizas la extensión **Live Server** en Visual Studio Code:
1. Haz clic derecho sobre `index.html`.
2. Selecciona **"Open with Live Server"**.

---

## 🔍 Registro Detallado de Archivos y Líneas Editadas (Auditoría de Cambios)

Esta sección detalla los archivos exactos, las clases, los métodos y las líneas añadidas o modificadas respecto al proyecto base (Laboratorio #2), estructurados para su inclusión directa en documentos o reportes de entrega:

### 1. `src/models/Entity.ts` (Capa de Modelo y Entidades)
* **Líneas 6-24:** Definición de tipos estrictos: `Prioridad = "alta" | "media" | "baja"`, `EstadoFiltro` y `CriterioOrden`.
* **Líneas 26-65:** Creación de la **segunda entidad relacionada** `Categoria` y su DTO (`CategoriaDTO`) con identificador, nombre, icono y color cromático.
* **Líneas 70-80:** Extensión de `TareaDTO` para incorporar `fechaLimite`, `prioridad` y `categoriaId`.
* **Líneas 84-101:** Definición de contratos `FiltrosTarea` (filtros combinados) y `EstadisticasTareas`.
* **Líneas 106-260 (Clase `Tarea`):**
  - **Líneas 114-140:** Atributos añadidos en constructor: `fechaLimite`, `prioridad` y `categoriaId`.
  - **Líneas 145-151 (`obtenerFechaHoy()`):** Cálculo de la fecha actual `YYYY-MM-DD` en hora local.
  - **Líneas 156-174 (`validarTitulo()`):** Validación de rango (3-60 caracteres) y **control de duplicados** insensible a mayúsculas/minúsculas.
  - **Líneas 189-204 (`validarFechaLimite()`):** Validación de formato ISO y de existencia real en el calendario.
  - **Líneas 209-216 (`estaVencida()`):** **Reto adicional** que evalúa si la tarea está vencida (fecha límite anterior a hoy y no completada).
  - **Líneas 221-228 (`diasRestantes()`):** Cálculo de días de retraso o días faltantes.
  - **Líneas 230-244 (`actualizar()`):** Modificación atómica de datos con revalidación completa.
* **Líneas 264-466 (Clase `TareaModel` - Requerimientos Parcial 2):**
  - **Líneas 315-328 (`addTarea()`):** Alta de tareas con prevención de títulos repetidos.
  - **Líneas 330-352 (`updateTarea()`):** Método requerido para actualización de registros existentes.
  - **Líneas 354-362 (`deleteTarea()`):** Método requerido para remoción persistente por ID.
  - **Líneas 374-380 (`searchTareas()`):** Método requerido para búsqueda por coincidencia textual.
  - **Líneas 382-414 (`filterTareas()`):** Método requerido para filtrado combinado (estado + prioridad + categoría + texto).
  - **Líneas 416-452 (`sortTareas()`):** Ordenamiento configurable por fecha límite, prioridad o creación.
  - **Líneas 454-465 (`getEstadisticas()`):** Cálculo de KPIs para las métricas globales y de cumplimiento.

---

### 2. `src/views/EntityView.ts` (Capa de Vista y Manejo de UI)
* **Líneas 13-19:** Contrato `FormularioTareaPayload` para tipar los datos recibidos del formulario.
* **Líneas 21-65:** Enlace y caché de nuevos elementos del DOM (pestañas, selectores de prioridad/categoría, input date, contenedores toast y modal).
* **Líneas 70-135:** Nuevos escuchadores de eventos hacia el controlador: `onFiltrarPrioridad()`, `onFiltrarCategoria()`, `onOrdenar()`, `onLimpiarFiltros()`, `onCambiarTab()`.
* **Líneas 140-167 (`render()`):** Renderizado reactivo que dibuja tarjetas con badges cromáticos, estados y categorías.
* **Líneas 169-175 (`renderCounter()`):** Método requerido para mostrar contadores dinámicos de tareas totales, pendientes y vencidas.
* **Líneas 177-194 (`renderEditForm()`):** Método requerido para cargar datos en el formulario y conmutar a modo edición con enfoque automático.
* **Líneas 196-265 (`renderEstadisticas()`):** Panel analítico con barras de progreso segmentadas y desgloses por categoría y prioridad.
* **Líneas 270-365 (`crearTarjetaTarea()`):** Construcción de tarjetas aplicando clase `.vencida` (borde rojo y badge de alerta), badge de prioridad y botones de acción.
* **Líneas 380-396 (`activarPestana()`):** Gestión de navegación por múltiples vistas/pestañas.
* **Líneas 425-483 (`mostrarNotificacion()`):** Sistema de notificaciones Toast flotantes con auto-cierre cronometrado (3.5s) y pausa en hover.
* **Líneas 485-520 (`confirmarEliminacion()`):** Diálogo modal accesible que retorna una promesa (`Promise<boolean>`).

---

### 3. `src/controllers/EntityController.ts` (Capa de Controlador)
* **Líneas 11-20:** Estado reactivo con filtros activos (`FiltrosTarea`), criterio de orden y control del ID en edición.
* **Líneas 52-84 (`handleUpdate()`):** Método requerido que valida y guarda las modificaciones de una tarea.
* **Líneas 86-107 (`handleDelete()`):** Método requerido que solicita confirmación modal interactiva antes de eliminar y notifica vía Toast.
* **Líneas 109-114 (`handleSearch()`):** Método requerido para canalizar la búsqueda en vivo.
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

---

## 📄 Documentación Completa

Para una explicación exhaustiva sobre las decisiones de diseño arquitectónicas, justificación técnica de las mejoras y su correspondencia en aplicaciones empresariales del mundo real, consulta el archivo:
👉 **[DOCUMENTO_EXPLICATIVO.md](./DOCUMENTO_EXPLICATIVO.md)**.
