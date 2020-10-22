import { Component, OnInit } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { Calibrador } from 'src/app/models/calibrador';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { LectorValidador } from '../../models/lector-validador';
import { LectorValidadorService } from '../../services/lector-validador.service';

@Component({
  selector: 'app-lector-validador',
  templateUrl: './lector-validador.component.html',
  styleUrls: ['./lector-validador.component.css']
})
export class LectorValidadorComponent implements OnInit {
  closeResult = '';
  
  nombreValidador:string = null;
  ipValidador:string = null;
  max_wait_time	: string = null;
  bandera:any = null;
    
  currentCalibradorSelected: Calibrador;
  currentLectorValidadorSelected: LectorValidador;

  calibradores: any = [];
  lectoresValidador: any = [];

  selectedCalibradorText: string="Seleccionar calibrador";  
  selectedCalibradorTextModificar: string="Seleccionar calibrador";  
  selectedCalibradorObject: any;
  selectedCalibradorObjectModificar:any;

  selectedLectorObject:any;
  
  rol:number;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private calibradorService:CalibradorService,
    private lectorValidadorService:LectorValidadorService,
    private registroService: RegistroService

  ) { }

  ngOnInit() {
    this.listarCalibradores(); 
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: "+this.rol);

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

  listarLectoresValidador(){
    console.log("LISTARLECTORESVALIDADOR");
    console.log(this.selectedCalibradorObject.id);
    this.lectorValidadorService.getLectoresValidadorId(this.selectedCalibradorObject.id).subscribe(
    //this.calibradorService.getCalibradores().subscribe(
      res=>{
        console.log(res);
        this.lectoresValidador=res;
        this.toastr.success('Lectores validadores listados','Operación satisfactoria');
        this.bandera = "mostrar";
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener letores validadores', 'Oops');
        this.lectoresValidador=null;
      }
    );
  }

  changeSelectedCalibrador(newSelected: any) { 
    console.log("CHANGESELECTEDSELLADORA");
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLectoresValidador();
      
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
    this.nombreValidador = null;
    this.ipValidador = null;
    this.max_wait_time = null;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        this.eliminarLector(this.currentLectorValidadorSelected);
      }
      return `with: ${reason}`;
    }
  }

  //metodo que crea un nuevo lector
  agregarLector(form: NgForm) {  
    if (this.nombreValidador == null || this.ipValidador == null || this.max_wait_time == null) {
      this.toastr.error('No se pudo guardar el Lector validador, por favor complete todos los campos.', 'Oops');
      return;
    }
    
    let lectorValidador = new LectorValidador(null, this.nombreValidador, this.ipValidador, this.max_wait_time, this.selectedCalibradorObject.id);
    
    this.lectorValidadorService.saveLectorValidador(lectorValidador).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector agregado');
        this.registroService.creaRegistro("Se ha creado un lector validador, nombre: "+this.nombreValidador);
        this.nombreValidador = null;
        this.ipValidador = null;
        this.max_wait_time = null;
        this.listarLectoresValidador();
        
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar el lector', 'Oops');
        
      }
    );

  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected y abrir el modal
  onEliminar(lectorValidador: LectorValidador, modal) {
    this.currentLectorValidadorSelected = lectorValidador;
    console.log(this.currentLectorValidadorSelected);
  }

  eliminarLector(lectorValidador: LectorValidador) {
    this.lectorValidadorService.deleteLectorValidador(lectorValidador.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector Validador eliminado');
        this.registroService.creaRegistro("Se ha eliminado un lector validador, id: "+ lectorValidador.id);
        console.log(res);
        this.listarLectoresValidador();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar lector validador', 'Oops');
      }
    );
  }  

  onEditar(lectorValidador: LectorValidador) {
    this.currentLectorValidadorSelected = lectorValidador;
    this.nombreValidador = this.currentLectorValidadorSelected.nombre;
    this.ipValidador = this.currentLectorValidadorSelected.ip;
    this.max_wait_time = this.currentLectorValidadorSelected.max_wait_time;
    console.log("nombre: "+this.nombreValidador);
    console.log("ip: "+this.ipValidador);
    console.log("max: "+this.max_wait_time);

  }

  //metodo que sirve para editar un lector
  editarLector(form: NgForm) {
    
    if (this.nombreValidador == null || this.ipValidador == null || this.max_wait_time == null ) {
      
      this.toastr.error('No se pudo editar el lector, se deben llenar todos los campos', 'Oops',);
      return;
    }
    let lectorValidador: LectorValidador;
    if(this.selectedCalibradorObject){
      lectorValidador = new LectorValidador(this.currentLectorValidadorSelected.id, this.nombreValidador, this.ipValidador, this.max_wait_time,  this.selectedCalibradorObject.id);
      this.lectorValidadorService.updateLectorValidador(lectorValidador.id, lectorValidador).subscribe(
        res => {
          this.toastr.success('Operación satisfactoria', 'Lector Validador editado');
          this.registroService.creaRegistro("Se ha editado un lector Validador, id: "+lectorValidador.id+" y nombre: "+lectorValidador.nombre);
          console.log(res);
          
          this.listarLectoresValidador();
          this.currentLectorValidadorSelected = null;
          this.nombreValidador = null;
          this.ipValidador = null;
          this.max_wait_time = null;
        },
        err => {
          console.log(err);
          
          this.toastr.error('No se pudo editar el lector Validador', 'Oops',);
        }
      );
    }    
    
  }

}
