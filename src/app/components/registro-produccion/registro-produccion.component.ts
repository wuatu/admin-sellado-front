import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegistroProduccionService } from '../../services/registro-produccion.service';
import { RegistroProduccion } from '../../models/registro-produccion';
import { RegistroDevService } from '../../services/registro-dev.service';



@Component({
  selector: 'app-registro-produccion',
  templateUrl: './registro-produccion.component.html',
  styleUrls: ['./registro-produccion.component.css']
})
export class RegistroProduccionComponent implements OnInit {
  registrosProduccion:any = [];
  pageOfItems: Array<any>;
  p: number = 1;
  
  bandera: boolean = false;

  id_colaborador:number;
  nombre_colaborador: string;
  apellido_colaborador: string;
  registro: string;
  fecha: string;
  hora: string;

  constructor(
    private toastr: ToastrService,
    private registroProduccionService: RegistroProduccionService,
    private registroDevService: RegistroDevService

  ) { }

  ngOnInit() {
    this.listarRegistrosProduccion();
  }

  listarRegistrosProduccion(){
    this.bandera = false;
    this.registroProduccionService.getRegistrosProduccion().subscribe(
      res=>{
        this.registrosProduccion=res.body;
        if(res.status == 200){
          this.bandera = true;
        }else if(res.status == 204){
          this.toastr.success('no existen registros actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron Obtener los registros-produccion, método listarRegistroProduccion, component registro-produccion');
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }

}
