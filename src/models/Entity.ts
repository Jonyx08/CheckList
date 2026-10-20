import { StorageService } from "../services/StorageService.js";

/**
 * Niveles de prioridad permitidos para las tareas.
 */
export type Prioridad = "alta" | "media" | "baja";

/**
 * Estados de filtrado disponibles en la vista.
 */
export type EstadoFiltro = "todas" | "pendientes" | "completadas" | "vencidas";

/**
 * Opciones de ordenamiento para la lista de tareas.
 */
export type CriterioOrden =
  | "fecha-limite-asc"
  | "fecha-limite-desc"
  | "prioridad-desc"
  | "prioridad-asc"
  | "creacion-desc"
  | "creacion-asc";

/**
 * DTO para la entidad relacionada Categoría.
 */
export interface CategoriaDTO {
  id: string;
  nombre: string;
  color: string;
  icono: string;
}

/**
 * Entidad Categoría (Segunda entidad relacionada para cumplir con los requerimientos).
 */
export class Categoria {
  readonly id: string;
  nombre: string;
  color: string;
  icono: string;

  constructor(nombre: string, color: string, icono: string, id: string = crypto.randomUUID()) {
    this.id = id;
    this.nombre = nombre.trim();
    this.color = color;
    this.icono = icono;
  }

  toJSON(): CategoriaDTO {
    return {
      id: this.id,
      nombre: this.nombre,
      color: this.color,
      icono: this.icono,
    };
  }

  static fromJSON(dto: CategoriaDTO): Categoria {
    return new Categoria(dto.nombre, dto.color, dto.icono, dto.id);
  }
}

/**
 * DTO para la entidad principal Tarea.
 */
export interface TareaDTO {
  id: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaCreacion: string;
  fechaLimite: string;
  prioridad: Prioridad;
  categoriaId: string;
}

/**
 * Filtros combinados aplicables a la colección de tareas.
 */
export interface FiltrosTarea {
  estado: EstadoFiltro;
  prioridad: "todas" | Prioridad;
  categoriaId: string;
  busqueda: string;
}

/**
 * Resumen estadístico de las tareas.
 */
export interface EstadisticasTareas {
  total: number;
  pendientes: number;
  completadas: number;
  vencidas: number;
  porcentajeCompletadas: number;
}

/**
 * Entidad Tarea con validaciones de dominio y métodos de estado.
 */
export class Tarea {
  static readonly TITULO_MIN = 3;
  static readonly TITULO_MAX = 60;
  static readonly DESCRIPCION_MAX = 250;
  static readonly PRIORIDADES_VALIDAS: readonly Prioridad[] = ["alta", "media", "baja"];

  readonly id: string;
  readonly fechaCreacion: string;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fechaLimite: string;
  prioridad: Prioridad;
  categoriaId: string;

  constructor(
    titulo: string,
    descripcion = "",
    fechaLimite = "",
    prioridad: Prioridad = "media",
    categoriaId = "cat-general",
    completada = false,
    id: string = crypto.randomUUID(),
    fechaCreacion: string = new Date().toISOString()
  ) {
    this.titulo = Tarea.validarTitulo(titulo);
    this.descripcion = Tarea.validarDescripcion(descripcion);
    this.fechaLimite = Tarea.validarFechaLimite(fechaLimite);
    this.prioridad = Tarea.validarPrioridad(prioridad);
    this.categoriaId = categoriaId.trim() || "cat-general";
    this.completada = completada;
    this.id = id;
    this.fechaCreacion = fechaCreacion;
  }

