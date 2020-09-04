import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { LectorService } from 'src/app/services/lector.service';
import { Lector } from 'src/app/models/lector';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { LineaService } from 'src/app/services/linea.service';
import { Linea } from 'src/app/models/Linea';
import { Calibrador } from 'src/app/models/calibrador';

@Component({
  selector: 'app-lectores',
  templateUrl: './lectores.component.html',
  styleUrls: ['./lectores.component.css']
})
export class LectoresComponent implements OnInit {
  closeResult = '';
  //lectores:any;
  
  nombreLector:string;
  ipLector:string;
    
  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentLectorSelected: Lector;

  calibradores: any = [];
  lineas: any = [];
  lectores: any = [];

  selectedCalibradorText: string="Seleccionar calibrador";  
  selectedCalibradorTextModificar: string="Seleccionar calibrador";  
  selectedCalibradorObject:any;
  selectedCalibradorObjectModificar:any;

  selectedLineaText: string="Seleccionar linea";  
  selectedLineaTextModificar: string="Seleccionar linea";  
  selectedLineaObject:any;
  selectedLineaObjectModificar:any;

  selectedLectorObject:any;

  constructor(
    private modalService: NgbModal,
    private lineaService: LineaService,
    private toastr: ToastrService,
    private calibradorService:CalibradorService,
    private lectorService:LectorService
    ) {}

  ngOnInit() {
    this.listarCalibradores(); 
    //this.listarLineas();
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

  changeSelectedCalibrador(newSelected: any) { 
    console.log("CHANGESELECTEDSELLADORA");
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
      
  }
  //metodo que lista las lineas
  listarLineas(id:string){
    console.log("LISTARLINEAS");
    this.lineaService.getLineasId(id).subscribe(
    //this.calibradorService.getCalibradores().subscribe(
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

  listarLectores(){
    console.log("LISTARLECTORES");
    console.log(this.selectedCalibradorObject.id,"  ", this.selectedLineaObject.id);
    this.lectorService.getLectoresId(this.selectedCalibradorObject.id, this.selectedLineaObject.id).subscribe(
    //this.calibradorService.getCalibradores().subscribe(
      res3=>{
        console.log(res3);
        this.lectores=res3;
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
        this.lectores=null;
      }
    );
  }

  changeSelectedLinea(newSelected2: any) { 
    console.log("CHANGESELECTEDLINEA");
    this.selectedLineaText = newSelected2.nombre;
    this.selectedLineaObject=newSelected2;
    this.listarLectores();
      
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
        this.eliminarLector(this.currentLectorSelected);
      }
      return `with: ${reason}`;
    }
  }

  //metodo que crea un nuevo lector
  agregarLector(form: NgForm) {  
    if (!form.value.nombre || !this.selectedCalibradorObject || !this.selectedLineaObject) {
      this.toastr.error('No se pudo guardar lector', 'Oops');
      this.nombreLector = null;
      this.ipLector = null;
      return;
    }
    
    let lector = new Lector(null, this.nombreLector, this.ipLector,this.selectedLineaObject.id);
    
    this.lectorService.saveLector(lector).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector agregado');
        this.nombreLector = null;
        this.ipLector = null;
        this.listarLectores();
        
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar el lector', 'Oops');
        this.nombreLector = null;
        this.ipLector = null;
      }
    );

  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected y abrir el modal
  onEliminar(lector: Lector, modal) {
    this.currentLectorSelected = lector;
    console.log(this.currentLectorSelected);
    this.open(modal);
  }

  eliminarLector(lector: Lector) {
    this.lectorService.deleteLector(lector.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector eliminado');
        console.log(res);
        this.listarLectores();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar lector', 'Oops');
      }
    );
  }  

  onEditar(lector: Lector) {
    this.currentLectorSelected = lector;
    this.lineaService.getLinea(lector.fk_linea).subscribe(
      res=>{
        this.selectedLineaObject=res;
        this.selectedLineaText=this.selectedLineaObject.nombre;
        console.log("HOLA...");
      },
      err=>{
        console.log(err);
        console.log("HOLA...");
        this.toastr.error('No se pudo obtener el lector id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar un lector
  editarLector(form: NgForm) {
    console.log(this.nombreLector);
    console.log(this.ipLector);
    console.log(this.selectedLineaObject);
    console.log(this.currentLectorSelected);
    if (!form.value.nombre) {
      this.toastr.error('No se pudo editar el lector', 'Oops',);
      return;
    }
    let lector: Lector;
    if(this.selectedLineaObject){
      lector = new Lector(this.currentLectorSelected.id, this.currentLectorSelected.nombre, this.currentLectorSelected.ip, this.selectedLineaObject.id);
      
    }    
    this.lectorService.updateLector(lector.id, lector).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector editado');
        console.log(res);
        this.listarLectores();
        this.currentLectorSelected = null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo editar el lector', 'Oops',);
      }
    );
  }

  

}
