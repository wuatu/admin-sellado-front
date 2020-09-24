import { Component, OnInit } from '@angular/core';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { ToastrService } from 'ngx-toastr';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ProduccionPorCalibradorService } from '../../services/produccion-por-calibrador.service';



@Component({
  selector: 'app-produccion-por-calibrador',
  templateUrl: './produccion-por-calibrador.component.html',
  styleUrls: ['./produccion-por-calibrador.component.css']
})
export class ProduccionPorCalibradorComponent implements OnInit {
  //Atributo para contar la cantidad de cajas 
  numBox: number;
  //Atributos para el dropdown de calibrador
  calibradores: any = [];
  cajasCalibrador: any = [];
  selectedCalibradorText: string="Selecciona una calibrador";  
  selectedCalibradorObject:any;
  
  //******************************************/
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;
  dateSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;
  mostrarGrafico: any;


  constructor(
    private toastr: ToastrService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private calibradorService:CalibradorService,
    private produccionPorCalibradorService: ProduccionPorCalibradorService
    ) { }

  ngOnInit() {
    this.listarCalibradores();    
  }

  //metodo que lista las calibradores
  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        console.log(res);
        this.calibradores=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }
  
  imprimirGrafico(){
    console.log("imprimir");
    window.print();
  }

  contarCajasCalibradorPorFecha(){
    //this.produccionSearchNumberBox(this.rutBusqueda, this.desde, this.hasta);
    console.log(this.selectedCalibradorObject.id + "  " +this.desde+ " " + this.hasta);
    this.cajasCalibrador = [];
    this.produccionPorCalibradorService.getLineOfCaliper(this.selectedCalibradorObject.id, this.desde, this.hasta).subscribe(
      res=>{
        //console.log(res);
        this.cajasCalibrador=res;
        this.mostrarGrafico = "true";
        console.log(this.cajasCalibrador);
        this.toastr.success('Operación satisfactoria', 'cajas Obtenidas');
        this.cajasTotales(this.cajasCalibrador);
        this.pushData(this.cajasCalibrador);
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener las cajas del calibrador', 'Oops');
      }
    );

  }

  cajasTotales(cajas: any []){
    this.numBox = 0;
    for(let caja of cajas){
      this.numBox = caja.numero + this.numBox;
    }
  }

  changeSelectedCalibrador(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
    console.log(this.selectedCalibradorObject.nombre);
    console.log(this.desde + this.hasta);
  }

  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString();
    return localISOTime;
  }

  /*********************** CALENDAR ************************************************************************************************************/
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
  /***************************************************************************************************************************************************/

  /************************** GRAFICO ******************************************************************************************************************/
  public lineChartData: ChartDataSets[] = [
    { data: [], label:"Producción Calibrador"}];
  public lineChartLabels: Label[] = [];

  pushData(dataNumberBox: any []){
    this.lineChartData[0].data = [];
    this.lineChartLabels= [];
    for(let data of dataNumberBox){
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
/***************************************************************************************************************************************************/


}
