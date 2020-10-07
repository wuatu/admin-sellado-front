export interface JwtResponse {
    dataUser:{
        id:number,
        rut:string,
        nombre:string,
        apellido:string,
        rol:number,
        accessToken:string,
        expiresIn:string
    }
}
