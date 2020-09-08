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
import { UsuarioEnLineaService } from '../../services/usuario-en-linea.service';

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
  
  currentUsuarioEnLineaSelected: UsuarioEnLinea;  

  usuariosEnLinea:any = [];

  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentUsuarioSelected: Usuario;

  calibradores: any = [];
  lineas: any = [];
  usuarios: any = [];

  selectedCalibradorText: string="Seleccionar calibrador";  
  selectedCalibradorObject:any;

  selectedLineaText: string="Seleccionar linea";    
  selectedLineaObject:any;


  selectedUsuarioText: string="Seleccionar usuario";   
  selectedUsuarioObject:any;
  
  ngbDatepicker:NgbDate;
  

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private usuarioEnLineaService: UsuarioEnLineaService,
    private usuarioService: UsuarioService,
    private calibradorService: CalibradorService,
    private lineaService: LineaService,


    //public calendar: NgbCalendar,
    //public formatter: NgbDateParserFormatter,
    //public fromDate: NgbDate,
    //public desde: NgbDate,
    //public toDate: NgbDate,
  ) { 
    //var dateFormat = require('dateformat');
    //this.fromDate = calendar.getToday();
    //this.desde = dateFormat(new Date(this.fromDate.year, this.fromDate.month - 1, this.fromDate.day), "dd-mm-yyyy");
    //this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }
  
  ngOnInit() {
    this.listarUsuariosEnLinea();
  }

  onSubmitBuscarPatenteRobadaForm(){

  }

  listarUsuarios(){
    console.log("HOLA ESTOY LISTANDO LOS USUARIOS!!!!");
    
    this.usuarioService.getUsuarios().subscribe(
      res=>{
        console.log(res);
        this.usuarios=res;
        
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
    console.log("HOLA ESTOY LISTANDO CALIBRADORES!!!!");
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
    
  }

  changeSelectedCalibrador(newSelected: any) { 
    console.log("CHANGESELECTEDSELLADORA");
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
      
  }

  changeSelectedLinea(newSelected: any) { 
    console.log("CHANGESELECTEDLINEA");
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
    this.listarUsuarios(); 
  }

  changeSelectedUsuario(newSelected: any) { 
    console.log("CHANGESELECTEDUSUARIO");
    this.selectedUsuarioText = newSelected.nombre + ' ' + newSelected.rut;
    this.selectedUsuarioObject=newSelected;      
  }

  agregarUsuarioEnLinea(){
    
  }

  filtrarUsuarioPorRUT(){

  }

  exportarArchivoExcel(){
    console.log("EXPORTANDO ARCHIVO EXCEL!!!!!!");
  }


  //metodo que abre un modal
  open(modal) {    
    this.listarCalibradores(); 
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

}
