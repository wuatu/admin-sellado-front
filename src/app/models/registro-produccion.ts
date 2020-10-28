export class RegistroProduccion {
    id?: number;
    id_colaborador:number;
    nombre_colaborador:string;
    apellido_colaborador:string;
    registro:string;
    fecha:string;
    hora:string;
    constructor(id:number ,id_colaborador:number, nombre_colaborador:string, 
        apellido_colaborador: string, registro:string, fecha:string, hora: string){
        this.id = id;
        this.id_colaborador = id_colaborador;
        this.nombre_colaborador = nombre_colaborador;
        this.apellido_colaborador = apellido_colaborador;
        this.registro = registro;
        this.fecha = fecha;
        this.hora = hora;
    }
}
