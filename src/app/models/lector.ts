export class Lector {
    id?: string;
    nombre: string;
    puerto:string;
    fk_linea:string;
    constructor(id: string, nombre: string, puerto:string, fk_linea:string) {
        this.id = id;
        this.nombre = nombre;
        this.puerto = puerto;
        this.fk_linea = fk_linea;
    }
}
