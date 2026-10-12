import { Tarea, TareaDTO } from "../models/Entity.js";
import { StorageService } from "../services/StorageService.js";
import { TareaView } from "../views/EntityView.js";

export class TareaController {
  private tareas: Tarea[] = [];
  private busqueda = "";
  private editandoId: string | null = null;

  constructor(
    private readonly storage: StorageService<TareaDTO>,
    private readonly vista: TareaView
  ) {}

  iniciar(): void {
    this.tareas = this.cargarTareas();

    this.vista.onGuardar((titulo, descripcion) => this.guardar(titulo, descripcion));
    this.vista.onCancelar(() => this.cancelarEdicion());
    this.vista.onBuscar((texto) => {
      this.busqueda = texto;
      this.refrescar();
    });
    this.vista.onAccion((accion, id) => {
      if (accion === "alternar") this.alternar(id);
      if (accion === "editar") this.editar(id);
      if (accion === "eliminar") this.eliminar(id);
    });

    this.refrescar();
  }

  private cargarTareas(): Tarea[] {
    const resultado: Tarea[] = [];
    for (const dto of this.storage.cargar()) {
      try {
        resultado.push(Tarea.fromJSON(dto));
      } catch {
        // Si un registro guardado es inválido, se ignora.
      }
    }
    return resultado;
  }

  private guardar(titulo: string, descripcion: string): void {
    try {
      if (this.editandoId) {
        this.buscarPorId(this.editandoId)?.actualizar(titulo, descripcion);
      } else {
        this.tareas.push(new Tarea(titulo, descripcion));
      }
      this.editandoId = null;
      this.persistir();
      this.vista.limpiarFormulario();
      this.vista.mostrarError("");
      this.refrescar();
    } catch (e) {
      this.vista.mostrarError(e instanceof Error ? e.message : "Ocurrió un error.");
    }
  }

  private alternar(id: string): void {
    this.buscarPorId(id)?.alternarEstado();
    this.persistir();
    this.refrescar();
  }

  private editar(id: string): void {
    const tarea = this.buscarPorId(id);
    if (!tarea) return;
    this.editandoId = id;
    this.vista.mostrarError("");
    this.vista.cargarFormulario(tarea);
  }

  private cancelarEdicion(): void {
    this.editandoId = null;
    this.vista.limpiarFormulario();
    this.vista.mostrarError("");
  }

  private eliminar(id: string): void {
    if (!confirm("¿Eliminar esta tarea?")) return;
    this.tareas = this.tareas.filter((t) => t.id !== id);
    if (this.editandoId === id) this.cancelarEdicion();
    this.persistir();
    this.refrescar();
  }

  private buscarPorId(id: string): Tarea | undefined {
    return this.tareas.find((t) => t.id === id);
  }

  private persistir(): void {
    this.storage.guardar(this.tareas.map((t) => t.toJSON()));
  }

  private refrescar(): void {
    const visibles = this.tareas.filter((t) => t.coincideCon(this.busqueda));
    this.vista.render(visibles, this.tareas.length, this.busqueda);
  }
}