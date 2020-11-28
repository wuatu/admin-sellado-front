import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';
import { RfidRegistroColaboradorService } from '../../services/rfid-registro-colaborador.service';
import { RfidRegistroColaborador } from '../../models/rfid-registro-colaborador';

@Component({
  selector: 'app-rfid-registro-colaborador',
  templateUrl: './rfid-registro-colaborador.component.html',
  styleUrls: ['./rfid-registro-colaborador.component.css']
})
export class RfidRegistroColaboradorComponent implements OnInit {
  closeResult = '';
  rfidsRegistroColaborador: any;
  nombreRfidRegistroColaboradorAdded: string;
  ipRfidRegistroColaboradorAdded: string;
  currentRfidRegistroColaboradorSelected: RfidRegistroColaborador;
  selectedRfidRegistroColaboradorObject:any = null;
  
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
    private modalService: NgbModal,
    private rfidRegistroColaboradorService: RfidRegistroColaboradorService,
    private toastr: ToastrService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarRfidsRegistroColaborador();
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

  //metodo que trae todos los registros de rfids desde la base de datos
  listarRfidsRegistroColaborador() {
    
    this.rfidRegistroColaboradorService.getRfidsRegisterCollaborator().subscribe(
      res => {
        //los registros se almacena en array rfids que sirve para llenar la tabla de vista rfids
        this.rfidsRegistroColaborador = res.body;
        if(res.status == 200){
        }else if(res.status == 204){
          this.toastr.success('no existen rfid registro colaborador actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los rfids registro colaborador, método listarRfidsRegistroColaborador, component rfid-registro-colaborador');
        if (err.status != 404) {
          this.toastr.error('No se pudo listar rfid registro colaborador', 'Oops');
        } else{
          this.rfidsRegistroColaborador=null;
        }
      }
    )
  }

  //metodo que crea una nueva rfid
  agregarRfidRegistroColaborador(form: NgForm) {  
    this.nombreRfidRegistroColaboradorAdded=form.value.nombre;
    this.ipRfidRegistroColaboradorAdded=form.value.ip;
    if (this.nombreRfidRegistroColaboradorAdded == null || this.selectedPort == null || this.selectedBaudRate == null || this.selectedParityBit == null || this.selectedStopBits == null || this.selectedDataBits == null) {
      this.toastr.error('No se pudo guardar rfid registro colaborador, por favor complete todos los campos.', 'Oops');
      return;
    }
    let rfidRegistroColaborador = new RfidRegistroColaborador(null, this.nombreRfidRegistroColaboradorAdded,this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits);
    this.rfidRegistroColaboradorService.saveRfidRegisterCollaborator(rfidRegistroColaborador).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado un rfid registro colaborador, nombre: "+this.nombreRfidRegistroColaboradorAdded);
        this.listarRfidsRegistroColaborador();
        this.clearDate();
        this.nombreRfidRegistroColaboradorAdded=null;
        this.ipRfidRegistroColaboradorAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar el rfid, método agregarRfidRegistroColaborador, component rfid-registro-colaborador');
        this.toastr.error('No se pudo guardar Rfid registro colaborador', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected
  onEditar(rfidRegistroColaborador: RfidRegistroColaborador) {
    this.currentRfidRegistroColaboradorSelected = rfidRegistroColaborador;

    this.nombreRfidRegistroColaboradorAdded = this.currentRfidRegistroColaboradorSelected.nombre;
    this.ipRfidRegistroColaboradorAdded = this.currentRfidRegistroColaboradorSelected.ip;

    this.selectedBaudRate = this.currentRfidRegistroColaboradorSelected.baudRate;
    this.baudRateText = this.currentRfidRegistroColaboradorSelected.baudRate;

    this.selectedParityBit = this.currentRfidRegistroColaboradorSelected.parity;
    this.parityBitText = this.currentRfidRegistroColaboradorSelected.parity;

    this.selectedStopBits = this.currentRfidRegistroColaboradorSelected.stopBits;
    this.stopBitsText = this.currentRfidRegistroColaboradorSelected.stopBits;

    this.selectedDataBits = this.currentRfidRegistroColaboradorSelected.dataBits;
    this.dataBitsText = this.currentRfidRegistroColaboradorSelected.dataBits;

    this.selectedPort = this.currentRfidRegistroColaboradorSelected.ip;
    this.portText = this.currentRfidRegistroColaboradorSelected.ip;
  }

  //metodo que sirve para editar una rfid
  editarRfidRegistroColaborador(form: NgForm) {
    if (!form.value.nombre) {
      return;
    }
    let rfidRegistroColaborador: RfidRegistroColaborador;
    rfidRegistroColaborador = new RfidRegistroColaborador(this.currentRfidRegistroColaboradorSelected.id, this.currentRfidRegistroColaboradorSelected.nombre, this.selectedPort, this.selectedBaudRate, this.selectedParityBit, this.selectedStopBits, this.selectedDataBits);
      
    this.rfidRegistroColaboradorService.updateRfidRegisterCollaborator(rfidRegistroColaborador.id, rfidRegistroColaborador).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha editado un rfid cegistro colaborador, id: "+rfidRegistroColaborador.id);
        this.listarRfidsRegistroColaborador();
        this.clearDate();
        this.currentRfidRegistroColaboradorSelected = null;
        this.ipRfidRegistroColaboradorAdded=null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo editar el rfid, método editarRfidRegistroColaborador, component rfid-registro-colaborado');
        this.toastr.error('No se pudo editar Rfid Registro Colaborador', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto rfid clickeado a variable global currentRfidSelected y abrir el modal
  onEliminar(rfidRegistroColaborador: RfidRegistroColaborador, modal) {
    this.currentRfidRegistroColaboradorSelected = rfidRegistroColaborador;
    this.open(modal);
  }

  //metodo que elimina una rfid
  eliminarRfidRegistroColaborador(rfidRegistroColaborador: RfidRegistroColaborador) {
    this.rfidRegistroColaboradorService.deleteRfidRegisterCollaborator(rfidRegistroColaborador.id).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha eliminado un rfid registro colaborador, id: "+rfidRegistroColaborador.id);
        this.listarRfidsRegistroColaborador();
        this.rfidsRegistroColaborador=[];
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar el rfid registro colaborado, método eliminarRfidRegistroColaborador, component rfid-registro-colaborador');
        this.toastr.error('No se pudo eliminar el rfid registro colaborado', 'Oops');
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
        this.eliminarRfidRegistroColaborador(this.currentRfidRegistroColaboradorSelected);
      }
      return `with: ${reason}`;
    }
  }

  clearDate(){
    this.nombreRfidRegistroColaboradorAdded = null;

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


}
