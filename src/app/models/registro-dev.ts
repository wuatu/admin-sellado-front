export class RegistroDev {
    id?: number;
    nombre:string;
    registro:string;
    fecha:string;
    hora:string;
    constructor(id:number, nombre:string, registro:string, fecha:string, hora: string){
        this.id = id;
        this.nombre = nombre;
        this.registro = registro;
        this.fecha = fecha;
        this.hora = hora;
    }
}
