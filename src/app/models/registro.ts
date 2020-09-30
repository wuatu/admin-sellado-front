export class Registro {
    id?: number;
    id_administrador:number;
    nombre_administrador:string;
    apellido_administrador:string;
    registro:string;
    fecha:string;
    hora:string;
    constructor(id:number ,id_administrador:number, nombre_administrador:string, 
        apellido_administrador: string, registro:string, fecha:string, hora: string){
        this.id = id;
        this.id_administrador = id_administrador;
        this.nombre_administrador = nombre_administrador;
        this.apellido_administrador = apellido_administrador;
        this.registro = registro;
        this.fecha = fecha;
        this.hora = hora;
    }
}
