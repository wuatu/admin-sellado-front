import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Registro } from '../../models/registro';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  registros:any = [];
  pageOfItems: Array<any>;

  p: number = 1;
    
  id_administrador: number;
  nombre_administrador: string = "Juanito";
  apellido_administrador: string = "Aguilar";
  registro: string = "registro del registro 1";
  fecha: string = "2020-09-30";

  constructor(
    private toastr: ToastrService,
    private registroService: RegistroService) 
    {

    }

  ngOnInit() {
    this.listarRegistros();
    //this.agregarRegistro();
  }


  listarRegistros(){
    this.registroService.getRegistros().subscribe(
      res=>{
        this.registros=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }

  agregarRegistro(){
    let x = 1;
    for(let j = 1 ; j<10 ; j++){
      for (let i = 1 ; i<10; i++){
        let registro = new Registro(null, x,this.nombre_administrador+"-"+x, this.apellido_administrador+"-"+x, this.registro+"-"+x, "2020-09-0"+j,"0"+i+":00:00");
        this.registroService.postRegistro(registro).subscribe(
          res=>{
            this.toastr.success('Operación satisfactoria', 'Registro agregado');
          },
          err=>{
            console.log(err);
            this.toastr.error('No se pudo obtener a los registros', 'Oops');
          }
        );
        x++;
      }
    } 
  }
}
