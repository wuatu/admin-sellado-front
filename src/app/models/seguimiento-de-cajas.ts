export class SeguimientoDeCajas {
    id?: number;
    id_calibrador: number;
    nombre_calibrador: string;
    id_linea: number;
    nombre_linea: string;
    id_rfid: number;
    nombre_rfid: string;
    ip_rfid: string;
    id_lector: number;
    nombre_lector: string;
    ip_lector: string;
    id_usuario: number;
    rut_usuario: string;
    nombre_usuario: string;
    apellido_usuario: string;
    codigo_de_barra: string;
    id_caja: number;
    envase_caja: string;
    variedad_caja: string;
    categoria_caja: string;
    calibre_caja: string;
    correlativo_caja: string;
    ponderacion_caja: string;
    fecha_sellado: string;
    hora_sellado: string;
    fecha_validacion: string;
    hora_validacion: string;
    fecha_validacion_time:string;
    is_verificado: number;
    is_before_time: number;
    id_apertura_cierre_de_turno: number;

    constructor(id: number, id_calibrador: number, nombre_calibrador: string, id_linea: number, nombre_linea: string, id_rfid: number,
        nombre_rfid: string, ip_rfid: string, id_lector: number, nombre_lector: string, ip_lector: string, id_usuario: number,
        rut_usuario: string, nombre_usuario: string, apellido_usuario: string, codigo_de_barra: string, id_caja: number,
        envase_caja: string, variedad_caja: string, categoria_caja: string, calibre_caja: string, correlativo_caja: string, ponderacion_caja: string,
        fecha_sellado: string,hora_sellado: string , fecha_validacion: string, hora_validacion: string , fecha_validacion_time:string,is_verificado: number, is_before_time: number, id_apertura_cierre_de_turno: number)
        {
            this.id = id;
            this.id_calibrador = id_calibrador;
            this.nombre_calibrador = nombre_calibrador;
            this.id_linea = id_linea;
            this.nombre_linea = nombre_linea;
            this.id_rfid = id_rfid;
            this.nombre_rfid = nombre_rfid;
            this.ip_rfid = ip_rfid;
            this.id_lector = id_lector;
            this.nombre_lector = nombre_lector;
            this.ip_lector = ip_lector;
            this.id_usuario = id_usuario;
            this.rut_usuario = rut_usuario;
            this.nombre_usuario = nombre_usuario;
            this.apellido_usuario = apellido_usuario;
            this.codigo_de_barra = codigo_de_barra;
            this.id_caja = id_caja;
            this.envase_caja = envase_caja;
            this.variedad_caja = variedad_caja;
            this.categoria_caja = categoria_caja;
            this.calibre_caja = calibre_caja;
            this.correlativo_caja = correlativo_caja;
            this.ponderacion_caja = ponderacion_caja;
            this.fecha_sellado = fecha_sellado;
            this.hora_sellado = hora_sellado;
            this.fecha_validacion = fecha_validacion;
            this.hora_validacion = hora_validacion;
            this.fecha_validacion_time = fecha_validacion_time;
            this.is_verificado = is_verificado;
            this.is_before_time = is_before_time;
            this.id_apertura_cierre_de_turno = id_apertura_cierre_de_turno;
        }
}
