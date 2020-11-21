import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../services/usuario.service';
import { CalibradorService } from '../../services/calibrador.service';
import { LineaService } from '../../services/linea.service';
import { UsuarioEnLinea } from '../../models/usuario-en-linea';
import { Calibrador } from '../../models/calibrador';
import { Linea } from '../../models/linea';
import { ExportUsuarioEnLinea } from '../../models/export-usuario-en-linea';
import { UsuarioEnLineaService } from '../../services/usuario-en-linea.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { RegistroService } from '../../services/registro.service';
import { MonitoreoService } from '../../services/monitoreo.service';
import { RegistroDevService } from '../../services/registro-dev.service';


declare var require: any;


@Component({
  selector: 'app-usuario-en-linea',
  templateUrl: './usuario-en-linea.component.html',
  styleUrls: ['./usuario-en-linea.component.css']
})
export class UsuarioEnLineaComponent implements OnInit {
  closeResult = '';
  pageOfItems: Array<any>;

  p: number = 1;

  rutUsuario: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  fechaInicio: string;
  fechaTermino: string;
  horaInicio: string;
  horaTermino: string;

  currentUsuarioEnLineaSelected: UsuarioEnLinea;

  usuariosEnLinea: any = [];

  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentUsuarioSelected: Usuario;

  calibradores: any = [];
  lineas: any = [];
  usuarios: any = [];

  selectedCalibradorText: string = "Seleccionar calibrador";
  selectedCalibradorObject: any;

  selectedLineaText: string = "Seleccionar linea";
  selectedLineaObject: any;


  selectedUsuarioText: string = "Seleccionar usuario";
  selectedUsuarioObject: any;

  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = null;
  hasta: string = null;
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;

  rutBusqueda: string = null;

  nombreLinea: string = "lineaPrueba";
  nombreCalibrador: string = "calibradorPrueba";

  nombreExcel = 'ColaboradoresEnLinea';

  exportUsuarioEnLineaArray: any = [];
  exportUsuarioEnLineaArrayAux: any = [];
  dateSave: string;
  HourSave: string;
  timeStart: string;
  dateStart: string;
  timeFinish: string = " ";
  dateFinish: string = " ";
  dateStartSearch: string;
  dateFinishSearch: string;

