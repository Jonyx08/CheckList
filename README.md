# Gestor de Tareas MVC - Parcial 2

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

1. Clonar el repositorio o abrir la carpeta del proyecto.
2. Instalar las dependencias de desarrollo:
   ```bash
   pnpm install
   ```
3. Compilar el proyecto TypeScript:
   ```bash
   pnpm run build
   ```
4. Iniciar el modo de desarrollo con detección de cambios (*watch mode*):
   ```bash
   pnpm run dev
   ```
5. Servir la aplicación en local (puedes usar cualquier servidor estático):
   ```bash
   pnpm dlx serve .
   ```
   Abre la URL proporcionada (por ejemplo `http://localhost:3000`) en tu navegador web.

---

## 📄 Documentación Completa

Para una explicación exhaustiva sobre las decisiones de diseño arquitectónicas, justificación técnica de las mejoras y su correspondencia en aplicaciones empresariales del mundo real, consulta el archivo:
👉 **[DOCUMENTO_EXPLICATIVO.md](./DOCUMENTO_EXPLICATIVO.md)**.
