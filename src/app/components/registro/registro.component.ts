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
    
  /*id_administrador: number;
  nombre_administrador: string = "Juanito";
  apellido_administrador: string = "Aguilar";
  registro: string = "registro del registro";
  fecha: string = "2020-09-11";*/

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
        console.log(res);
        this.registros=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }

  /*agregarRegistro(){
    for (let i = 100 ; i<1000; i++){
      let registro = new Registro(null,i, this.nombre_administrador+"-"+i, this.apellido_administrador+"-"+i, this.registro+"-"+i, this.fecha);
      this.registroService.postRegistro(registro).subscribe(
        res=>{
          //this.toastr.success('Operación satisfactoria', 'Registro agregado');
        },
        err=>{
          console.log(err);
          //this.toastr.error('No se pudo obtener a los registros', 'Oops');
        }
      );
    }
    
  }*/
}
