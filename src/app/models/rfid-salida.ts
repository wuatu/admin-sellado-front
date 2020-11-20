export class RfidSalida {
    id?: number;
    nombre: string;
    ip:string;
    baudRate:string;
    parity:string;
    stopBits:string;
    dataBits:string;
    fk_calibrador:string;
    constructor(id: number, nombre: string, ip:string, baudRate:string, parity:string, stopBits:string, dataBits:string, fk_calibrador:string) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.baudRate = baudRate;
        this.parity = parity;
        this.stopBits = stopBits;
        this.dataBits = dataBits; 
        this.fk_calibrador = fk_calibrador;
    }
    
}