  /**
   * Obtiene la fecha actual en formato YYYY-MM-DD según la zona horaria local.
   */
  static obtenerFechaHoy(): string {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  /**
   * Valida el formato y longitud del título, comprobando duplicados opcionalmente.
   */
  static validarTitulo(valor: string, tareasExistentes?: readonly Tarea[], idActual?: string): string {
    const limpio = valor ? valor.trim() : "";
    if (limpio.length < Tarea.TITULO_MIN) {
      throw new Error(`El título debe tener al menos ${Tarea.TITULO_MIN} caracteres.`);
    }
    if (limpio.length > Tarea.TITULO_MAX) {
      throw new Error(`El título no puede superar ${Tarea.TITULO_MAX} caracteres.`);
    }

    if (tareasExistentes) {
      const duplicado = tareasExistentes.some(
        (t) => t.id !== idActual && t.titulo.toLowerCase() === limpio.toLowerCase()
      );
      if (duplicado) {
        throw new Error(`Ya existe una tarea con el título "${limpio}". No se permiten títulos duplicados.`);
      }
    }

    return limpio;
  }

  /**
   * Valida la longitud máxima de la descripción.
   */
  static validarDescripcion(valor: string): string {
    const limpio = (valor ?? "").trim();
    if (limpio.length > Tarea.DESCRIPCION_MAX) {
      throw new Error(`La descripción no puede superar ${Tarea.DESCRIPCION_MAX} caracteres.`);
    }
    return limpio;
  }

  /**
   * Valida el formato de la fecha límite (YYYY-MM-DD o vacía).
   */
  static validarFechaLimite(valor: string): string {
    const limpio = (valor ?? "").trim();
    if (!limpio) return "";
    const patronFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!patronFecha.test(limpio)) {
      throw new Error("La fecha límite debe tener el formato válido AAAA-MM-DD.");
    }
    const [y, m, d] = limpio.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    if (
      dateObj.getFullYear() !== y ||
      dateObj.getMonth() !== m - 1 ||
      dateObj.getDate() !== d
    ) {
      throw new Error("La fecha límite no corresponde a una fecha real del calendario.");
    }
    return limpio;
  }

  /**
   * Valida que la prioridad corresponda al catálogo permitido.
   */
  static validarPrioridad(valor: string): Prioridad {
    const normalizada = (valor ?? "").toLowerCase().trim() as Prioridad;
    if (!Tarea.PRIORIDADES_VALIDAS.includes(normalizada)) {
      throw new Error(`La prioridad debe ser una de: ${Tarea.PRIORIDADES_VALIDAS.join(", ")}.`);
    }
    return normalizada;
  }

  /**
   * Actualiza los datos de la tarea realizando validación previa atómica.
   */
  actualizar(
    datos: {
      titulo: string;
      descripcion?: string;
      fechaLimite?: string;
      prioridad?: Prioridad;
      categoriaId?: string;
    },
    tareasExistentes?: readonly Tarea[]
  ): void {
    const tituloValido = Tarea.validarTitulo(datos.titulo, tareasExistentes, this.id);
    const descripcionValida = Tarea.validarDescripcion(datos.descripcion ?? this.descripcion);
    const fechaLimiteValida = Tarea.validarFechaLimite(datos.fechaLimite ?? this.fechaLimite);
    const prioridadValida = Tarea.validarPrioridad(datos.prioridad ?? this.prioridad);

    this.titulo = tituloValido;
    this.descripcion = descripcionValida;
    this.fechaLimite = fechaLimiteValida;
    this.prioridad = prioridadValida;
    if (datos.categoriaId) {
      this.categoriaId = datos.categoriaId;
    }
  }

  alternarEstado(): void {
    this.completada = !this.completada;
  }

  /**
   * Determina si la tarea está vencida (Reto adicional: fecha límite pasada y tarea no completada).
   */
  estaVencida(): boolean {
    if (this.completada) return false;
    if (!this.fechaLimite) return false;
    const hoy = Tarea.obtenerFechaHoy();
    return this.fechaLimite < hoy;
  }

