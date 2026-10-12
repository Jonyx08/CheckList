import { TareaDTO } from "./models/Entity.js";
import { StorageService } from "./services/StorageService.js";
import { TareaView } from "./views/EntityView.js";
import { TareaController } from "./controllers/EntityController.js";

const storage = new StorageService<TareaDTO>("listaTarea:tareas");
const vista = new TareaView();
const controlador = new TareaController(storage, vista);

controlador.iniciar();