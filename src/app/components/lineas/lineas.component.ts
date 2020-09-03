import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { LineaService } from 'src/app/services/linea.service';
import { Linea } from 'src/app/models/linea';
import { ToastrService } from 'ngx-toastr';
import { SelladoraService } from 'src/app/services/selladora.service';
import { Selladora } from 'src/app/models/selladora';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.css']
})
export class LineasComponent implements OnInit {
  closeResult = '';
  lineas: any;
  currentLineaSelected: Linea;
  selladoras: any = [];
  selectedSelladoraText: string="Seleccionar selladora";  
  selectedSelladoraTextModificar: string="Seleccionar selladora";  
  selectedSelladoraObject:any;
  selectedSelladoraObjectModificar:any;

  constructor(
    //servicio del modal
    private modalService: NgbModal,
    //servicio de linea, contiene los metodos CRUD de lineas
    private lineaService: LineaService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    //servicio de selladora
    private selladoraService:SelladoraService
  ) { }

  //metodo constructor, se llama cuando todas las vistas estan cargadas
  ngOnInit() {      
    this.listarSelladoras();    
  }

  //metodo que lista las selladoras
  listarSelladoras(){
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

  //metodo que trae todos los registros de lineas desde la base de datos
  listarLineas() {  
    console.log(this.selectedSelladoraObject.id);
    this.lineaService.getLineasId(this.selectedSelladoraObject.id).subscribe(
      res => {
        //los registros se almacena en array lineas que sirve para llenar la tabla de vista lineas
        this.lineas = res;
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar líneas', 'Oops');
        } else{
          this.lineas=null;
        }
      }
    )
  }

  //metodo que crea una nueva linea
  agregarLinea(form: NgForm) {  
    if (!form.value.nombre || !this.selectedSelladoraObject) {
      this.toastr.error('No se pudo guardar línea', 'Oops');
      return;
    }
    let linea = new Linea(null, form.value.nombre,this.selectedSelladoraObject.id);
    linea.nombre_selladora=this.selectedSelladoraObject.nombre;
    this.lineaService.saveLinea(linea).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea agregada');
        this.listarLineas();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar línea', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected
  onEditar(linea: Linea) {
    this.currentLineaSelected = linea;
    this.selladoraService.getSelladora(linea.fk_selladora).subscribe(
      res=>{
        this.selectedSelladoraObject=res;
        this.selectedSelladoraText=this.selectedSelladoraObject.nombre;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener selladora id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar una linea
  editarLinea(form: NgForm) {
    console.log(form.value.nombre);
    console.log(this.selectedSelladoraObject);
    if (!form.value.nombre) {
      this.toastr.error('No se pudo editar línea', 'Oops',);
      return;
    }
    let linea: Linea;
    if(this.selectedSelladoraObject){
      linea = new Linea(form.value.id, form.value.nombre, this.selectedSelladoraObject.id);
      linea.nombre_selladora=this.selectedSelladoraObject.nombre;
    }    
    this.lineaService.updateLinea(linea.id, linea).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea editada');
        console.log(res);
        this.listarLineas();
        this.currentLineaSelected = null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo editar línea', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected y abrir el modal
  onEliminar(linea: Linea, modal) {
    this.currentLineaSelected = linea;
    console.log(this.currentLineaSelected);
    this.open(modal);
  }

  //metodo que elimina una linea
  eliminarLinea(linea: Linea) {
    this.lineaService.deleteLinea(linea.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea eliminada');
        console.log(res);
        this.listarLineas();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar línea', 'Oops');
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
      if (reason == 'ok') {
        console.log("hola");
        this.eliminarLinea(this.currentLineaSelected);
      }
      return `with: ${reason}`;
    }
  }

  changeSelectedSelladora(newSelected: any) { 
    this.selectedSelladoraText = newSelected.nombre;
    this.selectedSelladoraObject=newSelected;
    this.listarLineas();  
  }

  changeSelectedSelladoraModificar(newSelected: any) { 
    this.selectedSelladoraText = newSelected.nombre;
    this.selectedSelladoraObject=newSelected;
  }
}
