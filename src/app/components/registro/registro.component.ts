import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Registro } from '../../models/registro';
import { ToastrService } from 'ngx-toastr';
import { RegistroDevService } from '../../services/registro-dev.service';


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
    private registroService: RegistroService,
    private registroDevService: RegistroDevService) 
    {

    }

  ngOnInit() {
    this.listarRegistros();
  }


  listarRegistros(){
    this.registroService.getRegistros().subscribe(
      res=>{
        this.registros=res.body;
        if(res.status == 200){
          this.toastr.success('registros obtenidos','Operación satisfactoria');
        }else if(res.status == 204){
          this.toastr.success('no existen registros actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err=>{
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudieron obtener los registros, método listarRegistros, component registro');
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }
}
