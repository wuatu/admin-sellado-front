import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { RfidSalidaService } from 'src/app/services/rfid-Salida.service';
import { RfidSalida } from 'src/app/models/rfid-salida';
import { ToastrService } from 'ngx-toastr';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { Calibrador } from 'src/app/models/calibrador';
import { LineaService } from 'src/app/services/linea.service';
import { RegistroService } from '../../services/registro.service';
import { Linea } from '../../models/linea';
import { RegistroDevService } from '../../services/registro-dev.service';


@Component({
  selector: 'app-rfid-salida',
  templateUrl: './rfid-salida.component.html',
  styleUrls: ['./rfid-salida.component.css']
})
export class RfidSalidaComponent implements OnInit {
  closeResult = '';
  rfidsSalida: any;
  nombreRfidSalidaAdded: string;
  ipRfidSalidaAdded: string;

  currentCalibradorSelected: Calibrador;
  currentLineaSelected: Linea;
  currentRfidSalidaSelected: RfidSalida;

  calibradores: any = [];
  selectedCalibradorText: string="Selecciona una calibrador";  
  selectedCalibradorTextModificar: string="Selecciona una calibrador";  
  selectedCalibradorObject:any;
  selectedCalibradorId:string;
  selectedCalibradorObjectModificar:any;

  

  selectedRfidSalidaObject:any = null;
  
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
    private rfidSalidaService: RfidSalidaService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    //servicio de calibrador
    private calibradorService:CalibradorService,
    private lineaService:LineaService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

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
  }

  //metodo que lista las calibradores
  listarCalibradores(){
    this.calibradorService.getCalibradores().subscribe(
      res=>{
        this.calibradores=res.body;
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método listarCalibradores, component rfid-salida');
        console.log(err);
        this.toastr.error('No se pudo obtener calibradores', 'Oops');
      }
    );
  }

  

  //metodo que trae todos los registros de rfids desde la base de datos
  listarRfids() {
    if(this.selectedCalibradorObject!=null ){
      this.selectedCalibradorId=this.selectedCalibradorObject.id;
    }
    this.rfidSalidaService.getRfids(this.selectedCalibradorId).subscribe(
      res => {
        //los registros se almacena en array rfids que sirve para llenar la tabla de vista rfids
        this.rfidsSalida = res.body;
        if(res.status == 200){
        }else if(res.status == 204){
          this.toastr.success('no existen rfid salida actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los rfids salida, método listarRfids, component rfid-salida');
        if (err.status != 404) {
          this.toastr.error('No se pudo listar Rfid salida', 'Oops');
        } else{
          this.rfidsSalida=null;
        }
      }
    )
  }

  //metodo que crea una nueva rfid
  agregarRfidSalida(form: NgForm) {  
    this.nombreRfidSalidaAdded=form.value.nombre;
    this.ipRfidSalidaAdded=form.value.ip;
    if (this.nombreRfidSalidaAdded == null || this.selectedPort == null || this.selectedBaudRate == null || this.selectedParityBit == null || this.selectedStopBits == null || this.selectedDataBits == null || this.selectedCalibradorObject.id == null) {
      this.toastr.error('No se pudo guardar Rfid salida, por favor complete todos los campos.', 'Oops');
      return;
    }
    let rfidSalida = new RfidSalida(null, this.nombreRfidSalidaAdded,this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits,this.selectedCalibradorObject.id);
    this.rfidSalidaService.saveRfid(rfidSalida).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado un rfid salida, nombre: "+this.nombreRfidSalidaAdded+", Calibrador: "+this.selectedCalibradorObject.nombre);
        this.listarRfids();
        this.clearDate();
        this.nombreRfidSalidaAdded=null;
        this.ipRfidSalidaAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar el rfid salida, método agregarRfidSalida, component rfid-salida');
        this.toastr.error('No se pudo guardar Rfid salida', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected
  onEditar(rfidSalida: RfidSalida) {
    this.currentRfidSalidaSelected = rfidSalida;

    this.nombreRfidSalidaAdded = this.currentRfidSalidaSelected.nombre;
    this.ipRfidSalidaAdded = this.currentRfidSalidaSelected.ip;

    this.selectedBaudRate = this.currentRfidSalidaSelected.baudRate;
    this.baudRateText = this.currentRfidSalidaSelected.baudRate;

    this.selectedParityBit = this.currentRfidSalidaSelected.parity;
    this.parityBitText = this.currentRfidSalidaSelected.parity;

    this.selectedStopBits = this.currentRfidSalidaSelected.stopBits;
    this.stopBitsText = this.currentRfidSalidaSelected.stopBits;

    this.selectedDataBits = this.currentRfidSalidaSelected.dataBits;
    this.dataBitsText = this.currentRfidSalidaSelected.dataBits;

    this.selectedPort = this.currentRfidSalidaSelected.ip;
    this.portText = this.currentRfidSalidaSelected.ip;

    
  }

  //metodo que sirve para editar una rfid
  editarRfidSalida(form: NgForm) {
    if (!form.value.nombre) {
      this.toastr.error('No se pudo editar Rfid salida', 'Oops',);
      return;
    }
    let rfidSalida: RfidSalida;
    if(this.selectedCalibradorObject){
      rfidSalida = new RfidSalida(this.currentRfidSalidaSelected.id, this.currentRfidSalidaSelected.nombre, this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits, this.selectedCalibradorObject.id);
    }    
    this.rfidSalidaService.updateRfid(rfidSalida.id, rfidSalida).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha editado un rfid salida, id: "+rfidSalida.id+", Calibrador: "+this.selectedCalibradorObject.nombre);
        this.listarRfids();
        this.clearDate();
        this.currentRfidSalidaSelected = null;
        this.ipRfidSalidaAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo editar el rfid salida, método editarRfidSalida, component rfid-salida');
        console.log(err);
        this.toastr.error('No se pudo editar Rfid salida', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected y abrir el modal
  onEliminar(rfidSalida: RfidSalida, modal) {
    this.currentRfidSalidaSelected = rfidSalida;
    this.open(modal);
  }

  //metodo que elimina una rfid
  eliminarRfidSalida(rfidSalida: RfidSalida) {
    this.rfidSalidaService.deleteRfid(rfidSalida.id).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha eliminado un rfid salida, id: "+rfidSalida.id+", Calibrador: "+this.selectedCalibradorObject.nombre);
        this.listarRfids();
        this.rfidsSalida=[];
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar el rfid salida, método eliminarRfidSalida, component rfid-salida');
        this.toastr.error('No se pudo eliminar el Rfid salida', 'Oops');
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
        this.eliminarRfidSalida(this.currentRfidSalidaSelected);
      }
      return `with: ${reason}`;
    }
  }

  changeSelectedBaudRate(newSelected: any) { 
    this.baudRateText = newSelected.nombre;
    this.selectedBaudRate = newSelected.nombre;
  }
  changeSelectedParityBit(newSelected: any) { 
    this.parityBitText = newSelected.nombre;
    this.selectedParityBit = newSelected.nombre;   
  }
  changeSelectedStopBits(newSelected: any) { 
    this.stopBitsText = newSelected.nombre;
    this.selectedStopBits = newSelected.nombre;   
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
    console.log(this.selectedCalibradorObject);
    this.listarRfids();
     
  }

  changeSelectedCalibradorModificar(newSelected: any) { 
    this.selectedCalibradorText = newSelected.nombre;
    this.selectedCalibradorObject=newSelected;
  }


  clearDate(){
    this.nombreRfidSalidaAdded = null;

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
