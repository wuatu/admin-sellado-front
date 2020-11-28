import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { RfidService } from 'src/app/services/rfid.service';
import { Rfid } from 'src/app/models/rfid';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { Calibrador } from 'src/app/models/calibrador';
import { LineaService } from 'src/app/services/linea.service';
import { RegistroService } from '../../services/registro.service';
import { Linea } from '../../models/linea';
import { RegistroDevService } from '../../services/registro-dev.service';



@Component({
  selector: 'app-rfids',
  templateUrl: './rfid.component.html',
  styleUrls: ['./rfid.component.css']
})
export class RfidComponent implements OnInit {
  closeResult = '';
  rfids: any;
  nombreRfidAdded: string;
  ipRfidAdded: string;

  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentRfidSelected: Rfid;

  calibradores: any = [];
  selectedCalibradorText: string="Selecciona una calibrador";  
  selectedCalibradorTextModificar: string="Selecciona una calibrador";  
  selectedCalibradorObject:any;
  selectedCalibradorId:string;
  selectedCalibradorObjectModificar:any;

  lineas: any = [];
  selectedLineaText: string="Selecciona una línea";  
  selectedLineaTextModificar: string="Selecciona una línea";  
  selectedLineaObject:any = null;
  selectedLineaId:string = null;
  selectedLineaObjectModificar:any = null;

  selectedRfidObject:any = null;
  
  // Array para el dropdown del selector de baudRate
  dropDownBaudRate: any [] = [{nombre:'115200'}, {nombre:'19200'}, {nombre:'256000'}, {nombre:'38400'}, {nombre:'57600'}, {nombre:'9600'}];
  baudRateText: string="BaudRate";    
  selectedBaudRate:any = null;

  // Array para el dropdown del selector de parity
  dropDownParityBit: any [] = [{nombre:'None'}, {nombre:'Even'}, {nombre:'Odd'}, {nombre:'Space'}, {nombre:'Mart'}];
  parityBitText: string="Parity";    
  selectedParityBit:any = null;

  // Array para el dropdown del selector de stopBits
  dropDownStopBits: any [] = [{nombre:'1'}, {nombre:'1.5'}, {nombre:'2'}];
  stopBitsText: string="Stop Bits";    
  selectedStopBits:any = null;

  // Array para el dropdown del selector de dataBits
  dropDownDataBits: any [] = [{nombre:'5'}, {nombre:'6'}, {nombre:'7'}, {nombre:'8'}];
  dataBitsText: string="Data Bits";    
  selectedDataBits:any = null;
    
  // dropdown del selector de port
  dropDownPort: any = [];// [{nombre:'5'}, {nombre:'6'}, {nombre:'7'}, {nombre:'8'}];
  portText: string="Port";    
  selectedPort:any = null;

  rol: number;
  
