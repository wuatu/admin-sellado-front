export class Lector {
    id?: string;
    nombre: string;
    ip:string;
    fk_linea:string;
    constructor(id: string, nombre: string, ip:string, fk_linea:string) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.fk_linea = fk_linea;
    }
}
