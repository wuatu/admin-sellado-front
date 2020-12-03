import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AdministradorService } from 'src/app/services/administrador.service';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/models/turno';
import { formatDate } from '@angular/common';
import { RegistroService } from '../../services/registro.service';
import { CalibradorService } from '../../services/calibrador.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import { timer, interval, Subscription, Observable } from 'rxjs';


@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
  @ViewChild("mymodaliniciarturno") modalIniciarTurno: ElementRef;
  iniciarCerrar = "iniciar";
  IniciarCerrar = "Iniciar";
  time = new Date();
  passAdmin = "";
  rutAdmin = "";
  closeResult = "";
  turnoIniciado = false;
  botonIniciarTurnoClass = "btn-primary";
  botonIniciarTurnoText = "Iniciar turno";
  turno;
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = "";
  hasta: string = "";
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;
  isVisiblegoogleMaps = true;

  calibradores: any = [];
  cajasCalibrador1Turno: any = [];
  cajasCalibrador2Turno: any = [];
  cajasCalibrador1Hora: any = [];
  cajasCalibrador2Hora: any = [];
  cajasCalibrador1Minuto: any = [];
  cajasCalibrador2Minuto: any = [];

  totalTurno1: number = 0;
  totalHora1: number = 0;
  totalMinuto1: number = 0;

  totalTurno2: number = 0;
  totalHora2: number = 0;
  totalMinuto2: number = 0;

  fechaActual: string;
  fechaInicioTurno: string = null;
  horaInicioTurno: string = null;

  turnoActual: any = [];
  subscriptionTimerTask: Subscription;
  subscriptionTimerTask1: Subscription;
  subscriptionTimerTask2: Subscription;
  subscriptionTimer: Subscription;
  timeOut: any;

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
    private registroDevService: RegistroDevService
  ) {
    this.fromDate = calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'en-US');
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }

  ngOnInit() {


    //Lista los calibradores que estan registrados en la base de datos.
    this.listarCalibradores();


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

  getProduccion() {
    if (this.calibradores != null) {
      this.monitoreoService.getLastTurno().subscribe(
        res => {
          if (res.status == 200) {
            console.log("ejecuto monitoreo");
            this.getProduccionTurno();
          }
        },
        err => {
          console.log(err.status);
          this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo');
        }
      )
    } else{
      this.toastr.success('Debe agregar un calibrador', 'Oops');
    }
    
  }

  //Método que obtiene el turno actual, en el cual se obtiene la fecha y la hora de inicio de turno 
  getTurnoActual() {
    this.monitoreoService.getLastTurno().subscribe(
      res => {
        console.log(res);
        if (res.status == 200) {
          this.turnoActual = res.body;
          this.getProduccion();
        } else if (res.status == 204) {
          this.toastr.success('no hay turnos actualmente para mostrar', 'Operación satisfactoria');
        }

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component monitoreo');
        this.toastr.error('error al cargar el turno.');

      }
    )
  }
  /*************************************************************************************************/
  /****************************************    PRODUCCION     **************************************/
  /*************************************************************************************************/

  // Método que realiza la ejecución para saber el promedio de cajas selladas por minuto  durante el turno
  //a la consulta de la base de datos se le pasa el calibrador, la fecha de inicio del turno, la hora de inicio del turno y si el turno esta en el mismo dia que inicio o se extendio a otro
  getAverageforMinute() {

    //consulta para el calibrador 1
    this.monitoreoService.getAverageforMinute2(this.calibradores[0].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador1Minuto = res;
        this.getAverageLastHour();
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador1Minuto[0].total == null) {
          this.totalMinuto1 = 0;
          
        }
        else {
          this.totalMinuto1 = this.cajasCalibrador1Minuto[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto del calibrador 1, método getAverageForMinute, component monitoreo');

        this.toastr.error('No obtenido', 'No obtenido');
      }
    )
    //consulta para el calibrador 2
    this.monitoreoService.getAverageforMinute2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador2Minuto = res;
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador2Minuto[0].total == null) {
          this.totalMinuto2 = 0;
        }
        else {
          this.totalMinuto2 = this.cajasCalibrador2Minuto[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto del calibrador 2, método getAverageForMinute, component monitoreo');
        this.toastr.error('NO obtenido', 'NO obtenido');
      }
    )


  }
  //Método que ejecuta los servicios para consultar el promedio de cajas selladas en la útima hora del turno.
  getAverageLastHour() {
    //consulta para el calibrador 1
    this.monitoreoService.getAverageforMinuteLastHour2(this.calibradores[0].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador1Hora = res;
        this.timeOut = setTimeout(() => 
          {
            this.getProduccion();
           
          },
          10000);
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador1Hora[0].total == null) {
          this.totalHora1 = 0;

        }
        else {
          this.totalHora1 = this.cajasCalibrador1Hora[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto de la ultima hora del calibrador 1, método getAverageLastHour, component monitoreo');
        this.toastr.error('NO obtenido', 'NO obtenido');
      }
    )
    //consulta para el calibrador 2
    this.monitoreoService.getAverageforMinuteLastHour2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
      res => {
        this.cajasCalibrador2Hora = res;
        //if para dejar en el contador de minutos en el caso de que se inicie el turno y aun no transcurra el primer minuto
        if (this.cajasCalibrador2Hora[0].total == null) {
          this.totalHora2 = 0;
        }
        else {
          this.totalHora2 = this.cajasCalibrador2Hora[0].total;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el promedio de cajas por minuto de la ultima hora del calibrador 2, método getAverageLastHour, component monitoreo');
        this.toastr.error('NO obtenido', 'NO obtenido');
      }
    )



  }


  //Método que ejecuta los servicios para consultar el promedio de cajas selladas del turno.
  getProduccionTurno() {
    //consulta calibrador 1
    if (this.calibradores != null) {
      this.monitoreoService.getProduccionSearch2(this.calibradores[0].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
        (res) => {
          this.cajasCalibrador1Turno = res;
          this.totalTurno1 = this.cajasCalibrador1Turno[0].total;
          this.getAverageforMinute();
            
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener la cantidad de cajas del turno del calibrador 1, método getProduccionTurno, component monitoreo');
          this.toastr.error('Error calibrador 1', 'NO obtenido');
        }
      )
      //consulta para el calibrador 2
      this.monitoreoService.getProduccionSearch2(this.calibradores[1].id, this.turnoActual[0].id, this.turnoActual[0].fecha_apertura, this.turnoActual[0].hora_apertura).subscribe(
        res => {
          this.cajasCalibrador2Turno = res;
          //console.log(this.cajasCalibrador2Turno[0].total);
          this.totalTurno2 = this.cajasCalibrador2Turno[0].total;
        },
        err => {
          this.registroDevService.creaRegistroDev('No se pudo obtener la cantidad de cajas del turno del calibrador 2, método getProduccionTurno, component monitoreo');
          this.toastr.error('Error calibrador 2', 'NO obtenido');
        }
      )
    } else {
      this.toastr.error('Ingrese al menos un calibrador', 'Oops');
    }

  }
  /****************************************************************************************************************/
  /****************************************************************************************************************/
  getRegistro() {
    this.turnoService.getTurnoSinId().subscribe(
      res => {
        this.turno = res;
        if (this.turno) {
          console.log(this.turno.id);
          this.sesionIniciada();
          this.getTurnoActual();
          this.toastr.info("Turno se encuentra iniciado", "Información", {
            positionClass: 'toast-bottom-right'
          });
        } else {
          this.toastr.info("Favor inicie turno", "Información", {
            positionClass: 'toast-bottom-right'
          });
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

  //metodo que lista las calibradores
  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        //get registro
        this.getRegistro();
        console.log(res.body);
        this.calibradores = res.body;
        console.log(this.calibradores);

      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component monitoreo');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
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
        turno.fechaApertura(null, fecha.substring(0, 10), fecha.substring(11, 19), administrador.id, administrador.nombre, administrador.apellido, "", "", "", "", "");
        this.turnoService.saveTurno(turno).subscribe(
          res => {
            this.sesionIniciada();
            this.toastr.success("Turno iniciado correctamente");
            this.registroService.creaRegistro("Turno iniciado");
            //*************** carga el turno guardado ****************
            this.getTurnoActual();
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
    this.turnoService.closeTurnCollaborators(fecha.substring(0, 10), fecha.substring(11, 19)).subscribe(
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


}