  constructor(
    //servicio del modal
    private modalService: NgbModal,
    //servicio de rfid, contiene los metodos CRUD de rfids
    private rfidService: RfidService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    //servicio de calibrador
    private calibradorService:CalibradorService,
    private lineaService:LineaService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  //metodo constructor, se llama cuando todas las vistas estan cargadas
  ngOnInit() {      
    this.listarCalibradores();    
    this.completeDropDownPort();
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
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component rfid');
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  listarLineas(){
    this.lineaService.getLineasId(this.selectedCalibradorObject.id).subscribe(
      res=>{
        this.lineas=res.body;
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener las lineas del calibrador, método listarLineas, component rfid');
        console.log(err);
        this.toastr.error('No se pudo obtener lineas', 'Oops');
      }
    );
  }

  //metodo que trae todos los registros de rfids desde la base de datos
  listarRfids() {
    if(this.selectedCalibradorObject!=null && this.selectedLineaObject==null){
      this.selectedCalibradorId=this.selectedCalibradorObject.id;
      this.selectedLineaId="0";
    }
    else if(this.selectedCalibradorObject!=null && this.selectedLineaObject!=null){      
      this.selectedCalibradorId=this.selectedCalibradorObject.id;
      this.selectedLineaId=this.selectedLineaObject.id;
    }
    this.rfidService.getRfids(this.selectedCalibradorId,this.selectedLineaId).subscribe(
      res => {
        //los registros se almacena en array rfids que sirve para llenar la tabla de vista rfids
        this.rfids = res.body;
        if(res.status == 200){
        }else if(res.status == 204){
          this.toastr.success('no existen rfid actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los rfids, método listarRfids, component rfid');
        if (err.status != 404) {
          this.toastr.error('No se pudo listar Rfid', 'Oops');
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
    console.log(this.nombreRfidAdded);
    console.log( this.selectedLineaObject);
    if (this.nombreRfidAdded == null || this.selectedPort == null || this.selectedBaudRate == null || this.selectedParityBit == null || this.selectedStopBits == null || this.selectedDataBits == null || this.selectedLineaObject.id == null) {
      this.toastr.error('No se pudo guardar Rfid, por favor complete todos los campos.', 'Oops');
      return;
    }
    let rfid = new Rfid(null, this.nombreRfidAdded,this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits,this.selectedLineaObject.id);
    this.rfidService.saveRfid(rfid).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado un rfid, nombre: "+this.nombreRfidAdded+", linea: "+this.selectedLineaObject.nombre+", y calibrador: "+this.selectedLineaObject.nombre_calibrado);
        this.listarRfids();
        this.clearDate();
        this.nombreRfidAdded=null;
        this.ipRfidAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar el rfid, método agregarRfid, component rfid');
        this.toastr.error('No se pudo guardar Rfid', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected
  onEditar(rfid: Rfid) {
    this.currentRfidSelected = rfid;

    this.nombreRfidAdded = this.currentRfidSelected.nombre;
    this.ipRfidAdded = this.currentRfidSelected.ip;

    this.selectedBaudRate = this.currentRfidSelected.baudRate;
    this.baudRateText = this.currentRfidSelected.baudRate;

    this.selectedParityBit = this.currentRfidSelected.parity;
    this.parityBitText = this.currentRfidSelected.parity;

    this.selectedStopBits = this.currentRfidSelected.stopBits;
    this.stopBitsText = this.currentRfidSelected.stopBits;

    this.selectedDataBits = this.currentRfidSelected.dataBits;
    this.dataBitsText = this.currentRfidSelected.dataBits;

    this.selectedPort = this.currentRfidSelected.ip;
    this.portText = this.currentRfidSelected.ip;

    this.lineaService.getLinea(rfid.fk_linea).subscribe(
      res=>{
        this.selectedRfidObject = res.body;
        this.selectedLineaText = this.selectedLineaObject.nombre;
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener las líneas, método onEditar, component rfid');
        this.toastr.error('No se pudo obtener Rfid id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar una rfid
  editarRfid(form: NgForm) {
    if (!form.value.nombre) {
      return;
    }
    let rfid: Rfid;
    if(this.selectedLineaObject){
      rfid = new Rfid(this.currentRfidSelected.id, this.currentRfidSelected.nombre, this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits, this.selectedLineaObject.id);
    }    
    this.rfidService.updateRfid(rfid.id, rfid).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha editado un rfid, id: "+rfid.id+", linea: "+this.selectedLineaObject.nombre+", y calibrador: "+this.selectedLineaObject.nombre_calibrador);
        this.listarRfids();
        this.clearDate();
        this.currentRfidSelected = null;
        this.ipRfidAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo editar el rfid, método editarRfid, component rfid');
        this.toastr.error('No se pudo editar Rfid', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected y abrir el modal
  onEliminar(rfid: Rfid, modal) {
    this.currentRfidSelected = rfid;
    this.open(modal);
  }

  //metodo que elimina una rfid
  eliminarRfid(rfid: Rfid) {
    this.rfidService.deleteRfid(rfid.id).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha eliminado un rfid, id: "+rfid.id+", linea: "+this.selectedLineaObject.nombre+", y calibrador: "+this.selectedLineaObject.nombre_calibrador);
        this.listarRfids();
        this.rfids=[];
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar el rfid, método eliminarRfid, component rfid');
        this.toastr.error('No se pudo eliminar el Rfid', 'Oops');
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
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        this.eliminarRfid(this.currentRfidSelected);
      }
      return `with: ${reason}`;
    }
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
  
  }

  changeSelectedPort(newSelected: any) { 
    this.portText = newSelected.nombre;
    this.selectedPort = newSelected.nombre;
     
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

  changeSelectedLinea(newSelected: any) { 
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
    this.listarRfids();   
  }

  changeSelectedCalibradorLinea(newSelected: any) { 
    this.selectedLineaText = newSelected.nombre;
    this.selectedLineaObject=newSelected;
  }

  clearDate(){
    this.nombreRfidAdded = null;

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
