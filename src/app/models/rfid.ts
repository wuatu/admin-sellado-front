export class Rfid {
    id?: string;
    nombre: string;
    ip:string
    fk_linea:string;
    constructor(id: string, nombre: string, ip:string, linea:string) {
        this.id = id;
        this.nombre = nombre;
        this.ip=ip;
        this.fk_linea=linea;
    }
}
