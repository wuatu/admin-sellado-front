export class Usuario {
    id?: string;
    rut: string;
    nombre:string;
    apellido:string;
    rfid:string;
    constructor(id: string, rut: string, nombre:string, apellido:string, rfid:string) {
        this.id = id;
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.rfid = rfid;
    }
}
