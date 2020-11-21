import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RegistroDev } from '../../models/registro-dev';
import { RegistroDevService } from '../../services/registro-dev.service';

@Component({
  selector: 'app-registro-dev',
  templateUrl: './registro-dev.component.html',
  styleUrls: ['./registro-dev.component.css']
})
export class RegistroDevComponent implements OnInit {
  
  registrosDev:any = [];
  pageOfItems: Array<any>;
  p: number = 1;
  
  nombre: string;
  registro: string;
  fecha: string;
  hora: string;
  bandera:boolean = false;

  constructor(
    private toastr: ToastrService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarRegistrosDev();
  }

  listarRegistrosDev(){
    this.bandera = false;
    this.registroDevService.getRegistrosDev().subscribe(
      res=>{
        this.registrosDev=res.body;
        if(res.status == 200){
          this.bandera = true;
        }else if(res.status == 204){
          this.toastr.success('no existen registros actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener los registros-dev, método listarRegistrosDev, component registro-dev');
        this.toastr.error('No se pudo obtener a los registros', 'Oops');
      }
    );
  }
}
