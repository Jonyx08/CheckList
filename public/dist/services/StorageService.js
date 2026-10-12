export class StorageService {
    constructor(clave) {
        this.clave = clave;
    }
    cargar() {
        try {
            const crudo = localStorage.getItem(this.clave);
            if (!crudo)
                return [];
            const datos = JSON.parse(crudo);
            return Array.isArray(datos) ? datos : [];
        }
        catch {
            return [];
        }
    }
    guardar(items) {
        localStorage.setItem(this.clave, JSON.stringify(items));
    }
}
