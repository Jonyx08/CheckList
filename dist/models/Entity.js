export class Tarea {
    constructor(titulo, descripcion = "", completada = false, id = crypto.randomUUID(), fechaCreacion = new Date().toISOString()) {
        this.titulo = Tarea.validarTitulo(titulo);
        this.descripcion = Tarea.validarDescripcion(descripcion);
        this.completada = completada;
        this.id = id;
        this.fechaCreacion = fechaCreacion;
    }
    static validarTitulo(valor) {
        const limpio = valor.trim();
        if (limpio.length < Tarea.TITULO_MIN) {
            throw new Error(`El título debe tener al menos ${Tarea.TITULO_MIN} caracteres.`);
        }
        if (limpio.length > Tarea.TITULO_MAX) {
            throw new Error(`El título no puede superar ${Tarea.TITULO_MAX} caracteres.`);
        }
        return limpio;
    }
    static validarDescripcion(valor) {
        const limpio = valor.trim();
        if (limpio.length > Tarea.DESCRIPCION_MAX) {
            throw new Error(`La descripción no puede superar ${Tarea.DESCRIPCION_MAX} caracteres.`);
        }
        return limpio;
    }
    actualizar(titulo, descripcion) {
        // Se valida todo antes de asignar, para no dejar la tarea a medias si algo falla.
        const tituloValido = Tarea.validarTitulo(titulo);
        const descripcionValida = Tarea.validarDescripcion(descripcion);
        this.titulo = tituloValido;
        this.descripcion = descripcionValida;
    }
    alternarEstado() {
        this.completada = !this.completada;
    }
    coincideCon(texto) {
        const q = texto.trim().toLowerCase();
        if (!q)
            return true;
        return (this.titulo.toLowerCase().includes(q) ||
            this.descripcion.toLowerCase().includes(q));
    }
    toJSON() {
        return {
            id: this.id,
            titulo: this.titulo,
            descripcion: this.descripcion,
            completada: this.completada,
            fechaCreacion: this.fechaCreacion,
        };
    }
    static fromJSON(d) {
        return new Tarea(d.titulo, d.descripcion, d.completada, d.id, d.fechaCreacion);
    }
}
Tarea.TITULO_MIN = 3;
Tarea.TITULO_MAX = 60;
Tarea.DESCRIPCION_MAX = 200;
