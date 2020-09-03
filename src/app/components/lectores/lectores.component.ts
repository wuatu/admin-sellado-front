import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { LectorService } from 'src/app/services/lector.service';
import { Lector } from 'src/app/models/lector';
import { ToastrService } from 'ngx-toastr';
import { SelladoraService } from 'src/app/services/selladora.service';
import { LineaService } from 'src/app/services/linea.service';
import { Linea } from 'src/app/models/Linea';
import { Selladora } from 'src/app/models/selladora';

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
    
  currentSelladoraSelected: Selladora;
  currentLineaSelected: Linea;
  currentLectorSelected: Lector;

  selladoras: any = [];
  lineas: any = [];
  lectores: any = [];

  selectedSelladoraText: string="Seleccionar selladora";  
  selectedSelladoraTextModificar: string="Seleccionar selladora";  
  selectedSelladoraObject:any;
  selectedSelladoraObjectModificar:any;

  selectedLineaText: string="Seleccionar linea";  
  selectedLineaTextModificar: string="Seleccionar linea";  
  selectedLineaObject:any;
  selectedLineaObjectModificar:any;

  selectedLectorObject:any;

  constructor(
    private modalService: NgbModal,
    private lineaService: LineaService,
    private toastr: ToastrService,
    private selladoraService:SelladoraService,
    private lectorService:LectorService
    ) {}

  ngOnInit() {
    this.listarSelladoras(); 
    //this.listarLineas();
  }

  //metodo que lista las selladoras
  listarSelladoras(){
    console.log("LISTARSELLADORES");
    this.selladoraService.getSelladoras().subscribe(
      res=>{
        console.log(res);
        this.selladoras=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener selladoras', 'Oops');
      }
    );
  }

  changeSelectedSelladora(newSelected: any) { 
    console.log("CHANGESELECTEDSELLADORA");
    this.selectedSelladoraText = newSelected.nombre;
    this.selectedSelladoraObject = newSelected;
    this.listarLineas(this.selectedSelladoraObject.id);
      
  }
  //metodo que lista las lineas
  listarLineas(id:string){
    console.log("LISTARLINEAS");
    this.lineaService.getLineasId(id).subscribe(
    //this.selladoraService.getSelladoras().subscribe(
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
    console.log(this.selectedSelladoraObject.id,"  ", this.selectedLineaObject.id);
    this.lectorService.getLectoresId(this.selectedSelladoraObject.id, this.selectedLineaObject.id).subscribe(
    //this.selladoraService.getSelladoras().subscribe(
      res3=>{
        console.log(res3);
        this.lectores=res3;
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
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
        console.log("hola");
        console.log(this.currentLectorSelected);
        this.eliminarLector(this.currentLectorSelected);
      }
      return `with: ${reason}`;
    }
  }

  //metodo que crea un nuevo lector
  agregarLector(form: NgForm) {  
    if (!form.value.nombre || !this.selectedSelladoraObject || !this.selectedLineaObject) {
      this.toastr.error('No se pudo guardar lector', 'Oops');
      this.nombreLector = null;
      this.ipLector = null;
      return;
    }
    console.log("LA DIRECCION IP DEL FORM ES ", form.value.nombre);
    let lector = new Lector(null, this.nombreLector, this.ipLector,this.selectedLineaObject.id);
    
    this.lectorService.saveLector(lector).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector agregado');
        this.nombreLector = null;
        this.ipLector = null;
        
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
        this.toastr.error('No se pudo obtener la linea id', 'Oops',);
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
      lector = new Lector(this.currentLectorSelected.id, this.currentLectorSelected.nombre, this.currentLectorSelected.puerto, this.selectedLineaObject.id);
      
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
