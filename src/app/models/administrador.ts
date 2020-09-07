export class Administrador {
    id?: string;
    rut:string;
    nombre: string;
    apellido: string;
    password: string;
    superAdmin: boolean;
    constructor(id: string, rut: string, nombre: string, apellido: string, password: string) {
        this.id=id;
        this.rut=rut;
        this.nombre = nombre;
        this.apellido=apellido;
        this.password=password;
    }

}
