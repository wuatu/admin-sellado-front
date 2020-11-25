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
import { LineaService } from 'src/app/services/linea.service';
import { RegistroDevService } from '../../services/registro-dev.service';

// GRAFICO
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';


//*****/
import { timer,interval, Subscription, Observable } from 'rxjs';

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
  arrayAux: any = [];
  turnoActual: any = [];
  productionByLine =  new Array();
  a : any = []; 
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  nombreCalibrador: string = "";
  isDataAvailable: boolean = false;
  constanteDivision = 0;
  
  subscriptionTimerTask: Subscription;
  subscriptionTimer: Subscription;


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
    private monitoreoCalibradorService: MonitoreoCalibradoresService,
    private registroDevService: RegistroDevService
  ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {

    //Lista los calibradores que estan registrados en la base de datos.
    this.getTurnoActual();
    this.subscriptionTimerTask = timer(0, 10000).subscribe(() => {
      this.monitoreoService.getGetLastTurno().subscribe(
        res => {
          if(res.status == 200){
            console.log(res.body[0]);
            if(res.body[0].fecha_cierre == ""){
              this.getProduccionTurno();
              this.getAverageforMinute();
              this.getAverageLastHour();
              this.getProductionLine();
              //this.toastr.success('llame a los metodos ','Operación Satisfactoria');
              
            }//else{
              //this.toastr.success('No hay turno iniciado','Operación satisfactoria');
            //}
            
          }
        },
        err => {
          console.log(err.status); 
          this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo');  
        }
      )
    });
    
    this.subscriptionTimer = timer(0, 1000).subscribe(() => {
      this.time = new Date();
    });
  }

  ngOnDestroy() {
    if(this.subscriptionTimerTask != null) {

      this.subscriptionTimerTask.unsubscribe();
    }

    if (this.subscriptionTimer != null) {
      this.subscriptionTimer.unsubscribe();
    }

    
  }



  //metodo que lista las calibradores
  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
        this.constanteDivision = (this.calibradores[0].cajas_por_minuto / 3);
        this.getLineOfCaliper();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo-calibrador1');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }
  //Este método obtiene desde la base de datos todas las lineas que tiene el calibrador y ejecuta los métodos paras obtener la producción 
  getLineOfCaliper() {
    this.lineaService.getLineasId(this.calibradores[0].id).subscribe(
      res => {
        this.lineas = res.body;
        this.getProduccionTurno();
        this.getAverageforMinute();
        this.getAverageLastHour();
        this.getProductionLine();

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas del calibrador, método getLineOfCaliper, component monitoreo-calibrador1');
        console.log("No se pudieron cargar las lineas del calibrador!!!!");
      }
    )
  }

  //Método que obtiene la cantidad de cajas selladas por minuto de las lineas del calibrador 
  getProductionLine() {
    this.productionByLine = [];
    //fecha atual, se utiliza para saber si el turno se mantiene en el dia de inicio o paso a otro.
    this.fechaActual = this.fecha().substring(0, 10);
    let i = 0;
    for (let linea of this.lineas) {
      this.monitoreoCalibradorService.getProductionLine(this.calibradores[0].id, linea.id, linea.nombre, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.fechaActual).subscribe(
        res => {
          //console.log(res.body);
          this.productionByLine.push(res.body);
          if(i == this.lineas.length-1){
            console.log(this.productionByLine);
            this.ordenarArray(this.productionByLine);
          }
          i++;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProductionLinea, component monitoreo-calibrador1');
        }
      )
      
    }
  }
  
  ordenarArray(array =  new Array()){
    this.arrayAux = [];
    for(let linea of this.lineas){
      for(let arr of array){
        if(linea.nombre == arr[0].nombre_linea){
          this.arrayAux.push(arr);
          break;
        }
      }
    }
    //console.log("ordenar array");
    //console.log(this.arrayAux)
    this.pushData(this.arrayAux);
    
  }

  //Método que obtiene desde la base de datos el turno que se encuentra iniciado
  getTurnoActual() {
    this.monitoreoService.getGetLastTurno().subscribe(
      res => {
        this.turnoActual = res.body;
        this.listarCalibradores();

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo-calibrador1');
        console.log("el turno no se pudo cargar!!!!");
      }
    )
  }
  // Método que realiza la ejecución para saber el promedio de cajas selladas por minuto  durante el turno
  //a la consulta de la base de datos se le pasa el calibrador, la fecha de inicio del turno, la hora de inicio del turno y si el turno esta en el mismo dia que inicio o se extendio a otro
  getAverageforMinute() {
    //fecha atual, se utiliza para saber si el turno se mantiene en el dia de inicio o paso a otro.
    this.fechaActual = this.fecha().substring(0, 10);
    //En el caso en que el turno se mantenga en el dia en que se inicio
    if (this.fechaActual == this.turnoActual[0].fecha_apertura) {
      //consulta para el calibrador 1
      this.monitoreoCalibradorService.getAverageforMinute(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '1', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Minuto = res;
          //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
          if (this.cajasCalibrador1Minuto[0].total == null) {
            this.totalMinuto1 = 0;
          }
          else {
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getAverageforMinute, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )
      //En el caso en que el turno se extienda de un dia a otro. 
    } else if (this.fechaActual > this.turnoActual[0].fecha_apertura) {
      //consulta para el calibrador 1
      this.monitoreoCalibradorService.getAverageforMinute(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '2', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Minuto = res;
          //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
          if (this.cajasCalibrador1Minuto[0].total == null) {
            this.totalMinuto1 = 0;
          }
          else {
            this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
          }
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getAverageforMinute, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )

    }
  }
  //Método que ejecuta los servicios para consultar el promedio de cajas selladas en la útima hora del turno.
  getAverageLastHour() {
    //fecha atual, se utiliza para saber si el turno se mantiene en el dia de inicio o paso a otro.
    this.fechaActual = this.fecha().substring(0, 10);
    //en el caso de que el turno se mantenga en el día que inicio
    if (this.fechaActual == this.turnoActual[0].fecha_apertura) {
      //consulta para el calibrador 1
      this.monitoreoCalibradorService.getAverageforMinuteLastHour(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '1', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Hora = res;
          //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
          if (this.cajasCalibrador1Hora[0].total == null) {
            this.totalHora1 = 0;
          }
          else {
            this.totalHora1 = this.cajasCalibrador1Hora[0].total;
          }
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en la última hora en el turno del calibrador 1, método getAverageLastHour, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )
      //En el caso en que el turno se extienda de un dia a otro.  
    } else if (this.fechaActual > this.turnoActual[0].fecha_apertura) {
      //consulta para el calibrador 1
      this.monitoreoCalibradorService.getAverageforMinuteLastHour(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '2', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Hora = res;
          if (this.cajasCalibrador1Hora[0].total == null) {
            this.totalHora1 = 0;
          }
          else {
            this.totalHora1 = this.cajasCalibrador1Hora[0].total;
          }
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en la última hora en el turno del calibrador 1, método getAverageLastHour, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )

    }

  }

  //Método que ejecuta los servicios para consultar el promedio de cajas selladas del turno.
  getProduccionTurno() {
    //fecha atual, se utiliza para saber si el turno se mantiene en el dia de inicio o paso a otro.
    this.fechaActual = this.fecha().substring(0, 10);
    //en el caso de que el turno se mantenga en el día que inicio
    if (this.fechaActual == this.turnoActual[0].fecha_apertura) {
      //consulta para el calibrador 1
      this.monitoreoCalibradorService.getProduccionSearch(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '1', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Turno = res;
          this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProduccionTurno, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )
      //En el caso en que el turno se extienda de un dia a otro.
    } else if (this.fechaActual > this.turnoActual[0].fecha_apertura) {
      //consulta para calibrador 1
      this.monitoreoCalibradorService.getProduccionSearch(this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, this.calibradores[0].id, '2', this.fechaActual).subscribe(
        res => {
          this.cajasCalibrador1Turno = res;
          this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
          console.log("produccion por turno success");
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProduccionTurno, component monitoreo-calibrador1');
          this.toastr.error('NO obtenido', 'NO obtenido');
        }
      )

    }
  }

  /******************************** GRAFICO ************************************/
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    title: {
      display: true,
      text: 'Producción por línea',
      fontColor: "black",
      fontSize: 20
    },
    legend: {
      labels: {
        fontSize: 20,
        fontColor: 'red'
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontSize: 20,
          fontColor: "black"
        }
      }], yAxes: [{
        ticks: {
          autoSkipPadding: 20,
          
          fontSize: 20,
          fontColor: "black"
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: "black",
        font: {
          size: 20,
        }
      },
    }
  };

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Producción' + this.nombreCalibrador }
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: 'rgba(39, 0, 235, 0.49)',
    },
  ]

  pushData(dataNumberBox: any[]) {
    this.barChartData[0].data = [];
    this.barChartData[0].backgroundColor =[];
    this.barChartLabels = [];
    let i = 0;
    for (let data of dataNumberBox) {
      //console.log(data);
      if (data.total <= this.constanteDivision) {        
        this.barChartData[0].data.push(data[0].total);
        this.barChartData[0].backgroundColor.push("red");
      } else if (data[0].total > this.constanteDivision && data.total <= this.constanteDivision * 2) {
        this.barChartData[0].data.push(data[0].total);
        this.barChartData[0].backgroundColor.push("yellow");
      } else {
        this.barChartData[0].data.push(data[0].total);
        this.barChartData[0].backgroundColor.push("green");
      }
      this.barChartLabels.push(`${data[0].nombre_linea}`);
      i++;
    }
 
  }



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
  /********************************/


}

