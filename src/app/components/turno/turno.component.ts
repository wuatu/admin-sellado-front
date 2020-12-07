import { Component, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { TurnoService } from 'src/app/services/turno.service';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import { ExportTurno } from 'src/app/models/export-turno';
import { RegistroDevService } from '../../services/registro-dev.service';

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements OnInit {
  pageOfItems: Array<any>;
  p: number = 1;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  desde: string = "";
  hasta: string = "";
  hoveredDate: NgbDate | null = null;
  turnos: any;
  selectedfromDate: string = "";
  selectedToDate: string = "";
  exportTurnoArray: any = [];
  nombreExcel = 'Turnos';
  mostrar:any = false;

  constructor(
    private authService: AuthService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private turnoService: TurnoService,
    private toastr: ToastrService,
    private registroDevService: RegistroDevService
    ) {

    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }

  ngOnInit() {
    this.listarTurnos();
  }

  captureDates() {
    const fromYear = this.fromDate.year;
    const fromMonth = this.fromDate.month;
    const fromDay = this.fromDate.day;      

    if ((fromMonth > 0 && fromMonth < 10) && (fromDay > 0 && fromDay < 10)) {
      this.selectedfromDate = fromYear + "-0" + fromMonth + "-0" + fromDay;
    }
    else if (fromMonth > 0 && fromMonth < 10) {
      this.selectedfromDate = fromYear + "-0" + fromMonth + "-" + fromDay;
    }
    else if (fromDay > 0 && fromDay < 10) {
      this.selectedfromDate = fromYear + "-" + fromMonth + "-0" + fromDay;
    }
    else {
      this.selectedfromDate = fromYear + "-" + fromMonth + "-" + fromDay;
    }

    if(this.toDate!=null){
      const toYear = this.toDate.year;
      const toMonth = this.toDate.month;
      const toDay = this.toDate.day;

      if ((toMonth > 0 && toMonth < 10) && (toDay > 0 && toDay < 10)) {
        this.selectedToDate = toYear + "-0" + toMonth + "-0" + toDay;
      }
      else if (toMonth > 0 && toMonth < 10) {
        this.selectedToDate = toYear + "-0" + toMonth + "-" + toDay;
      }
      else if (toDay > 0 && toDay < 10) {
        this.selectedToDate = toYear + "-" + toMonth + "-0" + toDay;
      }
      else {
        this.selectedToDate = toYear + "-" + toMonth + "-" + toDay;
      }
    }

    
  }

  //metodo que trae todos los registros de lineas desde la base de datos
  listarTurnos() {
    
    this.exportTurnoArray = [];
    this.captureDates();
    this.turnoService.getTurnos(this.selectedfromDate, this.selectedToDate).subscribe(
      res => {
        //los registros se almacena en array calibradores que sirve para llenar la tabla de vista lineas
        this.turnos = res.body;
        if(res.status == 200){

        }else if(res.status == 204){
          this.toastr.success('No existen registros de turnos actualmente para mostrar','Operación satisfactoria');
          return;
        }
        this.mostrar = true;
        let id = 0;
        //Se crea un objeto de la clase export-turno con la información devuelta de la base de datos 
        for (let element of this.turnos) {
          id = id + 1;
          let exportTurno = new ExportTurno(id,
            element.fecha_apertura,
            element.hora_apertura,
            element.id_administrador_apertura,
            element.nombre_administrador_apertura,
            element.apellido_administrador_apertura,
            element.fecha_cierre,
            element.hora_cierre,
            element.id_administrador_cierre,
            element.nombre_administrador_cierre,
            element.apellido_administrador_cierre,
            element.nombre_calibrador);

          this.exportTurnoArray.push(exportTurno);
        }
      },
      err => {
        
        if (err.status != 404) {
          this.registroDevService.creaRegistroDev('No se pudieron obtener los turnos, método listarTurnos, component turno');
          this.toastr.error('No se pudo listar turnos', 'Oops');
        } else {
          this.turnos = null;
        }
      }
    )
  }

  //calendar
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  exportarArchivoExcel() {
    try {
      if(this.exportTurnoArray.length > 50000){
        let array: any [];
        let i = 0;
        let j = 50000;
        let cont = 1;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        while(i < this.exportTurnoArray.length){
          array = this.exportTurnoArray.slice(i,j);
          // Se convierte el arreglo con los usuarios en linea 
          var jsonArray = JSON.parse(JSON.stringify(array));
          //se convierte el Json a xlsx en formato workSheet
          const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(jsonArray);
          /* genera el workbook y agrega el worksheet */
          XLSX.utils.book_append_sheet(wb, ws, 'Producción de linea '+ cont);
          i = j;
          if(j+50000<this.exportTurnoArray.length){
            j = j + 50000;
          }else{
            j = this.exportTurnoArray.length;
          }
          cont ++; 
        }
        /* Guarda el archivo */
        let fecha = (new Date()).toISOString();
        XLSX.writeFile(wb, this.nombreExcel +"_"+fecha.substring(0,10) + ".xls");
      }else{
        
        // Se convierte el arreglo con los usuarios en linea 
         var jsonArray = JSON.parse(JSON.stringify(this.exportTurnoArray))
          
         console.log(jsonArray);
         //se convierte el Json a xlsx en formato workSheet
         const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(jsonArray);
    
         /* genera el workbook y agrega el worksheet */
         const wb: XLSX.WorkBook = XLSX.utils.book_new();
         XLSX.utils.book_append_sheet(wb, ws, 'Producción de calibrador');
    
         /* Guarda el archivo */
         let fecha = (new Date()).toISOString();
         XLSX.writeFile(wb, this.nombreExcel +"_"+fecha.substring(0,10) + ".xls");
      }
    } catch (error) {
      this.registroDevService.creaRegistroDev('No se pudo exportar los turnos al archivo excel, método exportarArchivoExcel, component turno');
    }
    
  }

  buscarPorFecha() {
    this.listarTurnos();
  }
}