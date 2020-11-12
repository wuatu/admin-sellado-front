export class CodigoUnitecExcel {
    cod_caja:string;
    codigo_confection:string;
    confection:string;
    codigo_embalaje:string;
    embalaje:string;
    codigo_envase:string;
    envase:string;
    categoria:string;
    categoria_timbrada:string;
    constructor(cod_caja:string, codigo_confection:string, confection:string, codigo_embalaje: string, embalaje:string,
        codigo_envase:string, envase:string, categoria:string, categoria_timbrada:string){
        this.cod_caja = cod_caja;
        this.codigo_confection = codigo_confection;
        this.confection = confection;
        this.codigo_embalaje = codigo_embalaje;
        this.embalaje = embalaje;
        this.codigo_envase = codigo_envase;
        this.envase = envase;
        this.categoria = categoria;
        this.categoria_timbrada = categoria_timbrada;
    }
}

