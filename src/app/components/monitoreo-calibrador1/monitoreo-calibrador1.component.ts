import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { formatDate, ViewportScroller } from '@angular/common';
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
import { timer, interval, Subscription, Observable } from 'rxjs';
import { GetDateService } from 'src/app/services/get-date.service';

@Component({
  selector: 'app-monitoreo-calibrador1',
  templateUrl: './monitoreo-calibrador1.component.html',
  styleUrls: ['./monitoreo-calibrador1.component.css']
})
export class MonitoreoCalibrador1Component implements OnInit {
  @ViewChild("mymodaliniciarturno") modalIniciarTurno: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  time = new Date();

  //max = 1;
  calibradores: any = [];
  lineas: any = [];

  cajasCalibrador1Turno: any = [];
  cajasCalibrador1Hora: any = [];
  cajasCalibrador1Minuto: any = [];

  cajasPorLinea:any = [];

  totalTurno1: number = 0;
  totalHora1: number = 0;
  totalMinuto1: number = 0;

  fechaActual: string;
  arrayAux: any = [];
  turnoActual: any = [];
  productionByLine = new Array();
  a: any = [];
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


  subscriptionTimer: Subscription;
  subscriptionTimerProduccion: Subscription;
  barChartOptions: ChartOptions;
  timeOutCaliper1: any;
  offsetTime: any;


  /*****************************/
  iniciarCerrar = "iniciar";
  IniciarCerrar = "Iniciar";
  passAdmin = "";
  rutAdmin = "";
  closeResult = "";
  turnoIniciado = false;
  botonIniciarTurnoClass = "btn-primary";
  botonIniciarTurnoText = "Iniciar turno";
  turno;
  fechaInicioTurno: string = null;
  horaInicioTurno: string = null;
  /*****************************/

