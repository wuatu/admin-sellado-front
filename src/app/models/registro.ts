export class Registro {
    id_administrador:number;
    nombre_administrador:string;
    apellido_administrador:string;
    registro:string;
    fecha:string;
    constructor(id_administrador:number, nombre_administrador:string, 
        apellido_administrador: string, registro:string, fecha:string){
        this.id_administrador = id_administrador;
        this.nombre_administrador = nombre_administrador;
        this.apellido_administrador = apellido_administrador;
        this.registro = registro;
        this.fecha = fecha;
    }
}
