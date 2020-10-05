import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { NgbModal, ModalDismissReasons, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
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



declare var require: any;


@Component({
  selector: 'app-usuario-en-linea',
  templateUrl: './usuario-en-linea.component.html',
  styleUrls: ['./usuario-en-linea.component.css']
})
export class UsuarioEnLineaComponent implements OnInit {
  closeResult = '';

  rutUsuario:string;
  nombreUsuario:string;
  apellidoUsuario:string;
  fechaInicio:string;
  fechaTermino:string;
  horaInicio:string;
  horaTermino:string;
  
  currentUsuarioEnLineaSelected: UsuarioEnLinea;  

  usuariosEnLinea:any = [];

  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentUsuarioSelected: Usuario;

  calibradores: any = [];
  lineas: any = [];
  usuarios: any = [];

  selectedCalibradorText: string="Seleccionar calibrador";  
  selectedCalibradorObject:any ;

  selectedLineaText: string="Seleccionar linea";    
  selectedLineaObject:any ;


  selectedUsuarioText: string="Seleccionar usuario";   
  selectedUsuarioObject:any;
  
  //calendar
  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate;
  toDate: NgbDate | null = null;
  isBusqueda = false;
  desde: string = null;
  hasta: string = null;
  tituloBuscarPatente = "Búsqueda de patente";
  cantidadResultadoBusqueda = 0;

  rutBusqueda: string=null;

  nombreLinea: string ="lineaPrueba";
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

  

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private usuarioEnLineaService: UsuarioEnLineaService,
    private usuarioService: UsuarioService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,
    public calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private registroService: RegistroService

  ) { }
  
  ngOnInit() {
    this.listarCalibradores();

  }

  onSubmitBuscarUsuarioForm(){

  }

  listarUsuarios(){
    this.usuarioService.getUsuarios().subscribe(
      res=>{
        console.log(res);
        this.usuarios=res;
        //this.listarCalibradores();
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los usuarios', 'Oops');
      }
    );
  }

  listarLineas(id:string){
    console.log("HOLA ESTOY LISTANDO !!!!");
    this.lineaService.getLineasId(id).subscribe(
      res2=>{
        console.log(res2);
        this.lineas=res2;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }

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
  
  listarUsuariosEnLinea(){
    if(this.selectedLineaText == "Seleccionar linea" || this.selectedCalibradorText == "Seleccionar calibrador"){
      this.toastr.error('Se debe seleccionar calibradora y linea ','Oops');
      return;  
    }
    this.exportUsuarioEnLineaArray = [];  
    this.usuarioEnLineaService.getUsuariosEnLinea(this.selectedLineaObject.id, this.selectedCalibradorObject.id,this.rutBusqueda,this.desde,this.hasta).subscribe(    
      res=>{
        console.log(res);
        this.usuariosEnLinea=res;
        console.log(this.usuariosEnLinea);
        console.log("entro");

        //Se crea un objeto de la clase export-usuario-en-linea con la información devuelta de la base de datos 
        for (let element of this.usuariosEnLinea){
           
            this.timeStart = element.hora_inicio;
            //this.timeStart = this.timeStart.substring(11,19);
            this.dateStart = element.fecha_inicio;
            //this.dateStart = this.dateStart.substring(0,10);
            //console.log(element.fecha_inicio);
            //console.log(new Date(element.fecha_inicio));
            //console.log(new Date(element.fecha_inicio).toString());
            let exportUsuarioEnLinea = new ExportUsuarioEnLinea(element.usuario_rut, element.nombre_usuario, element.apellido_usuario, element.nombre_linea, element.nombre_calibrador, this.timeStart, this.dateStart, this.timeFinish, this.dateFinish);
            this.exportUsuarioEnLineaArray.push(exportUsuarioEnLinea);
            console.log(this.rutBusqueda);
            console.log(this.desde);
            console.log(this.hasta);
            if(this.selectedLineaObject.id && this.selectedCalibradorObject.id && this.rutBusqueda!=null && this.desde && this.hasta!=null){
              this.exportUsuarioEnLineaArrayAux=this.exportUsuarioEnLineaArray;
            }
        }
        if(this.usuariosEnLinea.length==0){
          this.exportUsuarioEnLineaArray=null;
        }
        if(this.toDate != null || this.hasta != null || this.rutUsuario != null){
          this.toDate = null;
          this.hasta=null;
          this.rutUsuario=null;
        }
        console.log(this.exportUsuarioEnLineaArray);
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener los colaboradores en linea', 'Oops');
      }
    );
  }

  exportarArchivoExcel(){
    // Se convierte el arreglo con los usuarios en linea 
     var jsonArray = JSON.parse(JSON.stringify(this.exportUsuarioEnLineaArray))

     console.log(jsonArray);
     //se convierte el Json a xlsx en formato workSheet
     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(jsonArray);

     /* genera el workbook y agrega el worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'colaboradores en línea');

     /* Guarda el archivo */
     let fecha = (new Date()).toISOString();
     XLSX.writeFile(wb, this.nombreExcel+"_"+ fecha.substring(0,10)+".xls");
  }

  agregarUsuarioEnLinea(){
    //se guarda la fecha actual y se crea un substring para dar formato hh:mm yyyy:mm:dd
    this.dateSave = this.fecha().substring(0,10);
    this.HourSave = this.fecha().substring(11,19);
    //this.dateSave = this.dateSave.substring(11,16)+" "+this.dateSave.substring(0,10);
    //se crea un usuario en linea para exportar
    let usuarioEnLinea = new UsuarioEnLinea(null, this.selectedLineaObject.id, this.selectedLineaObject.nombre, 0,"", "", this.selectedUsuarioObject.id, this.selectedUsuarioObject.rut, this.selectedUsuarioObject.nombre, this.selectedUsuarioObject.apellido, this.selectedUsuarioObject.rfid,this.dateSave, this.HourSave, "","" , this.selectedCalibradorObject.id, this.selectedCalibradorObject.nombre);
    console.log(usuarioEnLinea);
    this.usuarioEnLineaService.saveUsuarioEnLinea(usuarioEnLinea).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Colaborador en línea agregado');
        this.registroService.creaRegistro("Se ha agregado el usuario con rut: "+this.selectedUsuarioObject.rut+", nombre: "+ this.selectedUsuarioObject.nombre+" en la linea "+ this.selectedLineaObject.nombre+" del calibrador "+ this.selectedCalibradorObject.nombre);
        this.listarUsuariosEnLinea();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo agregar al colaborador en línea', 'Oops'); 
      }
    );
  }

  buscarUsuarioPorRut(){
    if(this.rutBusqueda==''){
      this.rutBusqueda=null;
    }
    this.listarUsuariosEnLinea();
    /*
    console.log(this.rutBusqueda);
    console.log(this.dateStartSearch);
    console.log(this.dateFinishSearch);
    this.exportUsuarioEnLineaArray = [];
    this.usuarioEnLineaService.searchUsuarioEnLinea(this.rutBusqueda, this.dateStartSearch).subscribe(
      res=>{
        console.log(res);
        this.usuariosEnLinea=res;
        console.log(this.usuariosEnLinea);
        //Se crea un objeto de la clase export-usuario-en-linea con la información devuelta de la base de datos 
        for (let element of this.usuariosEnLinea){
            this.timeStart = element.fecha_inicio;
            this.timeStart = this.timeStart.substring(0,5);
            this.dateStart = element.fecha_inicio;
            this.dateStart = this.dateStart.substring(6,16);
            let exportUsuarioEnLinea = new ExportUsuarioEnLinea(element.usuario_rut, element.nombre_usuario, element.apellido_usuario, element.nombre_linea, element.nombre_calibrador,this.timeStart, this.dateStart, this.timeFinish, this.dateFinish);
            this.exportUsuarioEnLineaArray.push(exportUsuarioEnLinea) ;  
        }
        console.log(this.exportUsuarioEnLineaArray);
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener los usuarios en linea', 'Oops');
      }
      
    );

    */

  }
  
  changeSelectedLinea(newSelected: any) { 
    console.log("CHANGESELECTEDLINEA");
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
    this.listarUsuariosEnLinea();
    this.listarUsuarios(); 
  }

  changeSelectedCalibrador(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
  }

  changeSelectedUsuario(newSelected: any) { 
    console.log("CHANGESELECTEDUSUARIO");
    this.selectedUsuarioText = newSelected.nombre + ' ' + newSelected.rut;
    this.selectedUsuarioObject=newSelected;      
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

}
