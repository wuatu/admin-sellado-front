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
import { RegistroDevService } from '../../services/registro-dev.service';
// GRAFICO
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label, Color } from 'ng2-charts';
import { LineaService } from 'src/app/services/linea.service';


//*****/
import { timer, interval, Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-monitoreo-calibrador2',
  templateUrl: './monitoreo-calibrador2.component.html',
  styleUrls: ['./monitoreo-calibrador2.component.css']
})
export class MonitoreoCalibrador2Component implements OnInit {
  time = new Date();

  calibradores: any = [];
  lineas: any = [];

  cajasCalibrador2Turno: any = [];
  cajasCalibrador2Hora: any = [];
  cajasCalibrador2Minuto: any = [];

  totalTurno2: number = 0;
  totalHora2: number = 0;
  totalMinuto2: number = 0;

  fechaActual: string;
  arrayAux: any = [];
  turnoActual: any = [];
  productionByLine: any = [];

  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  nombreCalibrador: string = "";

  subscriptionTimerTask: Subscription;
  subscriptionTimer: Subscription;
  constanteDivision = 0;  
  barChartOptions: ChartOptions;
  timeOut: any;
  
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

    this.subscriptionTimer = timer(0, 1000).subscribe(() => {
      this.time = new Date();
    });
  }

  ngOnDestroy() {
    if (this.timeOut != null) {
      clearTimeout(this.timeOut);
    }

    if (this.subscriptionTimer != null) {
      this.subscriptionTimer.unsubscribe();
    }


  }

  getProduccion(){
    this.monitoreoService.getLastTurno().subscribe(
      res => {
        if (res.status == 200) {
          console.log("ejecuto monitoreo calibrador 2");
          if (res.body[0].fecha_cierre == "") {
            this.getAverageforMinute2()
          }

        }
      },
      err => {
        console.log(err.status);
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo');
      }
    )
  }

  //metodo que lista las calibradores
  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
        this.constanteDivision = (this.calibradores[1].cajas_por_minuto / 3);
        /******************************** GRAFICO ************************************/
        this.barChartOptions = {
          responsive: true,
          // We use these empty structures as placeholders for dynamic theming.
          title: {
            display: true,
            text: '    ',
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
                beginAtZero:true,
                autoSkipPadding: 20,
                //max: this.calibradores[1].cajas_por_minuto + 3,
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
        this.getLineOfCaliper();

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo-calibrador2');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }
  //Este método obtiene desde la base de datos todas las lineas que tiene el calibrador y ejecuta los métodos paras obtener la producción 
  getLineOfCaliper() {
    this.lineaService.getLineasId(this.calibradores[1].id).subscribe(
      res => {
        this.lineas = res.body;
        this.getAverageforMinute2()
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método getLineOfCaliper, component monitoreo-calibrador2');
        console.log("No se pudieron cargar las lineas del calibrador!!!!");
      }
    )
  }
  ordenarArray(array = new Array()) {
    this.arrayAux = [];
    for (let linea of this.lineas) {
      for (let arr of array) {
        if (linea.nombre == arr[0].nombre_linea) {
          this.arrayAux.push(arr);
          break;
        }
      }
    }
    this.pushData(this.arrayAux);

  }

    //Método que obtiene desde la base de datos el turno que se encuentra iniciado
    getTurnoActual() {
      this.monitoreoService.getLastTurno().subscribe(
        res => {
          this.turnoActual = res.body;
          this.listarCalibradores();
  
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo-calibrador2')
          console.log("el turno no se pudo cargar!");
        }
      )
    }

    
/******************************************************************************************************/
/*******************************************   PRODUCCIÓN   *******************************************/
/******************************************************************************************************/
  //Método que obtiene la cantidad de cajas selladas por minuto de las lineas del calibrador 
  getProductionLine2() {
    this.productionByLine = [];
    //fecha atual, se utiliza para saber si el turno se mantiene en el dia de inicio o paso a otro.
    this.fechaActual = this.fecha().substring(0, 10);
    let i = 0;
    for (let linea of this.lineas) {
      this.monitoreoCalibradorService.getProductionLine2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura, linea.id, linea.nombre).subscribe(
        res => {
          this.productionByLine.push(res.body);
          if (i == this.lineas.length - 1) {
            this.ordenarArray(this.productionByLine);
            this.timeOut = setTimeout(() => 
            {
              this.getProduccion();
              console.log("esperando !!!!!");
              console.log(this.productionByLine);
            },
              10000);
          }
          i++;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProductionLinea, component monitoreo-calibrador1');
          console.log("no se obtuvo la producción de la linea ");
        }
      )
    }
  }


  getAverageforMinute2() {
    this.monitoreoCalibradorService.getAverageforMinute2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador2Minuto = res;
        this.getProduccionTurno2();
        
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador2Minuto[0].total == null) {
          this.totalMinuto2 = 0;
        }
        else {
          this.totalMinuto2 = this.cajasCalibrador2Minuto[0].total;
        }

        console.log("La produccion del turno es : "+ this.totalMinuto2);
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getAverageforMinute, component monitoreo-calibrador1');
        this.toastr.error('NO obtenido', 'NO obtenido');
      }
    )
  }

  getAverageLastHour2() {
    //get todas las cajas que tengan el mismo id del turno
    this.monitoreoCalibradorService.getAverageforMinuteLastHour2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador2Hora = res;
        this.getProductionLine2();
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador2Hora[0].total == null) {
          this.totalHora2 = 0;
        }
        else {
          this.totalHora2 = this.cajasCalibrador2Hora[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en la última hora en el turno del calibrador 1, método getAverageLastHour, component monitoreo-calibrador1');
        this.toastr.error('Promedio de la ultima hora por minuto NO obtenido', 'NO obtenido');
      });
  }
  
  //Método que ejecuta los servicios para consultar el promedio de cajas selladas del turno.
  getProduccionTurno2() {
    //consulta para el calibrador 1
    this.monitoreoCalibradorService.getProduccionSearch2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.getAverageLastHour2();
        
        this.cajasCalibrador2Turno = res;
        this.totalTurno2 = this.cajasCalibrador2Turno[0].total;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProduccionTurno, component monitoreo-calibrador1');
        this.toastr.error('NO obtenidoaaa', 'NO obtenido');
      }
    )
      
  }
  
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/

  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Producción por linea' + this.nombreCalibrador }//,
    //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  public barChartColors: Color[] = [
    {
      backgroundColor: 'rgba(39, 0, 235, 0.49)',
    },

  ]

  pushData(dataNumberBox: any[]) {
    this.barChartData[0].data = [];
    this.barChartData[0].backgroundColor = [];
    this.barChartLabels = [];
    let i = 0;
    for (let data of dataNumberBox) {
      //console.log(data);
      if (data[0].total <= this.constanteDivision) {
        this.barChartData[0].data.push(data[0].total);
        this.barChartData[0].backgroundColor.push("red");
      } else if (data[0].total > this.constanteDivision && data[0].total <= this.constanteDivision * 2) {
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

  public randomize(): void {
    // Only Change 3 values
    this.barChartData[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
  }
  /********************************/


}


