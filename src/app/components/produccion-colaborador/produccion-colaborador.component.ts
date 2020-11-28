import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ProduccionColaboradorService } from '../../services/produccion-colaborador.service';
import { SeguimientoDeCajas } from '../../models/seguimiento-de-cajas';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { ProduccionColaboradorExcel } from '../../models/produccion-colaborador-excel';

import * as XLSX from 'xlsx';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';




@Component({
  selector: 'app-produccion-colaborador',
  templateUrl: './produccion-colaborador.component.html',
  styleUrls: ['./produccion-colaborador.component.css']
})
export class ProduccionColaboradorComponent implements OnInit {
  closeResult = '';
  currentSeguimientoSelected: SeguimientoDeCajas;
  numBox: number;
  pageOfItems: Array<any>;
  p: number = 1;

  verificado: number;
  a_tiempo: number;

  produccionColaborador: any = [];
  produccionNumberBoxByType: any = [];
  produccionNumberBoxByTypeExport: any = [];
  produccionColaboradorNumberBox: any = [];
  produccionColaboradorExportarExcel: any = [];
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = " ";
  hasta: string = " ";
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;

  rutBusqueda: string = null;

  dateSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;

  nombreExcel = 'Produccion_Colaborador';
  nombre: any;
  apellido: any;

  // Array para el dropdown del selector de si o no
  dropDownVerified: any[] = [{ opcion: 'si' }, { opcion: 'no' }];
  SearchTextVerified: string = "Seleccionar opción";
  selectedOptionVerified: string = null;

  dropDownToTime: any[] = [{ opcion: 'si' }, { opcion: 'no' }];
  SearchTextToTime: string = "Seleccionar opción";
  selectedOptionToTime: string = null;
  rol: number;

