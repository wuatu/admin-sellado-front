export class Turno {
    id?: string;
    fecha_apertura: string;
    id_administrador_apertura: string;
    nombre_administrador_apertura: string;
    apellido_administrador_apertura: string;
    fecha_cierre: string;
    id_administrador_cierre: string;
    nombre_administrador_cierre: string;
    apellido_administrador_cierre: string;

    fechaApertura(
        id: string,
        fecha_apertura: string,
        id_administrador_apertura: string,
        nombre_administrador_apertura: string,
        apellido_administrador_apertura: string,
        fecha_cierre: string,
        id_administrador_cierre: string,
        nombre_administrador_cierre: string,
        apellido_administrador_cierre: string
    ) {
        this.id = id;
        this.fecha_apertura=fecha_apertura;
        this.id_administrador_apertura=id_administrador_apertura;
        this.nombre_administrador_apertura=nombre_administrador_apertura;
        this.apellido_administrador_apertura=apellido_administrador_apertura;
        this.fecha_cierre=fecha_cierre;
        this.id_administrador_cierre=id_administrador_cierre;
        this.nombre_administrador_cierre=nombre_administrador_cierre;
        this.apellido_administrador_cierre=apellido_administrador_cierre;
    }

    fechaCierre(        
        fecha_cierre: string,
        id_administrador_cierre: string,
        nombre_administrador_cierre: string,
        apellido_administrador_cierre: string
    ) {        
        this.fecha_cierre=fecha_cierre;
        this.id_administrador_cierre=id_administrador_cierre;
        this.nombre_administrador_cierre=nombre_administrador_cierre;
        this.apellido_administrador_cierre=apellido_administrador_cierre;
    }
}
