# Lista de Tareas

Aplicación web para gestionar tareas, hecha con **TypeScript puro** (sin frameworks) y organizada con el patrón **MVC**.

🔗 **Demo en vivo:** [https://lista-rosy-ten.vercel.app/](https://lista-rosy-ten.vercel.app/)

## Funcionalidades

- Registrar tareas mediante un formulario
- Listar las tareas en tarjetas
- Buscar tareas por título o descripción
- Editar y eliminar tareas
- Marcar tareas como completadas o reabrirlas
- Validación de datos (título de 3 a 60 caracteres, descripción de hasta 200)
- Persistencia en `localStorage`: las tareas se conservan al recargar la página

## Arquitectura MVC

| Capa | Archivo | Responsabilidad |
| --- | --- | --- |
| **Model** | `src/models/Tarea.ts` | Clase con los datos de la tarea y sus validaciones |
| **View** | `src/views/TareaView.ts`, `index.html`, `styles.css` | Muestra la interfaz y notifica los eventos del usuario |
| **Controller** | `src/controllers/TareaController.ts` | Maneja los eventos y coordina el modelo, la vista y el almacenamiento |
| **Service** | `src/services/StorageService.ts` | Lee y guarda los datos en `localStorage` |

## Estructura del proyecto

```
├── src/
│   ├── controllers/
│   │   └── TareaController.ts
│   ├── models/
│   │   └── Tarea.ts
│   ├── services/
│   │   └── StorageService.ts
│   ├── views/
│   │   └── TareaView.ts
│   └── main.ts
├── index.html
├── styles.css
├── package.json
└── tsconfig.json
```

## Tecnologías

- TypeScript
- HTML y CSS
- [pnpm](https://pnpm.io/) como gestor de paquetes
- [Vercel](https://vercel.com/) para el despliegue

## Instalación y uso en local

Requisitos: [Node.js](https://nodejs.org/) y pnpm.

```bash
# Instalar dependencias
pnpm install

# Compilar en modo watch
pnpm dev

# En otra terminal, servir el proyecto
pnpm dlx serve .
```

Después abre la dirección que indique el servidor en tu navegador.

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Compila TypeScript en modo watch (`tsc --watch`) |
| `pnpm build` | Compila el proyecto a la carpeta `dist` (`tsc`) |

## Despliegue

El proyecto está desplegado en Vercel con esta configuración:

- **Framework Preset:** Other
- **Build Command:** `pnpm build`
- **Output Directory:** `.`