import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';
import { Administrador } from 'src/app/models/administrador';
import { ToastrService } from 'ngx-toastr';
import { AdministradorService } from 'src/app/services/administrador.service';
import { AuthService } from 'src/app/services/auth.service';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';


@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  closeResult = '';
  administradores: any;
  currentAdministradorSelected: any;
  

  addId:string;
  addRut: string;
  addNombre: string;
  addApellido: string;
  addPassword: string;
  addRol:number = 0;
  rol:number;

  constructor(
    //servicio del modal
    private modalService: NgbModal,
    //servicio de administrador, contiene los metodos CRUD de administradores
    private administradorService: AdministradorService,
    private authService: AuthService,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    private registroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  //metodo constructor, se llama cuando todas las vistas estan cargadas
  ngOnInit() {
    this.listarAdministradores();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
    console.log("rol: "+this.rol);
    
  }

  //metodo que trae todos los registros de administradores desde la base de datos
  listarAdministradores() {
    this.administradorService.getAdministradores().subscribe(
      res => {
        console.log(res);
        console.log(res.status);
        if(res.status == 200){
          this.toastr.success('Administradores obtenidos','Operación satisfactoria');
        }else if(res.status == 204){
          this.toastr.success('no existen registros de administradores para mostrar','Operación satisfactoria');
          return;
        }
        //los registros se almacena en array administradores que sirve para llenar la tabla de vista administradores
        this.administradores = res.body;
      },
      err => {
        if (err.status != 404) {
          console.log(err.status);
          this.toastr.error('No se pudo listar administrador', 'Oops');
          this.registroDevService.creaRegistroDev('No se pudo obtener la lista de administradores, método listar administradores, component administrador');
        } else {
          this.administradores = null;
        }
      }
    )
  }

  //metodo que crea una nueva administrador
  agregarAdministrador(form: NgForm) {
    if (!this.addNombre || !this.addApellido || !this.addRut || !this.addPassword) {
      this.toastr.error('No se pudo guardar administrador', 'Oops');
      return;
    }
    let administrador = new Administrador(null, this.addRut, this.addNombre, this.addApellido, this.addPassword,this.addRol);
    this.administradorService.saveAdministrador(administrador).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Línea agregada');
        this.registroService.creaRegistro("Se ha creado un administrador, rut "+administrador.rut+" y nombre: "+administrador.nombre+" "+administrador.apellido);
        this.listarAdministradores();
        this.addRut = null;
        this.addNombre=null;
        this.addApellido=null;
        this.addPassword=null;      
      },
      err => {
        console.log(err);
        this.registroDevService.creaRegistroDev('No se pudo agregar un administrador, component administrador, método agregarAdministrador');
        this.toastr.error('No se pudo guardar administrador', 'Oops');
      }
    );

  }

  //metodo que se ejecuta al presionar boton editar, sirve para asignar objeto administrador clickeado a variable global currentAdministradorSelected
  onEditar(administrador: Administrador) {
    console.log("id: "+administrador.id);
    this.administradorService.getAdministrador(administrador.id).subscribe(
      res => {
        this.currentAdministradorSelected = res;
        this.addId=this.currentAdministradorSelected.id;
        this.addRut = this.currentAdministradorSelected.rut;
        this.addNombre=this.currentAdministradorSelected.nombre;
        this.addApellido=this.currentAdministradorSelected.apellido;
        this.addPassword=this.currentAdministradorSelected.password;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo obtener el administrador id', 'Oops',);
        this.registroDevService.creaRegistroDev('No se pudo editar el administrador, método onEditar, component administrador');
      }
    )
  }

  //metodo que sirve para editar una administrador
  editarAdministrador(form: NgForm) {
    if (!this.currentAdministradorSelected) {
      this.toastr.error('No se pudo editar administrador', 'Oops',);
      return;
    }
    let administrador: Administrador;
    administrador = new Administrador(this.addId, this.addRut,this.addNombre, this.addApellido, this.addPassword,this.addRol);  
    this.administradorService.updateAdministrador(administrador.id, administrador).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Administrador editado');
        this.registroService.creaRegistro("Se ha editado un administrador, id: "+administrador.id+", rut: "+administrador.rut+" y nombre "+administrador.nombre+" "+administrador.apellido);
        console.log(res);
        this.listarAdministradores();
        this.currentAdministradorSelected = null;
        this.addId=null;
        this.addRut = null;
        this.addNombre=null;
        this.addApellido=null;
        this.addPassword=null;
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo editar administrador', 'Oops',);
        this.registroDevService.creaRegistroDev('No se pudo editar al administrador, método editarAdministrador, component administrador');
      }
    );
  }

  

  //metodo que se ejecuta al presionar boton eliminar, sirve para asignar objeto administrador clickeado a variable global currentAdministradorSelected y abrir el modal
  onEliminar(administrador: Administrador, modal) {
    this.currentAdministradorSelected = administrador;
    console.log(this.currentAdministradorSelected);
    this.open(modal);
  }

  //metodo que elimina una administrador
  eliminarAdministrador(administrador: Administrador) {
    this.administradorService.deleteAdministrador(administrador.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Administrador eliminado');
        this.registroService.creaRegistro("Se ha elimidado un administrador, id:  "+administrador.id+", rut; "+administrador.rut+" y nombre: "+administrador.nombre + " "+administrador.apellido);
        console.log(res);
        this.listarAdministradores();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar administrador', 'Oops');
        this.registroDevService.creaRegistroDev('No se pudo eliminar el administrador, método eliminarAdministrador, component administrador');
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
    this.addRut = null;
    this.addNombre=null;
    this.addApellido=null;
    this.addPassword=null;
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        console.log("hola");
        this.eliminarAdministrador(this.currentAdministradorSelected);
      }
      return `with: ${reason}`;
    }
  }
}
