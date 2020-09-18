import { Component, OnInit } from '@angular/core';
import { CajaService } from 'src/app/services/caja.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {

  cajas: any;

  constructor(
    private cajaService: CajaService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.listarCajas();
  }

  //metodo que trae todos los registros de lineas desde la base de datos
  listarCajas() {  
    this.cajaService.getCajas().subscribe(
      res => {
        //los registros se almacena en array calibradores que sirve para llenar la tabla de vista lineas
        this.cajas = res;
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar calibradores', 'Oops');
        } else{
          this.cajas=null;
        }
      }
    )
  }

}
