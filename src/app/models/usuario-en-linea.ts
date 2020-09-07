export class UsuarioEnLinea {
    id?: string;
    rut: string;
    nombre:string;
    apellido:string;
    fechaInicio:string;
    fechaTermino:string;
    constructor(id: string, rut: string, nombre:string, apellido:string, fechaInicio:string, fechaTermino: string) {
        this.id = id;
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.fechaInicio = fechaInicio;
        this.fechaTermino = fechaTermino;
    }
}
