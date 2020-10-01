export class UsuarioEnLinea {
    id?: number;
    id_linea: number;
    nombre_linea:string;
    id_lector:number;
    nombre_lector:string;
    ip_lector:string;
    id_usuario:number;
    usuario_rut: string;
    nombre_usuario:string;
    apellido_usuario:string;
    rfid_usuario:string;
    fecha_inicio:string;
    hora_inicio:string;
    fecha_termino:string;
    hora_termino:string;
    id_calibrador:string;
    nombre_calibrador:string;
    constructor(id: number, id_linea: number, nombre_linea:string, id_lector:number, nombre_lector:string, ip_lector:string,
        id_usuario:number, usuario_rut: string, nombre_usuario:string, apellido_usuario:string, rfid_usuario:string, fecha_inicio:string, hora_inicio:string,
        fecha_termino:string, hora_termino:string, id_calibrador:string, nombre_calibrador:string) {
            this.id_linea = id_linea; 
            this.nombre_linea = nombre_linea;
            this.id_lector = id_lector;
            this.nombre_lector = nombre_lector;
            this.ip_lector = ip_lector;
            this.id_usuario = id_usuario;
            this.usuario_rut = usuario_rut;
            this.nombre_usuario = nombre_usuario;
            this.apellido_usuario = apellido_usuario;
            this.rfid_usuario = rfid_usuario;
            this.fecha_inicio = fecha_inicio;
            this.hora_inicio = hora_inicio;
            this.fecha_termino = fecha_termino;
            this.hora_termino = hora_termino;
            this.id_calibrador = id_calibrador;
            this.nombre_calibrador = nombre_calibrador;
    }
}