  constructor(
    private modalService: NgbModal,
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
    private registroDevService: RegistroDevService,
    private getDateService: GetDateService,
    private vps: ViewportScroller
  ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {
    this.listarCalibradores();

    //this.getTurnoActual();

    //Trae el tiempo desde el servidor
    this.getDateService.dateGetTime().forEach((res: any) => {
      //console.log(res.date);
      this.offsetTime = new Date().getTime() - res.date;
      //console.log(this.offsetTime);
    });
    this.subscriptionTimer = timer(0, 1000).subscribe(() => {
      if (this.offsetTime != null) {
        //console.log(this.offsetTime);
        this.time = new Date(new Date().getTime() - this.offsetTime);
      }
    });
  }

  ngAfterViewInit() {
    this.isLoggedIn();
  }

  isLoggedIn(): void {
    if (this.authService.isLogin()) {
      const user = JSON.parse(localStorage.getItem('USER'));
      console.log(user.rut);
      if (user.rut == "11111111-1") {
        
        let showmenu: HTMLElement = document.getElementById('showmenu') as HTMLElement;
        showmenu.click();
        

        let botom: HTMLElement = document.getElementById('scrollMe') as HTMLElement;
        botom.scrollIntoView();
        
        //this.vps.scrollToAnchor("scrollMe");

          //document.querySelector('scrollMe').scrollTop = document.querySelector('scrollMe').scrollHeight;
        

      }
    }
  }

  scrollToBottom(): void {
    try {
      //      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;

    } catch (err) { }
  }

  ngOnDestroy() {
    //console.log("ngOnDestroy !!...");
    if (this.timeOutCaliper1 != null) {
      //console.log("muerte a timeOutCaliper1.....");
      clearTimeout(this.timeOutCaliper1);
    }

    if (this.subscriptionTimer != null) {
      //console.log("muerte a subscriptionTimer.....");
      this.subscriptionTimer.unsubscribe();
    }

    if (this.subscriptionTimerProduccion != null) {
      console.log("muerte a subscriptionTimerProduccion 1.....");
      this.subscriptionTimerProduccion.unsubscribe();
    }
  }

  //Método que elimina los registros de la tabla registro_diario_caja_sellada_aux correspondiente al turno actual
  getDeleteRegister() {
    this.monitoreoCalibradorService.deleteRegister(this.turno.id).subscribe(
      res => {
        this.registroService.creaRegistro("Se han eliminado todos los registros del idturno:" + this.turno.id+ " de la tabla registro_diario_caja_sellada_aux");

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar los registros de la tabla registro_diario_caja_sellada_aux, método getDeleteRegister, monitoreo-calibrador.componenet');

      }
    )
  }

  getProduccion() {
    this.monitoreoService.getLastTurno(this.calibradores[0].id).subscribe(
      res => {
        if (res.status == 200) {

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

        if (this.calibradores.length > 0) {
          this.getRegistro();

          this.constanteDivision = (this.calibradores[0].cajas_por_minuto / 3);
        }

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
                beginAtZero: true,
                // max: auto /*this.calibradores[0].cajas_por_minuto + 3*/,
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
        if (this.lineas != null) {
          this.subscriptionTimerProduccion = timer(0, 10000).subscribe(() => {
            this.monitoreoService.getLastTurno(this.calibradores[0].id).subscribe(
              res => {
                if (res.status == 200) {
        
                  if (res.body[0].fecha_cierre == "") {
                    console.log("ejecutando produccion 1 ..!!!!!");
                    this.getAverageforMinute2();
                    this.getProduccionTurno2();
                    this.getAverageLastHour2();
                    this.getProductionLine2();
                  }
        
                }
              },
              err => {
                console.log(err.status);
                this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo');
              }
            )
          });
          //this.getAverageforMinute2();
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas del calibrador, método getLineOfCaliper, component monitoreo-calibrador1');
        console.log("No se pudieron cargar las lineas del calibrador!!!!");
      }
    )
  }



  ordenarArray(array = new Array()) {
    this.arrayAux = [];
    for (let linea of this.lineas) {
      for (let arr of array) {
        /*
        if (this.max < arr[0].total) {
          this.max = arr[0].total;
        }*/
        if (linea.nombre == arr.nombre_linea) {
          this.arrayAux.push(arr);
          break;
        }
      }
    }
    this.pushData(this.arrayAux);
    /*this.max = this.max + 10;
    this.barChartOptions.scales.yAxes[0].ticks.max = this.max;
    console.log(this.max);
    */
  }

  //Método que obtiene desde la base de datos el turno que se encuentra iniciado
  getTurnoActual() {
    this.monitoreoService.getLastTurno(this.calibradores[0].id).subscribe(
      res => {
        this.turnoActual = res.body;
        //this.listarCalibradores();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo-calibrador1');

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
      this.monitoreoCalibradorService.getProductionLine2(this.calibradores[0].id, this.turnoActual.id, this.turnoActual.fecha_apertura, this.turnoActual.hora_apertura, linea.id, linea.nombre).subscribe(
        res => {
          this.productionByLine.push(res.body);

          if (i == this.lineas.length - 1) {
            this.ordenarArray(this.productionByLine);

            /*this.timeOutCaliper1 = setTimeout(() => {
              this.getProduccion();

            },
              10000);*/
          }
          i++;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProductionLinea, component monitoreo-calibrador1');
        }
      )

    }
  }
  getAverageforMinute2() {
    //console.log("getAverageForMinute calibrador 1");
    this.monitoreoCalibradorService.getAverageforMinute2(this.calibradores[0].id, this.turnoActual.id, this.turnoActual.fecha_apertura, this.turnoActual.hora_apertura, this.lineas.length).subscribe(
      res => {
        this.cajasCalibrador1Minuto = res;
        //this.getProduccionTurno2();

        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador1Minuto[0].total == null || this.cajasCalibrador1Minuto[0].total == "NaN") {
          this.totalMinuto1 = 0;
        }
        else {
          this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getAverageforMinute, component monitoreo-calibrador1');
        this.toastr.error('NO obtenido getAverageforMinute2', 'NO obtenido');
      }
    )
  }

  getAverageLastHour2() {
    //get todas las cajas que tengan el mismo id del turno
    this.monitoreoCalibradorService.getAverageforMinuteLastHour2(this.calibradores[0].id, this.turnoActual.id, this.turnoActual.fecha_apertura, this.turnoActual.hora_apertura, this.lineas.length).subscribe(
      res => {
        this.cajasCalibrador1Hora = res;
        //this.getProductionLine2();
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador1Hora[0].total == null || this.cajasCalibrador1Hora[0].total == "NaN") {
          this.totalHora1 = 0;
        }
        else {
          this.totalHora1 = this.cajasCalibrador1Hora[0].total;
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
    this.monitoreoCalibradorService.getProduccionSearch2(this.calibradores[0].id, this.turnoActual.id, this.turnoActual.fecha_apertura, this.turnoActual.hora_apertura).subscribe(
      res => {
        //this.getAverageLastHour2();

        this.cajasCalibrador1Turno = res;
        this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto en el turno del calibrador 1, método getProduccionTurno, component monitoreo-calibrador1');
        this.toastr.error('NO obtenido getProduccionTurno2', 'NO obtenido');
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
    this.barChartData[0].backgroundColor = [];
    this.barChartLabels = [];
    let i = 0;
    for (let data of dataNumberBox) {
      //console.log(data);
      if (data.total <= this.constanteDivision) {
        this.barChartData[0].data.push(data.total);
        this.barChartData[0].backgroundColor.push("red");
      } else if (data.total > this.constanteDivision && data.total <= this.constanteDivision * 2) {
        this.barChartData[0].data.push(data.total);
        this.barChartData[0].backgroundColor.push("yellow");
      } else {
        this.barChartData[0].data.push(data.total);
        this.barChartData[0].backgroundColor.push("green");
      }
      this.barChartLabels.push(`${data.nombre_linea}`+ " ["+data.total_turno+" cajas]");
      i++;
      //this.barChartOptions.scales.yAxes[0].ticks.max = this.calibradores[0].cajas_por_minuto + 1;
    }

    //console.log(this.calibradores[0].cajas_por_minuto + 1);
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


  /****************************************************************************************************************/
  getRegistro() {
    this.turnoService.getTurnoSinId(this.calibradores[0].id).subscribe(
      res => {
        if (res.status == 200) {

          this.turno = res.body;
          this.turnoActual = res.body;
          //console.log("este es el turno que trae !!!!");
          //console.log(this.turno);
          this.sesionIniciada();
          //this.getTurnoActual();
          //this.toastr.info("Turno se encuentra iniciado", "Información", {
            //positionClass: 'toast-bottom-right'
          //});
        } else {
          this.toastr.info("No se ha iniciado turno", "Información", {
            positionClass: 'toast-bottom-right'
          });
          this.open(this.modalIniciarTurno);
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el registro del turno, método getRegistro, component monitoreo');
        this.toastr.info('No se ha iniciado turno', 'Información', {
          positionClass: 'toast-bottom-right'
        });
        this.open(this.modalIniciarTurno);
      }
    )
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
      return `with: ${reason}`;
    }
  }

  //metodo que sirve para saber la razon por la cual un modal fue cerrado
  private getDismissReasonForm(reason: any) {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        if (this.turnoIniciado === false) {
          return this.iniciarTurno();
        } {
          return this.cerrarTurno();
        }
      }
    }
  }

  autenticarTurno(modal) {
    console.log(this.rutAdmin, this.passAdmin);
    this.openModal(modal);
  }

  private iniciarTurno() {
    this.administradorService.getLoginAdministrador(this.rutAdmin, this.passAdmin).subscribe(
      res => {
        console.log(JSON.parse(localStorage.getItem('USER')));
        let administrador = JSON.parse(localStorage.getItem('USER'));
        console.log(administrador.id);
        let turno = new Turno();
        let fecha = this.fecha();
        turno.fechaApertura(null, fecha.substring(0, 10), fecha.substring(11, 19), administrador.id, administrador.nombre, administrador.apellido, "", "", "", "", "", this.calibradores[0].id, this.calibradores[0].nombre);
        console.log(this.calibradores[0].nombre);
        console.log(turno);
        this.turnoService.saveTurno(turno).subscribe(
          res => {
            this.getRegistro();
            //this.sesionIniciada();
            this.toastr.success("Turno iniciado correctamente");
            this.registroService.creaRegistro("Turno iniciado");
            //*************** carga el turno guardado ****************
            //this.getTurnoActual();
            //guardo los datos del turno iniciado
            this.fechaInicioTurno = fecha.substring(0, 10);
            this.horaInicioTurno = fecha.substring(11, 19);
          },
          err => {
            this.registroDevService.creaRegistroDev('No se crear el registro de iniciar turno, método iniciarTurno, component monitoreo');
            this.toastr.error('Error al iniciar turno', 'Error');
          }
        );
      },
      err => {
        this.registroDevService.creaRegistroDev('Credenciales inválidas para crear el registro de inicio de turno, método iniciarTurno, component monitoreo');
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    )
    this.rutAdmin = "";
    this.passAdmin = "";
  }

  sesionIniciada() {
    this.getLineOfCaliper();
    this.botonIniciarTurnoClass = "btn-outline-danger"
    this.botonIniciarTurnoText = "Cerrar Turno";
    this.turnoIniciado = true;
    this.IniciarCerrar = "Cerrar";
    this.iniciarCerrar = "cerrar";
  }

  sesionCerrada() {
    this.botonIniciarTurnoClass = "btn-primary"
    this.botonIniciarTurnoText = "Iniciar Turno";
    this.turnoIniciado = false;
    this.IniciarCerrar = "Iniciar";
    this.iniciarCerrar = "iniciar";
  }

  private cerrarTurno() {
    this.administradorService.getLoginAdministrador(this.rutAdmin, this.passAdmin).subscribe(
      res => {
        let administrador = JSON.parse(localStorage.getItem('USER'));
        let turno: Turno = new Turno();
        turno.id = this.turno.id;
        turno.fecha_apertura = this.turno.fecha_apertura;
        turno.nombre_administrador_apertura = this.turno.nombre_administrador_apertura;
        turno.apellido_administrador_apertura = this.turno.apellido_administrador_apertura;
        let fecha = this.fecha();
        turno.fechaCierre(fecha.substring(0, 10), fecha.substring(11, 19), administrador.id, administrador.nombre, administrador.apellido);
        this.turnoService.updateTurno(this.turno.id, turno).subscribe(
          res => {
            this.sesionCerrada();
            this.getDeleteRegister();
            this.cerrarTurnoColaboradores();
            this.registroService.creaRegistro("Turno cerrado");
            //se borran los datos del turno que estaba abierto
            this.fechaInicioTurno = null;
            this.horaInicioTurno = null;
          },
          err => {
            this.registroDevService.creaRegistroDev('No se pudo crear el registro de cerrar turno, método cerrarTurno, component monitoreo');
            this.toastr.error('Error al cerrar turno', 'Error');
          }
        );
      },
      err => {
        this.registroDevService.creaRegistroDev('Credenciales inválidas para crear el registro cerrar turno, método cerrarTurno, component monitoreo');
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    )
    this.rutAdmin = "";
    this.passAdmin = "";
  }

  cerrarTurnoColaboradores() {
    let fecha = this.fecha();
    this.turnoService.closeTurnCollaborators(fecha.substring(0, 10), fecha.substring(11, 19), this.calibradores[0].id).subscribe(
      res => {
        this.sesionCerrada();
        if (res.status == 200) {
        } else if (res.status == 204) {
          this.toastr.success('No hay colaboradores agregados a linea para cerrar el turno', 'Operación satisfactoria');
          return;
        }

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo cerrar turno a los colaboradores, método cerrarTurnoColaboradores, component monitoreo');
        this.toastr.error('Error al cerrar turno para los colaboradores', 'Error');
      }
    );
  }

  openModal(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      console.log(this.rutAdmin, this.passAdmin);
      this.closeResult = `Dismissed ${this.getDismissReasonForm(reason)}`;
    });
  }




}

