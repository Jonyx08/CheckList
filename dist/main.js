import { TareaModel } from "./models/Entity.js";
import { StorageService } from "./services/StorageService.js";
import { TareaView } from "./views/EntityView.js";
import { TareaController } from "./controllers/EntityController.js";
// Servicios de persistencia tipados en localStorage
const storageTareas = new StorageService("listaTarea:tareas");
const storageCategorias = new StorageService("listaTarea:categorias");
// Instanciación de componentes según el patrón MVC
const modelo = new TareaModel(storageTareas, storageCategorias);
const vista = new TareaView();
const controlador = new TareaController(modelo, vista);
// Inicialización de la aplicación
controlador.iniciar();
