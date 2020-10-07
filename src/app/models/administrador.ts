export class Administrador {
    id?: string;
    rut:string;
    nombre: string;
    apellido: string;
    password: string;
    rol: number;
    constructor(id: string, rut: string, nombre: string, apellido: string, password: string, rol: number) {
        this.id = id;
        this.rut = rut;
        this.nombre = nombre;
        this.apellido = apellido;
        this.password = password;
        this.rol = rol;
    }

}
