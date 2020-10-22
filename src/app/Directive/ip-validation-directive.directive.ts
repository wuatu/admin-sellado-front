import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator } from '@angular/forms';

@Directive({
  selector: '[ipValidation]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ipValidationDirective, multi: true }]
})
export class ipValidationDirective implements Validator {
  validate(control: import("@angular/forms").AbstractControl): import("@angular/forms").ValidationErrors {
    const ip = <string>control.value;

    if (!!ip) {
      console.log("CONSOLE!!!"+ ip);
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip))
      {
        console.log("IP VALIDA");
      }else{
        return { 'ipValidation': { 'message': 'Ingrese ip con formato correcto xxx.xxx.xxx.xxx' } };
      }
      
    }
    return null;
  }

  
  constructor() { }

}
