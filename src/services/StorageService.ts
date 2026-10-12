export class StorageService<t>{
    constructor(private readonly clave: string) {}

    cargar(): t[] {
        try {
            const crudo = localStorage.getItem(this.clave);
            if(!crudo) return [];
            const datos: unknown = JSON.parse(crudo);
            return Array.isArray(datos) ? (datos as t[]): [];
        } catch {
            return [];
        }
    }

    guardar(items: t[]): void {
        localStorage.setItem(this.clave, JSON.stringify(items));
    }
}