import { Tarea } from "../models/Entity.js";

export type Accion = "alternar" | "editar" | "eliminar";

export class TareaView {
  private form = this.obtener<HTMLFormElement>("#form-tarea");
  private inputTitulo = this.obtener<HTMLInputElement>("#titulo");
  private inputDescripcion = this.obtener<HTMLTextAreaElement>("#descripcion");
  private btnGuardar = this.obtener<HTMLButtonElement>("#btn-guardar");
  private btnCancelar = this.obtener<HTMLButtonElement>("#btn-cancelar");
  private error = this.obtener<HTMLElement>("#error");
  private inputBuscar = this.obtener<HTMLInputElement>("#buscar");
  private lista = this.obtener<HTMLElement>("#lista");
  private contador = this.obtener<HTMLElement>("#contador");

  private obtener<T extends HTMLElement>(selector: string): T {
    const el = document.querySelector<T>(selector);
    if (!el) throw new Error(`No se encontró el elemento ${selector}`);
    return el;
  }

  // ---- Eventos que la vista le expone al controlador ----

  onGuardar(cb: (titulo: string, descripcion: string) => void): void {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      cb(this.inputTitulo.value, this.inputDescripcion.value);
    });
  }

  onCancelar(cb: () => void): void {
    this.btnCancelar.addEventListener("click", cb);
  }

  onBuscar(cb: (texto: string) => void): void {
    this.inputBuscar.addEventListener("input", () => cb(this.inputBuscar.value));
  }

  onAccion(cb: (accion: Accion, id: string) => void): void {
    this.lista.addEventListener("click", (e) => {
      const boton = (e.target as HTMLElement).closest<HTMLElement>("[data-accion]");
      const id = boton?.closest<HTMLElement>("[data-id]")?.dataset.id;
      if (!boton || !id) return;
      cb(boton.dataset.accion as Accion, id);
    });
  }

  // ---- Render ----

  render(tareas: Tarea[], total: number, busqueda: string): void {
    this.lista.replaceChildren();

    if (tareas.length === 0) {
      const vacio = document.createElement("p");
      vacio.className = "vacio";
      vacio.textContent = busqueda.trim()
        ? "No hay tareas que coincidan con la búsqueda."
        : "Aún no hay tareas. ¡Agrega la primera!";
      this.lista.append(vacio);
    }

    for (const t of tareas) this.lista.append(this.crearTarjeta(t));

    const pendientes = tareas.filter((t) => !t.completada).length;
    this.contador.textContent = `${tareas.length} de ${total} tareas · ${pendientes} pendientes`;
  }

  private crearTarjeta(t: Tarea): HTMLElement {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarea" + (t.completada ? " completada" : "");
    tarjeta.dataset.id = t.id;

    const titulo = document.createElement("h3");
    titulo.textContent = t.titulo;

    const descripcion = document.createElement("p");
    descripcion.textContent = t.descripcion;

    const fecha = document.createElement("small");
    fecha.textContent = new Date(t.fechaCreacion).toLocaleDateString("es");

    const acciones = document.createElement("div");
    acciones.className = "acciones";
    acciones.append(
      this.crearBoton(t.completada ? "Reabrir" : "Completar", "alternar", "btn"),
      this.crearBoton("Editar", "editar", "btn"),
      this.crearBoton("Eliminar", "eliminar", "btn peligro")
    );

    tarjeta.append(titulo);
    if (t.descripcion) tarjeta.append(descripcion);
    tarjeta.append(fecha, acciones);
    return tarjeta;
  }

  private crearBoton(texto: string, accion: Accion, clase: string): HTMLButtonElement {
    const b = document.createElement("button");
    b.type = "button";
    b.className = clase;
    b.dataset.accion = accion;
    b.textContent = texto;
    return b;
  }

  // ---- Formulario ----

  cargarFormulario(t: Tarea): void {
    this.inputTitulo.value = t.titulo;
    this.inputDescripcion.value = t.descripcion;
    this.btnGuardar.textContent = "Guardar cambios";
    this.btnCancelar.hidden = false;
    this.inputTitulo.focus();
  }

  limpiarFormulario(): void {
    this.form.reset();
    this.btnGuardar.textContent = "Agregar tarea";
    this.btnCancelar.hidden = true;
  }

  mostrarError(mensaje: string): void {
    this.error.textContent = mensaje;
  }
}