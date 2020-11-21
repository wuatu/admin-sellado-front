import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { LineaService } from 'src/app/services/linea.service';
import { Linea } from 'src/app/models/linea';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { Calibrador } from 'src/app/models/calibrador';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';


@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.css']
})
export class LineasComponent implements OnInit {
  closeResult = '';
  lineas: any;
  currentLineaSelected: Linea
  nombreLineaAdded: string;
  calibradores: any = [];
  selectedCalibradorText: string="Selecciona una calibrador";  
  selectedCalibradorTextModificar: string="Selecciona una calibrador";  
  selectedCalibradorObject:any;
  selectedCalibradorObjectModificar:any;
  rol:number;
  bandera: boolean = false;

  constructor(
    //servicio del modal
    private modalService: NgbModal,
    //servicio de linea, contiene los metodos CRUD de lineas
    private lineaService: LineaService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    //servicio de calibrador
    private calibradorService:CalibradorService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
    ) { }

  //metodo constructor, se llama cuando todas las vistas estan cargadas
  ngOnInit() {      
    this.listarCalibradores(); 
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
  }

  //metodo que lista las calibradores
  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        this.calibradores=res.body;
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component calibradores');
        
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  //metodo que trae todos los registros de lineas desde la base de datos
  listarLineas() {  
    this.bandera = false;
    console.log(this.selectedCalibradorObject.id);
    this.lineaService.getLineasId(this.selectedCalibradorObject.id).subscribe(
      res => {
        //los registros se almacena en array lineas que sirve para llenar la tabla de vista lineas
        this.lineas = res.body;
        if(res.status == 200){
          this.bandera = true;
        }else if(res.status == 204){
          this.toastr.success('No existen registros de líneas actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método listarLineas, component linea');
        if (err.status != 404) {
          this.toastr.error('No se pudo listar líneas', 'Oops');
        } else{
          this.lineas=null;
        }
      }
    )
  }

  //metodo que crea una nueva linea
  agregarLinea(form: NgForm) {  
    this.nombreLineaAdded=form.value.nombre;
    if (!this.nombreLineaAdded || !this.selectedCalibradorObject) {
      this.toastr.error('No se pudo guardar línea', 'Oops');
      return;
    }
    let linea = new Linea(null, this.nombreLineaAdded,this.selectedCalibradorObject.id);
    linea.nombre_calibrador=this.selectedCalibradorObject.nombre;
    this.lineaService.saveLinea(linea).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado una línea, nombre: "+ this.nombreLineaAdded+", calibradora: "+this.selectedCalibradorObject.nombre);
        this.listarLineas();
        this.nombreLineaAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar la línea, método agregarLinea, component linea');
        this.toastr.error('No se pudo guardar línea', 'Oops');
        this.lineas=null;
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected
  onEditar(linea: Linea) {
    this.currentLineaSelected = linea;
    this.calibradorService.getCalibrador(linea.fk_calibrador).subscribe(
      res=>{
        this.selectedCalibradorObject=res.body;
        this.selectedCalibradorText=this.selectedCalibradorObject.nombre;
      },
      err=>{
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo obetener el calibrador, método onEditar, component linea');
        
        this.toastr.error('No se pudo obtener calibrador id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar una linea
  editarLinea(form: NgForm) {
    console.log(form.value.nombre);
    console.log(this.selectedCalibradorObject);
    if (!form.value.nombre) {
      this.toastr.error('No se pudo editar línea', 'Oops',);
      return;
    }
    let linea: Linea;
    if(this.selectedCalibradorObject){
      linea = new Linea(form.value.id, form.value.nombre, this.selectedCalibradorObject.id);
      linea.nombre_calibrador=this.selectedCalibradorObject.nombre;
    }    
    this.lineaService.updateLinea(linea.id, linea).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha editado una linea, id: "+ linea.id+", calibradora: "+this.selectedCalibradorObject.nombre);
        this.listarLineas();
        this.currentLineaSelected = null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo editar la linea, método editarLinea, component linea');
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
        this.registroService.creaRegistro("Se ha eliminado una linea, id: "+ linea.id+", calibradora: "+this.selectedCalibradorObject.nombre);
        console.log(res);
        this.listarLineas();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar la línea, método eliminarLinea, component linea');
        
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
        this.eliminarLinea(this.currentLineaSelected);
      }
      return `with: ${reason}`;
    }
  }

  changeSelectedCalibrador(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
    this.listarLineas();  
  }

  changeSelectedCalibradorModificar(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
  }
}
