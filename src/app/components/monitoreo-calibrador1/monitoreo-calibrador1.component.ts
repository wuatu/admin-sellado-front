import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AdministradorService } from 'src/app/services/administrador.service';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/models/turno';
import { RegistroService } from '../../services/registro.service';
import { CalibradorService } from '../../services/calibrador.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { MonitoreoCalibradoresService } from '../../services/monitoreo-calibradores.service';

// GRAFICO
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { LineaService } from 'src/app/services/linea.service';

//*****/


@Component({
  selector: 'app-monitoreo-calibrador1',
  templateUrl: './monitoreo-calibrador1.component.html',
  styleUrls: ['./monitoreo-calibrador1.component.css']
})
export class MonitoreoCalibrador1Component implements OnInit {
  time = new Date();
  
  calibradores: any = [];
  lineas: any = [];

  cajasCalibrador1Turno: any = [];
  cajasCalibrador1Hora: any = [];
  cajasCalibrador1Minuto: any = [];

  totalTurno1: number = 0;
  totalHora1: number = 0;
  totalMinuto1: number = 0;

  fechaActual: string;
  
  turnoActual: any = [];
  productionByLine: any = [];
  
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  nombreCalibrador: string="";

  


  constructor(
    private toastr: ToastrService,
    private administradorService: AdministradorService,
    private turnoService: TurnoService,
    private registroService: RegistroService,
    private authService: AuthService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private calibradorService: CalibradorService,
    private monitoreoService: MonitoreoService,
    private lineaService: LineaService,
    private monitoreoCalibradoresService: MonitoreoCalibradoresService,
  
    ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {

    //Lista los calibradores que estan registrados en la base de datos.
    this.getTurnoActual();
    

    setInterval(() => {
      this.time = new Date();
    }, 1000);
  }
  
  

  //metodo que lista las calibradores
  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        this.calibradores=res;
        
        this.getLineOfCaliper();
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }
  
  getLineOfCaliper(){
    this.lineaService.getLineasId(this.calibradores[0].id).subscribe(
      res =>{
        this.lineas = res;
        console.log("carga de lineas satisfactoria");
        console.log(this.lineas);
        this.getProduccionTurno();
        this.getAverageforMinute();
        this.getAverageLastHour();
        this.getProductionLine();
        
      },
      err =>{
        console.log("No se pudieron cargar las lineas del calibrador!!!!");
      }
    )
  }
  getProductionLine(){
    this.fechaActual = this.fecha().substring(0,10);
    if(this.fechaActual == this.turnoActual[0].fecha_apertura){
      for(let linea of this.lineas){
        this.monitoreoCalibradoresService.getProductionLine(this.calibradores[0].id, linea.id, linea.nombre, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '1').subscribe(
          res =>{
            this.productionByLine.push(res);
            console.log("se obtuvo la producción de la linea");
            console.log(this.productionByLine);
            this.pushData(this.productionByLine);
          },
          err =>{
            console.log("no se obtuvo la producción de la linea ");
          }
        )
      }
      console.log("resultado despues del for => ");
      console.log(this.productionByLine);
    }else if(this.fechaActual != this.turnoActual[0].fecha_apertura){
      for(let linea of this.lineas){
        this.monitoreoCalibradoresService.getProductionLine(this.calibradores[0].id,linea.id, linea.nombre,this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '2').subscribe(
          res =>{
            this.productionByLine.push(res);
            console.log("se obtuvo la producción de la linea");
            this.pushData(this.productionByLine);
          },
          err =>{
            console.log("no se obtuvo la producción de la linea ");
          }
        )
      }
    }
  }

  getTurnoActual(){
    this.monitoreoService.getGetLastTurno().subscribe(
      res => {
        console.log("turno cargado");
        this.turnoActual = res;
        console.log("Turno actual"+this.turnoActual);
        this.listarCalibradores();
        
      },
      err => {
        console.log("el turno no se pudo cargar!!!!");
      }
    )
  }

  getAverageforMinute(){
    console.log("entre a getAverageForMinute");
    this.fechaActual = this.fecha().substring(0,10);
    if(this.fechaActual == this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getAverageforMinute(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '1').subscribe(
        res => {
          this.cajasCalibrador1Minuto = res;
          //console.log(this.cajasCalibrador1Turno[0].total);
          if(this.cajasCalibrador1Minuto[0].total == null){
            this.totalMinuto1 = 0;
          }
          else{
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
         
          this.toastr.success('obtenido','obtenido');
          console.log("produccion por minuto");
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }else if(this.fechaActual > this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getAverageforMinute(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '2').subscribe(
        res => {
          this.cajasCalibrador1Minuto = res;
          if(this.cajasCalibrador1Minuto[0].total == null){
            this.totalMinuto1 = 0;
          }
          else{
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
          
          this.toastr.success('obtenido','obtenido');
          console.log("produccion por minuto : "+ this.totalMinuto1);
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }
  }

  getAverageLastHour(){
    console.log("entre a getAverageLastHour");
    this.fechaActual = this.fecha().substring(0,10);
    console.log("fecha inicio turno : " + this.turnoActual[0].hora_apertura);
    if(this.fechaActual == this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getAverageforMinuteLastHour(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '1').subscribe(
        res => {
          this.cajasCalibrador1Hora = res;
          //console.log(this.cajasCalibrador1Turno[0].total);
          if(this.cajasCalibrador1Minuto[0].total == null){
            this.totalMinuto1 = 0;
          }
          else{
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
          
          this.toastr.success('obtenido','obtenido');
          console.log("ultima hora success");
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }else if(this.fechaActual > this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getAverageforMinuteLastHour(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '2').subscribe(
        res => {
          this.cajasCalibrador1Hora = res;
          if(this.cajasCalibrador1Minuto[0].total == null){
            this.totalMinuto1 = 0;
          }
          else{
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
         
          this.toastr.success('obtenido','obtenido');
          console.log("ultima hora success");
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }

  }

  //get produccion del turno 
  getProduccionTurno(){
    console.log("entre a getProduccionTurno");
    this.fechaActual = this.fecha().substring(0,10);
    if(this.fechaActual == this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getProduccionSearch(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '1').subscribe(
        res => {
          this.cajasCalibrador1Turno = res;
          //console.log(this.cajasCalibrador1Turno[0].total);
          this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
          this.toastr.success('obtenido','obtenido');
          console.log("produccion por turno success");
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }else if(this.fechaActual>this.turnoActual[0].fecha_apertura){
      //consulta calibrador 1
      this.monitoreoService.getProduccionSearch(this.calibradores[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, '2').subscribe(
        res => {
          this.cajasCalibrador1Turno = res;
          this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
          this.toastr.success('obtenido','obtenido');
          console.log("produccion por turno success");
        },
        err => {
          this.toastr.error('NO obtenido','NO obtenido');
        }
      )
      
    }
  } 

  /******************************** GRAFICO ************************************/
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
      
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Producción por linea'+ this.nombreCalibrador}//,
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartColors: Color[] = [
    { 
      backgroundColor: 'rgba(39, 0, 235, 0.49)',
      },
    
  ]

  pushData(dataNumberBox: any []){
    this.barChartData[0].data = [];
    this.barChartLabels= [];
    let i = 0;
    for(let data of dataNumberBox){
      this.barChartData[0].data.push(data[0].total);
      this.barChartLabels.push(`${data[0].nombre_linea}`);
    
    }
  }

  
  /*public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Lineas calibrador 1' }//,
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];*/
  /*****************************************************************************/


  fecha() {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime;
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

  /************ GRAFICO ***************/
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40 ];
  }
  /********************************/


}

