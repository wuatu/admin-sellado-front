export class RfidRegistroColaborador {
    id?: number;
    nombre: string;
    ip:string;
    baudRate:string;
    parity:string;
    stopBits:string;
    dataBits:string;
    constructor(id: number, nombre: string, ip:string, baudRate:string, parity:string, stopBits:string, dataBits:string) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.baudRate = baudRate;
        this.parity = parity;
        this.stopBits = stopBits;
        this.dataBits = dataBits; 
    }
    
}

