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


@Component({
  selector: 'app-produccion-colaborador',
  templateUrl: './produccion-colaborador.component.html',
  styleUrls: ['./produccion-colaborador.component.css']
})
export class ProduccionColaboradorComponent implements OnInit {
  closeResult = '';
  currentSeguimientoSelected: SeguimientoDeCajas;
  pageOfItems: Array<any>;
  nombrexd: string;
  p: number = 1;

  produccionColaborador: any = [];

  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;

  rutBusqueda: string=null;

  dateSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;
  
  
  constructor(private toastr: ToastrService,
    private produccionColaboradorService: ProduccionColaboradorService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal) { }
  
  ngOnInit() {
  }

  /********************************************************************/
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Tamales' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Tortillas' },
    { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Chorizo', yAxisID: 'y-axis-1' }
  ];
  public lineChartLabels: Label[] = ['Enero', 'Febero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre'];

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
  

  public randomize(): void {
    for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        this.lineChartData[i].data[j] = this.generateNumber(i);
      }
    }
    //this.chart.update();
  }

  private generateNumber(i: number) {
    return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
  }

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  

  public pushOne() {
    this.lineChartData.forEach((x, i) => {
      const num = this.generateNumber(i);
      const data: number[] = x.data as number[];
      data.push(num);
    });
    this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
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
  imprimirGrafico(){
    
  }
  exportarArchivoExcel(){

  }

  buscarUsuarioPorRut(){
    console.log(this.rutBusqueda + this.desde + this.hasta);
    this.produccionColaborador = [];
    this.produccionColaboradorService.getProduccionSearch(this.rutBusqueda, this.desde, this.hasta).subscribe(
      res=>{
        console.log(res);
        this.produccionColaborador=res;
        console.log(this.produccionColaborador);
        //this.listarSeguimientoDeCajas();
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener la busqueda de produccion del usuario', 'Oops');
      }
    );
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
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
      this.hasta = formatDate(new Date(this.toDate.year, this.toDate.month-1, this.toDate.day), "yyyy-MM-dd", 'es-CL');

    
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month-1, this.fromDate.day), "yyyy-MM-dd", 'es-CL');
      this.hasta=null;
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

  onSubmitBuscarUsuarioForm(){

  }

  /*****************************************************************/
  /************************** MODAL EDITAR *************************/ 
  /*****************************************************************/



  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto calibrador clickeado a variable global currentLineaSelected
  onEditar(seguimientoDeCajas: SeguimientoDeCajas) {
    this.currentSeguimientoSelected = seguimientoDeCajas;
  }

  //metodo que sirve para editar una linea
  editarCalibrador(form: NgForm) {
    /*if (!form.value.nombre) {
      this.toastr.error('No se pudo editar línea', 'Oops',);
      return;
    }

    let calibrador = new Calibrador(form.value.id, form.value.nombre);
   
    this.calibradorService.updateCalibrador(calibrador.id, calibrador).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Calibrador editada');
        console.log(res);
        this.listarCalibradores();
        this.currentCalibradorSelected = null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo editar calibrador', 'Oops',);
      }
    );*/
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected y abrir el modal
  

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

}
