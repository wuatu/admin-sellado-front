import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CalibradorService } from 'src/app/services/calibrador.service';
import { NgForm } from '@angular/forms';
import { Calibrador } from 'src/app/models/calibrador';
import { RegistroService } from 'src/app/services/registro.service';
import { Registro } from 'src/app/models/registro';
import { UtilsService } from 'src/app/services/utils.service';
import { RegistroDevService } from '../../services/registro-dev.service';

@Component({
  selector: 'app-calibrador',
  templateUrl: './calibrador.component.html',
  styleUrls: ['./calibrador.component.css']
})
export class CalibradorComponent implements OnInit {

  closeResult = '';
  calibradores: any;
  currentCalibradorSelected: Calibrador
  nombreCalibrador;
  cantidadCajasCalibrador;
  rol: number;
  bandera: boolean = false;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    //servicio de calibrador, contiene los metodos CRUD de calibradors
    private calibradorService: CalibradorService,
    private registoService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarCalibradores();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: " + this.rol);
  }

  //metodo que trae todos los registros de calibradors desde la base de datos
  listarCalibradores() {
    this.bandera = false;
    this.calibradorService.getCalibradores().subscribe(
      res => {
        //los registros se almacena en array calibradores que sirve para llenar la tabla de vista calibradors
        this.calibradores = res.body;
        console.log(this.calibradores);
        if (res.status == 200) {
          //this.toastr.success('Calibradores obtenidos', 'Operación satisfactoria');
          this.bandera = true;
        } else if (res.status == 204) {
          this.toastr.success('No existen calibradores actualmente para mostrar', 'Operación satisfactoria');
          return;
        }
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo obtener la lista de calibradores, método listarCalibradores, component calibrador');
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar calibradores', 'Oops');
        } else {
          this.calibradores = null;
        }
      }
    )
  }

  //metodo que crea un nuevo calibrador
  agregarCalibrador(form: NgForm) {
    if (!this.nombreCalibrador || !this.cantidadCajasCalibrador) {
      this.toastr.error('No se pudo guardar calibrador', 'Oops');
      return;
    }
    let calibrador = new Calibrador(null, this.nombreCalibrador, this.cantidadCajasCalibrador);
    this.calibradorService.saveCalibrador(calibrador).subscribe(
      res => {
        //crea registro        
        let mensajeRegistro = "Se ha creado un nuevo calibrador, nombre: " + this.nombreCalibrador;
        this.registoService.creaRegistro(mensajeRegistro);
        //toatsr
        //this.toastr.success('Operación satisfactoria', 'Calibrador agregada');
        this.listarCalibradores();
        this.nombreCalibrador = null;
        this.cantidadCajasCalibrador = null;
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo agregar calibrador, método agregarCalibrador, component calibrador');
        this.toastr.error('No se pudo guardar calibrador', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto calibrador clickeado a variable global currentCalibradorSelected
  onEditar(calibrador: Calibrador) {
    this.currentCalibradorSelected = calibrador;
  }

  //metodo que sirve para editar una calibrador
  editarCalibrador(form: NgForm) {
    if (!form.value.nombre || !form.value.cantidadCajas) {
      this.toastr.error('No se pudo editar calibrador, por favor ingrese un nombre para el calibrador', 'Oops',);
      return;
    }

    let calibrador = new Calibrador(form.value.id, form.value.nombre, form.value.cantidadCajas);

    this.calibradorService.updateCalibrador(calibrador.id, calibrador).subscribe(
      res => {
        //crea registro        
        let mensajeRegistro = "Se ha editado un calibrador, id: " + calibrador.id;
        this.registoService.creaRegistro(mensajeRegistro);

        //this.toastr.success('Operación satisfactoria', 'Calibrador editada');
        console.log(res);
        this.listarCalibradores();
        this.currentCalibradorSelected = null;
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo editar calibrador, método editarCalibrador, component calibrador');
        this.toastr.error('No se pudo editar calibrador', 'Oops',);
      }
    );
  }

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto calibrador clickeado a variable global currentCalibradorSelected y abrir el modal
  onEliminar(calibrador: Calibrador, modal) {
    this.currentCalibradorSelected = calibrador;
    this.open(modal);
  }

  //metodo que elimina una calibrador
  eliminarCalibrador(calibrador: Calibrador) {
    this.calibradorService.deleteCalibrador(calibrador.id).subscribe(
      res => {
        //crea registro        
        let mensajeRegistro = "Se ha eliminado un calibrador, nombre: " + calibrador.nombre;
        this.registoService.creaRegistro(mensajeRegistro);

        //this.toastr.success('Operación satisfactoria', 'Calibrador eliminado');
        console.log(res);
        this.listarCalibradores();
        this.calibradores=[];
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar calibrador', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo eliminar calibrador, método eliminarCalibrador, component calibrador');
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
        this.eliminarCalibrador(this.currentCalibradorSelected);
      }
      return `with: ${reason}`;
    }
  }

}

