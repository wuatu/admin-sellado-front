export class ProduccionColaboradorExcel {
    CODIGO_DE_BARRA: string;
    ENVASE: string;
    LINEA: string;
    LECTOR: string;
    PUERTO: string;
    NOMBRE: string;
    APELLIDO: string;
    RUT:string;
    FECHA: string;
    HORA: string;
    VERIFICADO: string;
    A_TIEMPO: string;

    constructor(codigo_de_barra: string, envase: string,linea: string, lector: string, puerto: string, nombre: string,
        apellido:string, rut:string, fecha: string, hora: string,verificado: string, a_tiempo: string ){
        this.CODIGO_DE_BARRA = codigo_de_barra;
        this.ENVASE = envase;
        this.LINEA = linea;
        this.LECTOR = lector;
        this.PUERTO = puerto;
        this.NOMBRE = nombre;
        this.APELLIDO = apellido;
        this.RUT = rut;
        this.FECHA = fecha;
        this.HORA = hora;
        this.VERIFICADO = verificado;
        this.A_TIEMPO = a_tiempo;

    }
}
