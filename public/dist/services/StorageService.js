/**
 * Servicio genérico y tipado para la persistencia segura en localStorage.
 */
export class StorageService {
    constructor(clave) {
        this.clave = clave;
    }
    /**
     * Carga los elementos almacenados bajo la clave especificada.
     * Si no existen o el contenido está corrupto, retorna un arreglo vacío sin romper la ejecución.
     */
    cargar(valorPorDefecto = []) {
        try {
            const crudo = localStorage.getItem(this.clave);
            if (!crudo)
                return valorPorDefecto;
            const datos = JSON.parse(crudo);
            return Array.isArray(datos) ? datos : valorPorDefecto;
        }
        catch (e) {
            console.warn(`[StorageService] No se pudo leer la clave "${this.clave}":`, e);
            return valorPorDefecto;
        }
    }
    /**
     * Guarda de forma atómica los elementos serializados en JSON.
     */
    guardar(items) {
        try {
            localStorage.setItem(this.clave, JSON.stringify(items));
            return true;
        }
        catch (e) {
            console.error(`[StorageService] No se pudo guardar en la clave "${this.clave}":`, e);
            return false;
        }
    }
    /**
     * Limpia la entrada en localStorage.
     */
    limpiar() {
        try {
            localStorage.removeItem(this.clave);
        }
        catch (e) {
            console.error(`[StorageService] Error al limpiar la clave "${this.clave}":`, e);
        }
    }
}
