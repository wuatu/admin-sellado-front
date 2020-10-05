export class Configuracion {
    id?: number;
    max_wait_time: number;    
    constructor(id: number, max_wait_time: number){
        this.id = id;
        this.max_wait_time = max_wait_time;        
    }
}
