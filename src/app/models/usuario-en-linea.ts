export class UsuarioEnLinea {
    id?: number;
    id_linea: number;
    nombre_linea:string;
    id_rfid:number;
    nombre_rfid:string;
    ip_rfid:string;
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
    id_turno:number;
    constructor(id: number, id_linea: number, nombre_linea:string, id_rfid:number, nombre_rfid:string, ip_rfid:string,
        id_usuario:number, usuario_rut: string, nombre_usuario:string, apellido_usuario:string, rfid_usuario:string, fecha_inicio:string, hora_inicio:string,
        fecha_termino:string, hora_termino:string, id_calibrador:string, nombre_calibrador:string, id_turno:number) {
            this.id_linea = id_linea; 
            this.nombre_linea = nombre_linea;
            this.id_rfid = id_rfid;
            this.nombre_rfid = nombre_rfid;
            this.ip_rfid = ip_rfid;
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
            this.id_turno = id_turno;
    }
}
