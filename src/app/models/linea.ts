export class Linea {
    id?: string;
    nombre: string;
    fk_selladora:string;
    nombre_selladora?:string
    constructor(id: string, nombre: string, selladora:string) {
        this.id = id;
        this.nombre = nombre;
        this.fk_selladora=selladora;
    }
}
