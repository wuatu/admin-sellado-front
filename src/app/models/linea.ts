export class Linea {
    id?: string;
    nombre: string;
    fk_calibrador:string;
    nombre_calibrador?:string
    constructor(id: string, nombre: string, calibrador:string) {
        this.id = id;
        this.nombre = nombre;
        this.fk_calibrador=calibrador;
    }
}
