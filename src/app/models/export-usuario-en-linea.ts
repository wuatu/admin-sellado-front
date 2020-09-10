import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export class ExportUsuarioEnLinea {
    RUT: string;
    NOMBRE: string;
    APELLIDO: string;
    LINEA: string;
    CALIBRADOR: string;
    HORA_INICIO: string;
    FECHA_INICIO: string;
    HORA_TERMINO: string;
    FECHA_TERMINO: string;
    constructor( usuario_rut: string, nombre_usuario:string, apellido_usuario:string, linea:string, nombre_calibrador: string, hora_inicio: string, fecha_inicio:string,
        hora_termino: string, fecha_termino:string) {
            this.RUT = usuario_rut;
            this.NOMBRE = nombre_usuario;
            this.APELLIDO = apellido_usuario;
            this.LINEA = linea;
            this.CALIBRADOR = nombre_calibrador;
            this.HORA_INICIO = hora_inicio;
            this.FECHA_INICIO = fecha_inicio;
            this.HORA_TERMINO = hora_termino;
            this.FECHA_TERMINO = fecha_termino;
    }
}
