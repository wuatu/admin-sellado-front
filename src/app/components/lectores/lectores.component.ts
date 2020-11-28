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
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';


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

  // Array para el dropdown del selector de baudRate
  dropDownBaudRate: any [] = [{nombre:'115200'}, {nombre:'19200'}, {nombre:'256000'}, {nombre:'38400'}, {nombre:'57600'}, {nombre:'9600'}];
  baudRateText: string = "BaudRate";    
  selectedBaudRate:any = null;

  // Array para el dropdown del selector de parity
  dropDownParityBit: any [] = [{nombre:'None'}, {nombre:'Even'}, {nombre:'Odd'}, {nombre:'Space'}, {nombre:'Mart'}];
  parityBitText: string ="Parity";    
  selectedParityBit:any = null;

  // Array para el dropdown del selector de stopBits
  dropDownStopBits: any [] = [{nombre:'1'}, {nombre:'1.5'}, {nombre:'2'}];
  stopBitsText: string ="Stop Bits";    
  selectedStopBits:any = null;

  // Array para el dropdown del selector de dataBits
  dropDownDataBits: any [] = [{nombre:'5'}, {nombre:'6'}, {nombre:'7'}, {nombre:'8'}];
  dataBitsText: string ="Data Bits";    
  selectedDataBits:any = null;
    
  // dropdown del selector de port
  dropDownPort: any = [];// [{nombre:'5'}, {nombre:'6'}, {nombre:'7'}, {nombre:'8'}];
  portText: string ="Port";    
  selectedPort:any = null;

  rol:number;

  constructor(
    private modalService: NgbModal,
    private lineaService: LineaService,
    private toastr: ToastrService,
    private calibradorService:CalibradorService,
    private lectorService:LectorService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
    ) {}

  ngOnInit() {
    this.listarCalibradores(); 
    this.completeDropDownPort();
    //this.listarLineas();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
  }


  completeDropDownPort(){
    for(let i = 1; i<100; i++){
      var p = {nombre: 'COM'+i};
      this.dropDownPort.push(p);
    }
    console.log(this.dropDownPort);
  }

  //metodo que lista las calibradores
  listarCalibradores(){
    
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        console.log(res.body);
        this.calibradores=res.body;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo obtener la lista de calibradores, método listarCalibradores, component lectores');
        
      }
    );
  }

  
  //metodo que lista las lineas
  listarLineas(id:string){
    this.lineaService.getLineasId(id).subscribe(
      res=>{
        this.lineas=res.body;
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo obtener la lista de líneas del calibrador, método listarLineas, component lectores');
        
      }
    );
  }

  listarLectores(){
    console.log(this.selectedCalibradorObject.id,"  ", this.selectedLineaObject.id);
    this.lectorService.getLectoresId(this.selectedCalibradorObject.id, this.selectedLineaObject.id).subscribe(
      res=>{
        this.lectores=res.body;
        if(res.status == 200){
        }else if(res.status == 204){
          this.toastr.success('No existen registros de lectores actualmente para mostrar','Operación satisfactoria');
          return;
        }
        
      },
      err=>{
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo obtener la lista de lectores, método listarLectores, component lectores');
        
        this.toastr.error('No se pudo obtener lineas', 'Oops');
        this.lectores=null;
      }
    );
  }

  changeSelectedBaudRate(newSelected: any) { 
    this.baudRateText = newSelected.nombre;
    this.selectedBaudRate = newSelected.nombre;
    console.log(this.selectedBaudRate);      
  }
  changeSelectedParityBit(newSelected: any) { 
    this.parityBitText = newSelected.nombre;
    this.selectedParityBit = newSelected.nombre;
    console.log(this.selectedParityBit);      
  }
  changeSelectedStopBits(newSelected: any) { 
    this.stopBitsText = newSelected.nombre;
    this.selectedStopBits = newSelected.nombre;
    console.log(this.selectedStopBits);      
  }
  changeSelectedDataBits(newSelected: any) { 
    this.dataBitsText = newSelected.nombre;
    this.selectedDataBits = newSelected.nombre;
    console.log(this.selectedDataBits);      
  }

  changeSelectedPort(newSelected: any) { 
    this.portText = newSelected.nombre;
    this.selectedPort = newSelected.nombre;
    console.log(this.selectedPort);      
  }
  
  changeSelectedCalibrador(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject = newSelected;
    this.listarLineas(this.selectedCalibradorObject.id);
      
  }

  changeSelectedLinea(newSelected2: any) { 
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
    if (this.nombreLector == null || this.selectedPort == null || this.selectedBaudRate == null || this.selectedParityBit == null || this.selectedStopBits == null || this.selectedDataBits == null || this.selectedLineaObject.id == null) {
      this.toastr.error('No se pudo guardar el Lector, por favor complete todos los campos.', 'Oops');
      return;
    }
    
    let lector = new Lector(null, this.nombreLector, this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits,this.selectedLineaObject.id);
    
    this.lectorService.saveLector(lector).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado un lector, nombre: "+this.nombreLector);
        this.nombreLector = null;
        this.ipLector = null;
        this.clearDate();
        this.listarLectores();
        
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar el lector', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo agregar lector, método agregarLector, component lectores');
        
        this.clearDate();
      }
    );

  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto linea clickeado a variable global currentLineaSelected y abrir el modal
  onEliminar(lector: Lector, modal) {
    this.currentLectorSelected = lector;
    console.log(this.currentLectorSelected);
  }

  eliminarLector(lector: Lector) {
    this.lectorService.deleteLector(lector.id).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha eliminado un lector, id: "+ lector.id);
        this.listarLectores();
        this.lectores=[];
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo eliminar el lector, método eliminarLector, component lectores');
        
        this.toastr.error('No se pudo eliminar lector', 'Oops');
      }
    );
  }  

  onEditar(lector: Lector) {
    this.currentLectorSelected = lector;

    this.nombreLector = this.currentLectorSelected.nombre;
    this.ipLector = this.currentLectorSelected.ip;

    this.selectedBaudRate = this.currentLectorSelected.baudRate;
    this.baudRateText = this.currentLectorSelected.baudRate;

    this.selectedParityBit = this.currentLectorSelected.parity;
    this.parityBitText = this.currentLectorSelected.parity;

    this.selectedStopBits = this.currentLectorSelected.stopBits;
    this.stopBitsText = this.currentLectorSelected.stopBits;

    this.selectedDataBits = this.currentLectorSelected.dataBits;
    this.dataBitsText = this.currentLectorSelected.dataBits;

    this.selectedPort = this.currentLectorSelected.ip;
    this.portText = this.currentLectorSelected.ip;

    console.log(this.currentLectorSelected);

    this.lineaService.getLinea(lector.fk_linea).subscribe(
      res=>{
        this.selectedLineaObject=res.body;
        this.selectedLineaText=this.selectedLineaObject.nombre;
      },
      err=>{
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo obtener la lista de líneas del calibrador, método onEditar, component lectores');
        
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
      lector = new Lector(this.currentLectorSelected.id, this.nombreLector, this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits, this.selectedLineaObject.id);
      
    }    
    this.lectorService.updateLector(lector.id, lector).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha editado un lector, id: "+lector.id+" y nombre: "+lector.nombre);
        console.log(res);
        this.clearDate();
        this.listarLectores();
        this.currentLectorSelected = null;
      },
      err => {
        this.clearDate();
        this.registroDevService.creaRegistroDev('No se pudo editar el lector, método editarLector, component lectores');
        this.toastr.error('No se pudo editar el lector', 'Oops',);
      }
    );
  }

  clearDate(){
    this.nombreLector = null;

    this.selectedBaudRate = null;
    this.baudRateText = "Baud Rate";

    this.selectedParityBit = null;
    this.parityBitText = "Parity";

    this.selectedStopBits = null;
    this.stopBitsText = "Stop Bits";

    this.selectedDataBits = null;
    this.dataBitsText = "Data Bits";

    this.selectedPort = null;
    this.portText = "Port";
  }

  

}
