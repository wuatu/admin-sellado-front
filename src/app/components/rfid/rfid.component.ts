import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { RfidService } from 'src/app/services/rfid.service';
import { Rfid } from 'src/app/models/rfid';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { Calibrador } from 'src/app/models/calibrador';
import { LineaService } from 'src/app/services/linea.service';

@Component({
  selector: 'app-rfids',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.css']
})
export class RfidComponent implements OnInit {
  closeResult = '';
  rfids: any;
  currentRfidSelected: Rfid
  nombreRfidAdded: string;
  ipRfidAdded: string;

  calibradores: any = [];
  selectedCalibradorText: string="Selecciona una calibrador";  
  selectedCalibradorTextModificar: string="Selecciona una calibrador";  
  selectedCalibradorObject:any;
  selectedCalibradorId:string;
  selectedCalibradorObjectModificar:any;

  lineas: any = [];
  selectedLineaText: string="Selecciona una línea";  
  selectedLineaTextModificar: string="Selecciona una línea";  
  selectedLineaObject:any;
  selectedLineaId:string;
  selectedLineaObjectModificar:any;

  constructor(
    //servicio del modal
    private modalService: NgbModal,
    //servicio de rfid, contiene los metodos CRUD de rfids
    private rfidService: RfidService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    //servicio de calibrador
    private calibradorService:CalibradorService,
    private lineaService:LineaService
  ) { }

  //metodo constructor, se llama cuando todas las vistas estan cargadas
  ngOnInit() {      
    this.listarCalibradores();    
    this.listarLineas();  
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

  listarLineas(){
    this.lineaService.getLineas().subscribe(
      res=>{
        console.log(res);
        this.lineas=res;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }

  //metodo que trae todos los registros de rfids desde la base de datos
  listarRfids() {
    console.log(this.selectedCalibradorObject);  
    if(this.selectedCalibradorObject!=null && this.selectedLineaObject==null){
      this.selectedCalibradorId=this.selectedCalibradorObject.id;
      this.selectedLineaId="0";
    }
    else if(this.selectedCalibradorObject!=null && this.selectedLineaObject!=null){      
      this.selectedCalibradorId=this.selectedCalibradorObject.id;
      this.selectedLineaId=this.selectedLineaObject.id;
    }
    console.log(this.selectedCalibradorId);
    console.log(this.selectedLineaId);
    this.rfidService.getRfids(this.selectedCalibradorId,this.selectedLineaId).subscribe(
      res => {
        //los registros se almacena en array rfids que sirve para llenar la tabla de vista rfids
        this.rfids = res;
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar líneas', 'Oops');
        } else{
          this.rfids=null;
        }
      }
    )
  }

  //metodo que crea una nueva rfid
  agregarRfid(form: NgForm) {  
    this.nombreRfidAdded=form.value.nombre;
    this.ipRfidAdded=form.value.ip;
    if (!this.nombreRfidAdded || !this.selectedLineaObject) {
      this.toastr.error('No se pudo guardar línea', 'Oops');
      return;
    }
    let rfid = new Rfid(null, this.nombreRfidAdded,this.ipRfidAdded,this.selectedLineaObject.id);
    this.rfidService.saveRfid(rfid).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea agregada');
        this.listarRfids();
        this.nombreRfidAdded=null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar línea', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected
  onEditar(rfid: Rfid) {
    this.currentRfidSelected = rfid;
    this.lineaService.getLinea(rfid.fk_linea).subscribe(
      res=>{
        this.selectedLineaObject=res;
        this.selectedLineaText=this.selectedLineaObject.nombre;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener linea id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar una rfid
  editarRfid(form: NgForm) {
    console.log(form.value.nombre);
    console.log(this.selectedLineaObject);
    if (!form.value.nombre) {
      this.toastr.error('No se pudo editar línea', 'Oops',);
      return;
    }
    let rfid: Rfid;
    if(this.selectedLineaObject){
      rfid = new Rfid(form.value.id, form.value.nombre, form.value.ip, this.selectedLineaObject.id);
    }    
    this.rfidService.updateRfid(rfid.id, rfid).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea editada');
        console.log(res);
        this.listarRfids();
        this.currentRfidSelected = null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo editar línea', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected y abrir el modal
  onEliminar(rfid: Rfid, modal) {
    this.currentRfidSelected = rfid;
    console.log(this.currentRfidSelected);
    this.open(modal);
  }

  //metodo que elimina una rfid
  eliminarRfid(rfid: Rfid) {
    this.rfidService.deleteRfid(rfid.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea eliminada');
        console.log(res);
        this.listarRfids();
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
        this.eliminarRfid(this.currentRfidSelected);
      }
      return `with: ${reason}`;
    }
  }

  changeSelectedCalibrador(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
    console.log(this.selectedCalibradorObject);
    this.listarRfids();  
  }

  changeSelectedCalibradorModificar(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
  }

  changeSelectedLinea(newSelected: any) { 
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
    this.listarRfids();   
  }

  changeSelectedCalibradorLinea(newSelected: any) { 
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
  }
}