  turnoActual: any = [];
  bandera: boolean = false;
  turno : boolean = false;


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private usuarioEnLineaService: UsuarioEnLineaService,
    private usuarioService: UsuarioService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private registroService: RegistroService,
    private monitoreoService: MonitoreoService,
    private registroDevService: RegistroDevService

  ) { }

  ngOnInit() {
    this.fromDate = this.calendar.getToday();
    this.desde = formatDate(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "yyyy-MM-dd", 'en-US');
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 1);
    console.log(this.desde);
    this.listarCalibradores();
    this.getTurnoActual();

  }

  onSubmitBuscarUsuarioForm() {

  }

  listarUsuarios() {
    this.usuarioService.getUsuarios().subscribe(
      res => {
        console.log(res);
        this.usuarios = res.body;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los usuarios, método listarUsuarios, component usuario-en-linea');
        console.log('No se pudo obtener a los usuarios');
      }
    );
  }

  listarLineas(id: string) {
    this.lineaService.getLineasId(id).subscribe(
      res => {
        this.lineas = res.body;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método listarLineas, component usuario-en-linea');
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }

  listarCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component usuario-en-linea');
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  listarUsuariosEnLinea() {
    if (this.selectedLineaText == "Seleccionar linea" || this.selectedCalibradorText == "Seleccionar calibrador") {
      this.toastr.error('Se debe seleccionar calibradora y linea ', 'Oops');
      return;
    }
    this.bandera = false;
    this.exportUsuarioEnLineaArray = [];
    this.usuarioEnLineaService.getUsuariosEnLinea(this.selectedLineaObject.id, this.selectedCalibradorObject.id, this.rutBusqueda, this.desde, this.hasta).subscribe(
      res => {
        console.log(res.body);
        if (res.status == 200) {
        } else if (res.status == 204) {
          this.toastr.success('no hay usuarios en linea actualmente para mostrar', 'Operación satisfactoria');
          return;
        }
        this.usuariosEnLinea = res.body;
        this.bandera = true;

        //Se crea un objeto de la clase export-usuario-en-linea con la información devuelta de la base de datos 
        for (let element of this.usuariosEnLinea) {
          let exportUsuarioEnLinea = new ExportUsuarioEnLinea(element.usuario_rut, element.nombre_usuario, element.apellido_usuario, element.nombre_linea, element.nombre_calibrador, element.hora_inicio, element.fecha_inicio, element.hora_termino, element.fecha_termino);
          this.exportUsuarioEnLineaArray.push(exportUsuarioEnLinea);
          if (this.selectedLineaObject.id && this.selectedCalibradorObject.id && this.rutBusqueda != null && this.desde && this.hasta != null) {
            this.exportUsuarioEnLineaArrayAux = this.exportUsuarioEnLineaArray;
          }
        }
        if (this.usuariosEnLinea.length == 0) {
          this.exportUsuarioEnLineaArray = null;
        }
        if (this.toDate != null || this.hasta != null || this.rutUsuario != null) {
          this.toDate = null;
          this.hasta = null;
          this.rutUsuario = null;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los usuarios en línea, método listarUsuariosEnLinea, component usuario-en-linea');
        this.toastr.error('No se pudo obtener los colaboradores en linea', 'Oops');
      }
    );
  }

  validarColaboradorEnLinea() {
    if(this.turno == false){
      this.toastr.error('Se debe iniciar turno antes de agregar un colaborador a la línea','Operación Fallida');
      return;
    }
    this.usuarioEnLineaService.getValidationCollaborator(this.turnoActual[0].id, this.selectedUsuarioObject.id, this.selectedLineaObject.id).subscribe(
      res => {
        if (res[0].enTurno == 0) {
          this.agregarUsuarioEnLinea();
        } else if (res[0].enTurno > 0) {
          this.toastr.error('No se pudo agregar, ya esta en la linea', 'Oops');
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo validar si el usuario esta en la línea, método validarColaboradorEnLinea, component usuario-en-linea');
        console.log("No se pudo obtener la validación");
      }
    );
  }

  closeTurnColaboratorChangeLine() {
    let fecha = this.fecha();
    this.usuarioEnLineaService.closeTurnCollaborator(this.turnoActual[0].id, this.selectedUsuarioObject.id, this.selectedLineaObject.id, fecha.substring(0, 10), fecha.substring(11, 19)).subscribe(
      res => {
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo cerrar el turno del colaborador en la línea que se encontraba, método closeTurnCollaboratorChangeLine, component usuario-en-linea');
        console.log("No se pudo cerrar turno en la linea anterior");
      }
    );
  }

  exportarArchivoExcel() {
    try {
      // Se convierte el arreglo con los usuarios en linea 
      var jsonArray = JSON.parse(JSON.stringify(this.exportUsuarioEnLineaArray))

      console.log(jsonArray);
      //se convierte el Json a xlsx en formato workSheet
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonArray);

      /* genera el workbook y agrega el worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'colaboradores en línea');

      /* Guarda el archivo */
      let fecha = (new Date()).toISOString();
      XLSX.writeFile(wb, this.nombreExcel + "_" + fecha.substring(0, 10) + ".xls");
    } catch (error) {
      this.registroDevService.creaRegistroDev('No se pudo exportar los usuarios en linea al archivo excel, método exportarArchivoExcel, component usuario-en-linea');
    }

  }

  //Método que obtiene el turno actual, en el cual se obtiene la fecha y la hora de inicio de turno 
  getTurnoActual() {
    this.monitoreoService.getGetLastTurno().subscribe(
      res => {
        this.turnoActual = res.body;
        if(res.status == 200){
          this.turno = true;
        }
        else if(res.status == 204){
          this.turno = false;
        }
        console.log(this.turnoActual);
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener el turno actual, método getTurnoActual, component usuario-en-linea');
      }
    )
  }

  agregarUsuarioEnLinea() {
    //se guarda la fecha actual y se crea un substring para dar formato hh:mm yyyy:mm:dd
    this.dateSave = this.fecha().substring(0, 10);
    this.HourSave = this.fecha().substring(11, 19);
    //this.dateSave = this.dateSave.substring(11,16)+" "+this.dateSave.substring(0,10);
    //se crea un usuario en linea para exportar
    let usuarioEnLinea = new UsuarioEnLinea(null, this.selectedLineaObject.id, this.selectedLineaObject.nombre, 0, "", "", this.selectedUsuarioObject.id, this.selectedUsuarioObject.rut, this.selectedUsuarioObject.nombre, this.selectedUsuarioObject.apellido, this.selectedUsuarioObject.rfid, this.dateSave, this.HourSave, "", "", this.selectedCalibradorObject.id, this.selectedCalibradorObject.nombre, this.turnoActual[0].id);
    console.log(usuarioEnLinea);
    this.usuarioEnLineaService.saveUsuarioEnLinea(usuarioEnLinea).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Colaborador en línea agregado');
        this.closeTurnColaboratorChangeLine();
        this.registroService.creaRegistro("Se ha agregado el usuario con rut: " + this.selectedUsuarioObject.rut + ", nombre: " + this.selectedUsuarioObject.nombre + " en la linea " + this.selectedLineaObject.nombre + " del calibrador " + this.selectedCalibradorObject.nombre);
        this.listarUsuariosEnLinea();

      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar al usuario en línea, método agregarUsuarioEnLinea, component usuario-en-linea');
        console.log(err);
        this.toastr.error('No se pudo agregar al colaborador en línea', 'Oops');
      }
    );
  }

  buscarUsuarioPorRut() {
    if (this.rutBusqueda == '') {
      this.rutBusqueda = null;
    }
    this.listarUsuariosEnLinea();
  }

  changeSelectedLinea(newSelected: any) {
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject = newSelected;
    this.listarUsuariosEnLinea();
    this.listarUsuarios();
  }

  changeSelectedCalibrador(newSelected: any) {
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
  }

  changeSelectedUsuario(newSelected: any) {
    this.selectedUsuarioText = newSelected.nombre + ' ' + newSelected.rut;
    this.selectedUsuarioObject = newSelected;
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
        console.log(this.currentUsuarioSelected);
      }
      return `with: ${reason}`;
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

}
