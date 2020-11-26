export class Caja {
    id?: string;
    codigo_envase: string;
    envase: string;
    descripcion: string;
    ponderacion: number;
    constructor(id: string, codigo_envase: string, envase: string, descripcion: string, ponderacion: number) {
        this.id = id;
        this.codigo_envase = codigo_envase;
        this.envase = envase;
        this.descripcion = descripcion;
        this.ponderacion = ponderacion;
    }
}