  constructor(
    private toastr: ToastrService,
    private produccionColaboradorService: ProduccionColaboradorService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
    this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "yyyy-MM-dd", 'en-US');
  }

  ngOnInit() {
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: " + this.rol);
  }

  changeSelectedVerified(newSelected: any) {
    this.SearchTextVerified = newSelected.opcion;
    this.selectedOptionVerified = this.SearchTextVerified;
    console.log(this.selectedOptionVerified);
  }

  changeSelectedToTime(newSelected: any) {
    this.SearchTextToTime = newSelected.opcion;
    this.selectedOptionToTime = this.SearchTextToTime;
    console.log(this.selectedOptionToTime);
  }

  imprimirGrafico() {
    window.print();
  }
  buscarUsuarioPorRut() {
    if (this.rutBusqueda == null || this.desde == " " || this.hasta == " ") {
      this.toastr.error('se debe ingresar rut y fecha.', 'Oops');
      return;
    }

    console.log(this.rutBusqueda + this.desde + this.hasta);
    this.produccionColaborador = [];
    this.produccionColaboradorExportarExcel = [];
    this.produccionColaboradorService.getProduccionSearch(this.rutBusqueda, this.desde, this.hasta).subscribe(
      res => {
        //console.log(res);
        this.produccionColaborador = res.body;
        if (res.status == 200) {
        } else if (res.status == 204) {
          this.toastr.success('Colaborador no existe o no hay producción para mostrar', 'Operación satisfactoria');
          return;
        }
        //console.log(this.produccionColaborador);
        var bandera = 0;
        var newVerificado;
        var newIsTime;
        for (let element of this.produccionColaborador) {
          if (element.is_verificado) {
            newVerificado = "si";
          } else {
            newVerificado = "no";
          }
          if (element.is_before_time) {
            newIsTime = "si";
          } else {
            newIsTime = "no";
          }
          let exportExcelProduccion = new ProduccionColaboradorExcel(element.codigo_de_barra, element.envase_caja, element.nombre_linea, element.nombre_lector, element.ip_lector, element.nombre_usuario, element.apellido_usuario, element.rut_usuario, element.fecha_sellado, element.hora_sellado, newVerificado, newIsTime);
          this.produccionColaboradorExportarExcel.push(exportExcelProduccion);
          if (bandera == 0) {
            this.nombre = element.nombre_usuario;
            this.apellido = element.apellido_usuario;
            bandera = 1;
            // console.log("CAMBIE BANDERA");
          }
        }


        if (this.produccionColaborador.length == 0) {
          this.produccionColaboradorExportarExcel = null;
        }
      },
      err => {
        //console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo obtener la producción del usuario, método buscarUsuarioPorRut, component produccion-colaborador');
        this.toastr.error('No se pudo obtener la busqueda de produccion del usuario', 'Oops');
      }
    );
  }
  produccionSearchNumberBox() {
    this.produccionColaboradorNumberBox = [];
    this.produccionColaboradorService.getProduccionSearchNumberBox(this.rutBusqueda, this.desde, this.hasta).subscribe(
      res => {
        this.produccionColaboradorNumberBox = res;
        this.pushData(this.produccionColaboradorNumberBox);
        this.cajasTotales(this.produccionColaboradorNumberBox);
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener la producción del colaborador, método produccionSearchNumberBox, component produccion-colaborador');
      }
    );
  }
  searchNumberBoxByType() {
    this.produccionNumberBoxByType = [];
    this.produccionColaboradorService.getNumberBoxByType(this.rutBusqueda, this.desde, this.hasta).subscribe(
      res => {
        this.produccionNumberBoxByType = res;
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo obtener la producción del usuario por tipo de caja, método searchNumberBoxByType, component produccion-colaborador');
      }
    );
  }

  exportarArchivoExcel() {
    try {
      this.produccionNumberBoxByTypeExport = this.produccionNumberBoxByType.slice();
      if (this.produccionColaboradorExportarExcel.length > 50000) {
        let array: any[];
        let i = 0;
        let j = 50000;
        let cont = 1;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        while (i < this.produccionColaboradorExportarExcel.length) {
          array = this.produccionColaboradorExportarExcel.slice(i, j);
          // Se convierte el arreglo con los usuarios en linea 
          var jsonArray = JSON.parse(JSON.stringify(array));
          //se convierte el Json a xlsx en formato workSheet
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);
          /* genera el workbook y agrega el worksheet */
          XLSX.utils.book_append_sheet(wb, ws, 'Producción de linea ' + cont);
          i = j;
          if (j + 50000 < this.produccionColaboradorExportarExcel.length) {
            j = j + 50000;
          } else {
            j = this.produccionColaboradorExportarExcel.length;
          }
          cont++;
        }
        //página de cantidad de cajas por tipo de envase
        //let cajas: any = { "ENVASE": "Cajas Totales", "CANTIDAD": this.numBox };
        //this.produccionNumberBoxByTypeExport.push(cajas);
        var jsonArray2 = JSON.parse(JSON.stringify(this.produccionNumberBoxByTypeExport));
        const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Producción por tipos de envases');
        
        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, this.nombreExcel + "_" + this.rutBusqueda + "_" + dateDownload.substring(0, 10) + ".xls");
      } else {

        // Se convierte el arreglo con los usuarios en linea 
        var jsonArray = JSON.parse(JSON.stringify(this.produccionColaboradorExportarExcel))

        console.log(jsonArray);
        //se convierte el Json a xlsx en formato workSheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);

        /* genera el workbook y agrega el worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Producción de calibrador');

        //página de cantidad de cajas por tipo de envase
        let cajas: any = { "ENVASE": "Cajas Totales", "CANTIDAD": this.numBox };
        this.produccionNumberBoxByTypeExport.push(cajas);
        var jsonArray2 = JSON.parse(JSON.stringify(this.produccionNumberBoxByTypeExport));
        const ws2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray2);
        XLSX.utils.book_append_sheet(wb, ws2, 'Producción por tipos de envases');
        
        /* Guarda el archivo */
        let dateDownload: string = new Date().toISOString();
        XLSX.writeFile(wb, this.nombreExcel + "_" + this.rutBusqueda + "_" + dateDownload.substring(0, 10) + ".xls");
      
      }
    } catch (error) {
      this.registroDevService.creaRegistroDev('No se pudo exportar la producción al archivo excel, método exportarArchivoExcel, component monitoreo-por-linea');
    }
  }

  cajasTotales(cajas: any[]) {
    this.numBox = 0;
    for (let caja of cajas) {
      this.numBox = caja.numero + this.numBox;
    }
  }

  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime;
  }

  //calendar
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      //const dateStringAux:string=(this.fromDate.year+"-"+(this.fromDate.month-1)+"-"+this.fromDate.day);
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month - 1, this.toDate.day), "yyyy-MM-dd", 'es-CL');


    } else {
      this.toDate = null;
      this.fromDate = date;
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
      this.hasta = null;
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


  /*****************************************************************/
  /************************** MODAL EDITAR *************************/
  /*****************************************************************/



  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto calibrador clickeado a variable global currentLineaSelected
  onEditar(seguimientoDeCajas: SeguimientoDeCajas) {
    this.currentSeguimientoSelected = seguimientoDeCajas;
    if (this.currentSeguimientoSelected.is_verificado) {
      this.SearchTextVerified = "si";
      this.selectedOptionVerified = "si";
    } else {
      this.SearchTextVerified = "no";
      this.selectedOptionVerified = "no";
    }
    if (this.currentSeguimientoSelected.is_before_time) {
      this.SearchTextToTime = "si";
      this.selectedOptionToTime = "si";
    } else {
      this.SearchTextToTime = "no";
      this.selectedOptionToTime = "no";
    }
  }

  //metodo que sirve para editar una linea
  editarRegistroProduccion(form: NgForm) {

    this.SearchTextToTime = "Seleccionar opción";
    if (this.selectedOptionVerified == null || this.selectedOptionToTime == null) {
      return;
    }
    //console.log("Verificado nuevo : "+ this.verificado + " a tiempo : "+ this.a_tiempo);
    if (this.selectedOptionVerified == "si") {
      this.verificado = 1;
    } else {
      this.verificado = 0;
    }
    if (this.selectedOptionToTime == "si") {
      this.a_tiempo = 1;
    } else {
      this.a_tiempo = 0;
    }
    //this.SearchTextVerified = "Seleccionar opción";  
    //this.SearchTextToTime = "Seleccionar opción";
    if (this.verificado != this.currentSeguimientoSelected.is_verificado || this.a_tiempo != this.currentSeguimientoSelected.is_before_time) {
      let registroProduccionColaborador = new SeguimientoDeCajas(form.value.id, this.currentSeguimientoSelected.id_calibrador, this.currentSeguimientoSelected.nombre_calibrador, this.currentSeguimientoSelected.id_linea, this.currentSeguimientoSelected.nombre_linea, this.currentSeguimientoSelected.id_rfid, this.currentSeguimientoSelected.nombre_rfid, this.currentSeguimientoSelected.ip_rfid, this.currentSeguimientoSelected.id_lector, this.currentSeguimientoSelected.nombre_lector, this.currentSeguimientoSelected.ip_lector, this.currentSeguimientoSelected.id_usuario, this.currentSeguimientoSelected.rut_usuario, this.currentSeguimientoSelected.nombre_usuario, this.currentSeguimientoSelected.apellido_usuario, this.currentSeguimientoSelected.codigo_de_barra, this.currentSeguimientoSelected.id_caja, this.currentSeguimientoSelected.envase_caja, this.currentSeguimientoSelected.variedad_caja, this.currentSeguimientoSelected.categoria_caja, this.currentSeguimientoSelected.calibre_caja, this.currentSeguimientoSelected.correlativo_caja, this.currentSeguimientoSelected.ponderacion_caja, this.currentSeguimientoSelected.fecha_sellado, this.currentSeguimientoSelected.hora_sellado, this.currentSeguimientoSelected.fecha_validacion, this.currentSeguimientoSelected.hora_validacion,this.currentSeguimientoSelected.fecha_validacion_time ,this.verificado, this.a_tiempo, this.currentSeguimientoSelected.id_apertura_cierre_de_turno);
      this.produccionColaboradorService.updateRegistroProduccionUsuario(registroProduccionColaborador.id, registroProduccionColaborador).subscribe(
        res => {
          this.registroService.creaRegistro("Se ha editado un registro de caja sellada, id registro: " + registroProduccionColaborador.id);
          this.buscarUsuarioPorRut();
          this.currentSeguimientoSelected = null;
        },
        err => {
          console.log(err);
          this.registroDevService.creaRegistroDev('No se pudo editar el registro de produccion, método editarRegistroProduccion, component produccion-colaborador');
          this.toastr.error('No se pudo editar registro', 'Oops',);
        }
      );
    } else {
      this.toastr.error('Los valores seleccionados ya estan registrados', 'Oops',);
    }
  }




  //metodo que abre un modal
  open(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //metodo que sirve para saber la razon por la cual un modal fue cerrado
  private getDismissReason(reason: any): string {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        console.log("hola");
      }
      return `with: ${reason}`;
    }
  }

  /*****************************************************************/
  /*****************************************************************/


  /********************************************************************/


  public lineChartData: ChartDataSets[] = [
    { data: [], label: "Producción Colaborador" }];
  public lineChartLabels: Label[] = [];

  pushData(dataNumberBox: any[]) {
    this.lineChartData[0].data = [];
    this.lineChartLabels = [];
    for (let data of dataNumberBox) {
      this.lineChartData[0].data.push(data.numero);
      this.lineChartLabels.push(`${data.fecha_sellado}`);
    }
  }



  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // red
      backgroundColor: 'rgba(255,0,0,0.3)',
      borderColor: 'red',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public changeColor() {
    this.lineChartColors[2].borderColor = 'green';
    this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
  }

  public changeLabel() {
    this.lineChartLabels[2] = ['1st Line', '2nd Line'];
    // this.chart.update();
  }
  /************************************************************************************************/
  /************************************************************************************************/


}
