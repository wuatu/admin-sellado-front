import { Component, OnInit } from '@angular/core';
import { Caja } from 'src/app/models/caja';
import { ToastrService } from 'ngx-toastr';
import { CodigoUnitecService } from '../../services/codigo-unitec.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import * as XLSX from 'xlsx';
import { CodigoUnitecExcel } from '../../models/codigo-unitec-excel';


@Component({
  selector: 'app-codigo.unitec',
  templateUrl: './codigo-unitec.component.html',
  styleUrls: ['./codigo-unitec.component.css']
})
export class CodigoUnitecComponent implements OnInit {
  registrosDev:any = [];
  pageOfItems: Array<any>;
  p: number = 1;

  closeResult = '';
  currentCajaSelected: Caja;
  codigosUnitec: any = [];
  codigosUnitecExportarExcel: any = [];
  resultSearch: any;
  id: string;
  envaseCaja: string;
  variedadCaja: string;
  categoriaCaja: string;
  calibreCaja: string;
  correlativoCaja: string;
  ponderacionCaja: number;
  rol: number;
  criterio:string = null;
  bandera:boolean = false;

  constructor(
    private codigoUnitecService: CodigoUnitecService,
    private toastr: ToastrService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarCodigosUnitec();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: "+this.rol);
  }

  searchCodigoUnitec(){
   
    if(this.criterio == null){
      this.toastr.error('Ingrese un código a buscar','Oops');
      return;
    }
    this.bandera = false;
    console.log("el criterio de búsqueda es :"+this.criterio);
    this.codigoUnitecService.searchCodeUnitec(this.criterio).subscribe(
      res =>{
        if(res.status == 200){
          console.log("resultado búsqueda : "+ res.body);
          this.codigosUnitec = null;
          this.codigosUnitec = res.body;
          this.bandera = true;
          
          this.toastr.success('Codigos unitec obtenidos','Búsqueda satisfactoria');
        }else if(res.status == 204){
          this.toastr.success('No existen registros para mostrar en la búsqueda','Búsqueda satisfactoria');
          return;  
        }
      },
    err =>{
      this.registroDevService.creaRegistroDev('No se pudo realizar la búsqueda de códigos unitec, método searchCodigoUnitec, component codigo-unitec');
    }
    )
  }

  //metodo que trae todos los registros de cajas desde la base de datos
  listarCodigosUnitec() {
    this.bandera = false;
    this.codigoUnitecService.getCodigoUnitec().subscribe(
      res => {
        //los registros se almacena en array cajas que sirve para llenar la tabla de vista cajas
        this.codigosUnitec = res.body;
        if(res.status == 200){
          this.bandera = true;
          this.toastr.success('Cajas unitec obtenidas','Operación satisfactoria');

          for (let element of this.codigosUnitec) {
            
            let codigoUnitecExcel = new CodigoUnitecExcel(element.cod_caja, element.codigo_confection, element.confection, element.codigo_embalaje, element.embalaje, element.codigo_envase, element.envase, element.categoria, element.categoria_timbrada);
            this.codigosUnitecExportarExcel.push(codigoUnitecExcel);
          }
          if (this.codigosUnitec.length == 0) {
            this.codigosUnitecExportarExcel = null;
          }

        }else if(res.status == 204){
          this.toastr.success('No existen registros de cajas actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        if(err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar cajas', 'Oops');
          this.registroDevService.creaRegistroDev('No se pudo obtener la lista de cajas, método listarCajas, component caja');
        } else {
          this.codigosUnitec = null;
        }
      }
    )
  }

  exportarArchivoExcel() {
    try {
      if (this.codigosUnitecExportarExcel.length > 50000) {
        let array: any[];
        let i = 0;
        let j = 50000;
        let cont = 1;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        while (i < this.codigosUnitecExportarExcel.length) {
          array = this.codigosUnitecExportarExcel.slice(i, j);
          // Se convierte el arreglo con los usuarios en linea 
          var jsonArray = JSON.parse(JSON.stringify(array));
          //se convierte el Json a xlsx en formato workSheet
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);
          /* genera el workbook y agrega el worksheet */
          XLSX.utils.book_append_sheet(wb, ws, 'Producción de calibrador ' + cont);
          i = j;
          if (j + 50000 < this.codigosUnitecExportarExcel.length) {
            j = j + 50000;
          } else {
            j = this.codigosUnitecExportarExcel.length;

          }
          cont++;
          console.log("ayuda !!! estoy iterando!! no puedo parar!!!")
        }
        console.log("sali del while");
        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, "cajas_unitec" + "_" + dateDownload.substring(0, 10) + ".xls");
        console.log("guarde recien la wea!!");
      } else {
        console.log("tamaño del array : " + this.codigosUnitecExportarExcel.size);
        // Se convierte el arreglo con los usuarios en linea 
        var jsonArray = JSON.parse(JSON.stringify(this.codigosUnitecExportarExcel))

        console.log(jsonArray);
        //se convierte el Json a xlsx en formato workSheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);

        /* genera el workbook y agrega el worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cajas Unitec');

        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, "cajas_unitec" + "_" + dateDownload.substring(0, 10) + ".xls");
      }


    } catch (error) {
      this.registroDevService.creaRegistroDev('No se pudieron exportar las cajas unitec, método exportarArchivoExcel, component codigo-unitec');
    }
  }

  
}
