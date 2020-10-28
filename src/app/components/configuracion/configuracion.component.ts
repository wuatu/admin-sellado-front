import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../../services/configuracion.service';
import { ToastrService } from 'ngx-toastr';
import { Configuracion } from 'src/app/models/configuracion';
import { RegistroDevService } from '../../services/registro-dev.service';
import { RegistroService } from '../../services/registro.service';



@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  maxWaitTime: any = [];
  minute: number;
  constructor(
    private configuracionService: ConfiguracionService,
    private toastr: ToastrService,
    private registroDevService: RegistroDevService,
    private registroService: RegistroService
  ) { }

  ngOnInit() {
    this.getMinute();
  }

  getMinute(){
    if(this.minute == 0){
      this.toastr.error('Ingresar un tiempo mayor a 0', 'Oops');
    }
    console.log("getMinute");
    this.configuracionService.getMaxWaitTime().subscribe(
      res=>{
        console.log(res);
        this.maxWaitTime=res;
        this.toastr.success('Operación satisfactoria', 'Tiempo de espera obtenido');
        this.registroDevService.creaRegistroDev('No se pudo obtener el tiempo en minutos de configuración, método getMinute, component configuración');
      },
      err=>{
        this.toastr.error('No se pudo obtener el tiempo de espera', 'Oops');

      }
    );
  }

  updateMinutes(){
    console.log(this.minute);
    let configuracion = new Configuracion(this.maxWaitTime.id, this.minute);
    console.log(configuracion);
    this.configuracionService.updateMaxWaitTime(configuracion.id, configuracion).subscribe(
      res=>{
        this.toastr.success('Operación satisfactoria', 'Tiempo de espera editado');
        this.registroService.creaRegistro('Se realizo la edición del tiempo de espera a '+this.minute+' minutos');
        
      },
      err=>{
        this.toastr.error('No se pudo obtener editar el tiempo de espera', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo editar el tiempo en minutos de configuración, método updateMinutes, component configuracion');
      }
    );
  }

}
