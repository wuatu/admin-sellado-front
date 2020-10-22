import { max } from 'rxjs/operators';

export class LectorValidador {
    id?: number;
    nombre: string;
    ip:string;
    max_wait_time:string;
    fk_calibrador:number;
    constructor(id: number, nombre: string, ip:string, max_wait_time:string, fk_calibrador:number) {
        this.id = id;
        this.nombre = nombre;
        this.ip = ip;
        this.max_wait_time = max_wait_time;
        this.fk_calibrador = fk_calibrador;
    }
}
