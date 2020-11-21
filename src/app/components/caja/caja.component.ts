import { Component, OnInit } from '@angular/core';
import { CajaService } from 'src/app/services/caja.service';
import { Caja } from 'src/app/models/caja';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';


@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  registrosDev:any = [];
  pageOfItems: Array<any>;
  p: number = 1;

  closeResult = '';
  currentCajaSelected: Caja
  cajas: any = [];
  resultSearch: any;
  id: string;
  envaseCaja: string;
  variedadCaja: string;
  categoriaCaja: string;
  calibreCaja: string;
  correlativoCaja: string;
  ponderacionCaja: number;
  rol: number;
  criterio:string = null;
  bandera:boolean = false;

  constructor(
    private cajaService: CajaService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarCajas();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: "+this.rol);
  }

  searchBox(){
   
    if(this.criterio == null){
      this.toastr.error('Ingrese un id o envase a buscar','Oops');
      return;
    }
    this.bandera = false;
    this.cajaService.searchBox(this.criterio).subscribe(
      res =>{
        if(res.status == 200){
          this.cajas = null;
          this.cajas = res.body;
          this.bandera = true;
        }else if(res.status == 204){
          this.toastr.success('No existen registros para mostrar en la búsqueda','Búsqueda satisfactoria');
          return;  
        }
      },
    err =>{
      this.registroDevService.creaRegistroDev('No se pudo realizar la búsqueda de cajas, método searchBox, component caja');
    }
    )
  }

  //metodo que trae todos los registros de cajas desde la base de datos
  listarCajas() {
    this.bandera = false;
    this.cajaService.getCajas().subscribe(
      res => {
        //los registros se almacena en array cajas que sirve para llenar la tabla de vista cajas
        this.cajas = res.body;
        if(res.status == 200){
          this.bandera = true;
        }else if(res.status == 204){
          this.toastr.success('No existen registros de cajas actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar cajas', 'Oops');
          this.registroDevService.creaRegistroDev('No se pudo obtener la lista de cajas, método listarCajas, component caja');
        } else {
          this.cajas = null;
        }
      }
    )
  }

  //metodo que crea un nuevo caja
  agregarCaja() {    
    console.log(this.envaseCaja);
    if (!this.envaseCaja || !this.variedadCaja || !this.categoriaCaja || !this.calibreCaja || !this.correlativoCaja || !this.ponderacionCaja) {
      this.toastr.error('No se pudo guardar caja', 'Oops');
      return;
    }
    let caja = new Caja(null, this.envaseCaja, this.variedadCaja, this.categoriaCaja, this.calibreCaja, this.correlativoCaja, this.ponderacionCaja);
    console.log(caja);
    this.cajaService.saveCaja(caja).subscribe(
      res => {
        this.registroService.creaRegistro("Se ha creado una caja, envase: "+this.envaseCaja+", variedad: "+this.variedadCaja+", calibre: "+this.calibreCaja+", correlativo: "+this.correlativoCaja+" y ponderación: "+this.ponderacionCaja);
        this.listarCajas();
        this.envaseCaja=null;  
        this.variedadCaja=null;  
        this.categoriaCaja=null;  
        this.calibreCaja=null;  
        this.correlativoCaja=null;  
        this.ponderacionCaja=null;  
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo guardar caja', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo guardar caja, método agregarCaja, component caja');
      }
    );
  }

    //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto caja clickeado a variable global currentCajaSelected
    onEditar(caja: Caja) {      
      this.currentCajaSelected = caja;      
    }
  
    //metodo que sirve para editar una caja
    editarCaja(form: NgForm) {
      console.log(this.currentCajaSelected.envase);
      if (!this.currentCajaSelected.envase || !this.currentCajaSelected.variedad || !this.currentCajaSelected.categoria || !this.currentCajaSelected.calibre || !this.currentCajaSelected.correlativo || !this.currentCajaSelected.ponderacion) {
        this.toastr.error('No se pudo editar la caja', 'Oops');
        return;
      }
  
      let caja = new Caja(this.currentCajaSelected.id, this.currentCajaSelected.envase, this.currentCajaSelected.variedad, this.currentCajaSelected.categoria, this.currentCajaSelected.categoria, this.currentCajaSelected.correlativo, this.currentCajaSelected.ponderacion);
     
      this.cajaService.updateCaja(caja.id, caja).subscribe(
        res => {
          this.registroService.creaRegistro("Se ha editado una caja, id: "+caja.id);
          console.log(res);
          this.listarCajas();
          this.currentCajaSelected = null;
        },
        err => {
          console.log(err);
          this.toastr.error('No se pudo editar caja', 'Oops',);
          this.registroDevService.creaRegistroDev('No se pudo editar caja, método editarCaja, component caja');
        }
      );
    }
  
    //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto caja clickeado a variable global currentCajaSelected y abrir el modal
    onEliminar(caja: Caja, modal) {
      this.currentCajaSelected = caja;
      this.open(modal);
    }
  
    //metodo que elimina una caja
    eliminarCaja(caja: Caja) {
      this.cajaService.deleteCaja(caja.id).subscribe(
        res => {
          this.registroService.creaRegistro("Se ha eliminado una cada, id: "+caja.id);
          console.log(res);
          this.listarCajas();
        },
        err => {
          console.log(err);
          this.toastr.error('No se pudo eliminar caja', 'Oops');
          this.registroDevService.creaRegistroDev('No se pudo eliminar caja, método eliminarCaja, component caja');
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
          this.eliminarCaja(this.currentCajaSelected);
        }
        return `with: ${reason}`;
      }
    }

}