  /**
   * Calcula los días restantes para la fecha límite.
   * Valores negativos indican días de retraso (vencida).
   */
  diasRestantes(): number | null {
    if (!this.fechaLimite) return null;
    const hoyStr = Tarea.obtenerFechaHoy();
    const hoy = new Date(`${hoyStr}T00:00:00`);
    const limite = new Date(`${this.fechaLimite}T00:00:00`);
    const diffMs = limite.getTime() - hoy.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  coincideCon(texto: string): boolean {
    const q = texto.trim().toLowerCase();
    if (!q) return true;
    return (
      this.titulo.toLowerCase().includes(q) ||
      this.descripcion.toLowerCase().includes(q)
    );
  }

  toJSON(): TareaDTO {
    return {
      id: this.id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      completada: this.completada,
      fechaCreacion: this.fechaCreacion,
      fechaLimite: this.fechaLimite,
      prioridad: this.prioridad,
      categoriaId: this.categoriaId,
    };
  }

  static fromJSON(d: TareaDTO): Tarea {
    return new Tarea(
      d.titulo,
      d.descripcion,
      d.fechaLimite ?? "",
      d.prioridad ?? "media",
      d.categoriaId ?? "cat-general",
      d.completada,
      d.id,
      d.fechaCreacion
    );
  }
}

/**
 * Modelo de datos encargado de la lógica de negocio y persistencia de las tareas.
 * (Cumple con los métodos explícitos solicitados en la rúbrica del Parcial 2).
 */
export class TareaModel {
  private tareas: Tarea[] = [];
  private categorias: Categoria[] = [];

  constructor(
    private readonly storageTareas: StorageService<TareaDTO>,
    private readonly storageCategorias: StorageService<CategoriaDTO>
  ) {
    this.inicializarCategorias();
    this.cargar();
  }

  private inicializarCategorias(): void {
    const porDefecto: CategoriaDTO[] = [
      { id: "cat-general", nombre: "General", color: "#6b7280", icono: "📌" },
      { id: "cat-trabajo", nombre: "Trabajo", color: "#2563eb", icono: "💼" },
      { id: "cat-estudio", nombre: "Estudio", color: "#8b5cf6", icono: "📚" },
      { id: "cat-personal", nombre: "Personal", color: "#10b981", icono: "🏠" },
      { id: "cat-urgente", nombre: "Urgente", color: "#ef4444", icono: "🔥" },
    ];

    const guardadas = this.storageCategorias.cargar();
    if (guardadas.length > 0) {
      this.categorias = guardadas.map((dto) => Categoria.fromJSON(dto));
    } else {
      this.categorias = porDefecto.map((dto) => Categoria.fromJSON(dto));
      this.storageCategorias.guardar(this.categorias.map((c) => c.toJSON()));
    }
  }

  cargar(): void {
    const raw = this.storageTareas.cargar();
    this.tareas = [];
    for (const dto of raw) {
      try {
        this.tareas.push(Tarea.fromJSON(dto));
      } catch (e) {
        console.warn("Registro de tarea corrupto ignorado:", dto, e);
      }
    }
  }

  guardar(): void {
    this.storageTareas.guardar(this.tareas.map((t) => t.toJSON()));
  }

  getTareas(): Tarea[] {
    return [...this.tareas];
  }

  getCategorias(): Categoria[] {
    return [...this.categorias];
  }

  getCategoriaPorId(id: string): Categoria | undefined {
    return this.categorias.find((c) => c.id === id);
  }

  getTareaPorId(id: string): Tarea | undefined {
    return this.tareas.find((t) => t.id === id);
  }

  existeTitulo(titulo: string, excluirId?: string): boolean {
    const normalizado = titulo.trim().toLowerCase();
    return this.tareas.some(
      (t) => t.id !== excluirId && t.titulo.toLowerCase() === normalizado
    );
  }

  addTarea(
    titulo: string,
    descripcion: string,
    fechaLimite: string,
    prioridad: Prioridad,
    categoriaId: string
  ): Tarea {
    if (this.existeTitulo(titulo)) {
      throw new Error(`Ya existe una tarea registrada con el título "${titulo.trim()}".`);
    }

    const nueva = new Tarea(
      titulo,
      descripcion,
      fechaLimite,
      prioridad,
      categoriaId,
      false
    );
    this.tareas.push(nueva);
    this.guardar();
    return nueva;
  }

  /**
   * Actualiza una tarea existente (Requerimiento explícito: updateTarea).
   */
  updateTarea(id: string, datos: Partial<TareaDTO>): Tarea {
    const tarea = this.getTareaPorId(id);
    if (!tarea) {
      throw new Error(`No se encontró la tarea con identificador "${id}".`);
    }

    tarea.actualizar(
      {
        titulo: datos.titulo ?? tarea.titulo,
        descripcion: datos.descripcion,
        fechaLimite: datos.fechaLimite,
        prioridad: datos.prioridad,
        categoriaId: datos.categoriaId,
      },
      this.tareas
    );

    this.guardar();
    return tarea;
  }

