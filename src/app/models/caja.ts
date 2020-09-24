export class Caja {
    id?:string;
    envase:string;
    variedad:string; 
    categoria:string; 
    calibre:string; 
    correlativo:string; 
    ponderacion:string;     
    constructor(id:string,envase:string,variedad:string,categoria:string,calibre:string,correlativo:string,ponderacion:string){
        this.id=id;
        this.envase=envase;  
        this.variedad=variedad;  
        this.categoria=categoria;  
        this.calibre=calibre;  
        this.correlativo=correlativo;  
        this.ponderacion=ponderacion;       
    }
}