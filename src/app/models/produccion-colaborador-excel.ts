export class ProduccionColaboradorExcel {
    CODIGO_DE_BARRA: string;
    LINEA: string;
    LECTOR: string;
    PUERTO: string;
    NOMBRE: string;
    APELLIDO: string;
    FECHA: string;
    VERIFICADO: string;
    A_TIEMPO: string;

    constructor(codigo_de_barra: string, linea: string, lector: string, puerto: string, nombre: string,
        apellido:string, fecha: string, verificado: string, a_tiempo: string ){
        this.CODIGO_DE_BARRA = codigo_de_barra;
        this.LINEA = linea;
        this.LECTOR = lector;
        this.PUERTO = puerto;
        this.NOMBRE = nombre;
        this.APELLIDO = apellido;
        this.FECHA = fecha;
        this.VERIFICADO = verificado;
        this.A_TIEMPO = a_tiempo;

    }
}
