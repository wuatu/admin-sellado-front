export class Calibrador {
    id?: string;
    nombre: string;
    cajas_por_minuto: number;
    constructor(id: string, nombre: string, cajas_por_minuto: number) {
        this.id = id;
        this.nombre = nombre;
        this.cajas_por_minuto = cajas_por_minuto;
    }
}
