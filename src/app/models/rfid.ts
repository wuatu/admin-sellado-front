export class Rfid {
    id?: number;
    nombre: string;
    ip:string;
    baudRate:string;
    parity:string;
    stopBits:string;
    dataBits:string;
    fk_linea:string;
    constructor(id: number, nombre: string, ip:string, baudRate:string, parity:string, stopBits:string, dataBits:string, fk_linea:string) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.baudRate = baudRate;
        this.parity = parity;
        this.stopBits = stopBits;
        this.dataBits = dataBits; 
        this.fk_linea = fk_linea;
    }
    
}