  /**
   * Elimina una tarea por ID (Requerimiento explícito: deleteTarea).
   */
  deleteTarea(id: string): boolean {
    const indice = this.tareas.findIndex((t) => t.id === id);
    if (indice === -1) return false;
    this.tareas.splice(indice, 1);
    this.guardar();
    return true;
  }

  toggleTarea(id: string): Tarea {
    const tarea = this.getTareaPorId(id);
    if (!tarea) {
      throw new Error(`No se encontró la tarea con identificador "${id}".`);
    }
    tarea.alternarEstado();
    this.guardar();
    return tarea;
  }

  /**
   * Búsqueda por título o descripción (Requerimiento explícito: searchTareas).
   */
  searchTareas(query: string, lista: Tarea[] = this.tareas): Tarea[] {
    const q = query.trim().toLowerCase();
    if (!q) return lista;
    return lista.filter((t) => t.coincideCon(q));
  }

  /**
   * Filtrado multi-criterio por estado, prioridad y categoría (Requerimiento explícito: filterTareas).
   */
  filterTareas(filtros: FiltrosTarea, lista: Tarea[] = this.tareas): Tarea[] {
    let filtradas = lista;

    // Filtro por Estado
    if (filtros.estado === "pendientes") {
      filtradas = filtradas.filter((t) => !t.completada);
    } else if (filtros.estado === "completadas") {
      filtradas = filtradas.filter((t) => t.completada);
    } else if (filtros.estado === "vencidas") {
      filtradas = filtradas.filter((t) => t.estaVencida());
    }

    // Filtro por Prioridad
    if (filtros.prioridad !== "todas") {
      filtradas = filtradas.filter((t) => t.prioridad === filtros.prioridad);
    }

    // Filtro por Categoría
    if (filtros.categoriaId && filtros.categoriaId !== "todas") {
      filtradas = filtradas.filter((t) => t.categoriaId === filtros.categoriaId);
    }

    // Búsqueda integrada
    if (filtros.busqueda) {
      filtradas = this.searchTareas(filtros.busqueda, filtradas);
    }

    return filtradas;
  }

  /**
   * Ordena tareas por criterio (fecha límite, prioridad, fecha de creación).
   */
  sortTareas(criterio: CriterioOrden, lista: Tarea[] = this.tareas): Tarea[] {
    const copia = [...lista];
    const pesoPrioridad: Record<Prioridad, number> = {
      alta: 3,
      media: 2,
      baja: 1,
    };

    switch (criterio) {
      case "fecha-limite-asc":
        return copia.sort((a, b) => {
          if (!a.fechaLimite) return 1;
          if (!b.fechaLimite) return -1;
          return a.fechaLimite.localeCompare(b.fechaLimite);
        });

      case "fecha-limite-desc":
        return copia.sort((a, b) => {
          if (!a.fechaLimite) return 1;
          if (!b.fechaLimite) return -1;
          return b.fechaLimite.localeCompare(a.fechaLimite);
        });

      case "prioridad-desc":
        return copia.sort((a, b) => pesoPrioridad[b.prioridad] - pesoPrioridad[a.prioridad]);

      case "prioridad-asc":
        return copia.sort((a, b) => pesoPrioridad[a.prioridad] - pesoPrioridad[b.prioridad]);

      case "creacion-asc":
        return copia.sort((a, b) => a.fechaCreacion.localeCompare(b.fechaCreacion));

      case "creacion-desc":
      default:
        return copia.sort((a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion));
    }
  }

  /**
   * Calcula el resumen estadístico global de tareas.
   */
  getEstadisticas(): EstadisticasTareas {
    const total = this.tareas.length;
    const completadas = this.tareas.filter((t) => t.completada).length;
    const pendientes = total - completadas;
    const vencidas = this.tareas.filter((t) => t.estaVencida()).length;
    const porcentajeCompletadas = total === 0 ? 0 : Math.round((completadas / total) * 100);

    return {
      total,
      pendientes,
      completadas,
      vencidas,
      porcentajeCompletadas,
    };
  }
}
