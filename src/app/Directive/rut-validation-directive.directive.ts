import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[rutValidation]',
  providers: [{ provide: NG_VALIDATORS, useExisting: RutValidationDirective, multi: true }]
})
export class RutValidationDirective implements Validator {
  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {
    const duenoRut = <string>control.value;
    if (!!duenoRut) {

      // -1 si no se encuentra en la cadena. 
      if (duenoRut.indexOf("-") === -1) {
        return { 'rutValidation': { 'message': 'Ingrese RUN sin puntos y con guión' } };

      } 
      // 0 si se encuentra en la cadena.
      else if(duenoRut.indexOf(".") == 0){
        return { 'rutValidation': { 'message': 'Ingrese RUN sin puntos y con guión' } };

      }else {
        // Despejar Guión
        let valor = duenoRut.replace('-', '');
        let valor2 = valor;
        // Aislar Cuerpo y Dígito Verificador
        let cuerpo = valor.slice(0, -1);
        let dv = valor.slice(-1).toUpperCase();
        if (cuerpo.length < 7) {
          return { 'rutValidation': { 'message': 'Ingrese RUN sin puntos y con guión' } };
        }else{
          // Calcular Dígito Verificador "Método del Módulo 11"
          let suma = 0;
          let multiplo = 2;
          
          // Para cada dígito del Cuerpo
          for (let i = 1; i <=cuerpo.length; i++) {
            
            // Obtener su Producto con el Múltiplo Correspondiente
            let index = multiplo * parseInt(valor.charAt(cuerpo.length - i));
        
            // Sumar al Contador General
            suma = suma + index;
        
            // Consolidar Múltiplo dentro del rango [2,7]
            if (multiplo < 7) {
              multiplo = multiplo + 1;
            } else {
              multiplo = 2;
            }
          }
        
          // Calcular Dígito Verificador en base al Módulo 11
          let dvEsperado = 11 - (suma % 11);
        
          // Casos Especiales (0 y K)
          if(dv == "k" || dv == "K"){
            dv = "10";
          }else if(dv == "0"){
            dv = "11";
          }

          if (dvEsperado != parseInt(dv) ) {
            return { 'rutValidation': { 'message': 'El RUN ingresado es incorrecto' } };
          }else{
            //console.log("EL rut ingresado es correcto");
          }
          

        }    
      }
      
    }
    return null;
  }

  
  constructor() { }

}
