import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { RegistroService } from '../../services/registro.service';
import { RegistroDevService } from '../../services/registro-dev.service';



@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  closeResult = '';

  rutUsuario:string;
  nombreUsuario:string;
  apellidoUsuario:string;
  rfidUsuario:string;

  currentUsuarioSelected: Usuario;  

  usuarios:any = [];
 
  selectedUsuarioObject:any;
  selectedUsuarioObjectModificar:any;
  selectedUsuarioText:string="Nombre";
  
  rol: number;

  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    private RegistroService: RegistroService,
    private registroDevService: RegistroDevService
  ) { }

  ngOnInit() {
    this.listarUsuarios();
    this.rol = JSON.parse(localStorage.getItem('USER')).rol;
  }
  
  //metodo que lista los usuarios registrados en el sistema.
  listarUsuarios(){
    this.usuarioService.getUsuarios().subscribe(
      res=>{
        console.log(res);
        this.usuarios=res.body;
        if(res.status == 200){
        }else if(res.status == 204){
          this.toastr.success('no hay colaboradores actualmente para mostrar','Operación satisfactoria');
          return;
        }
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudieron obtener los usuarios, método listarUsuarios, component usuario');
        this.toastr.error('No se pudo obtener a los colaboradores', 'Oops');
      }
    );
  }
  
  //metodo que crea un nuevo lector
  agregarUsuario(form: NgForm) {  
    if (!form.value.nombre ) {
      this.toastr.error('No se pudo agregar el colaborador', 'Oops');
      this.rutUsuario = null;
      this.nombreUsuario = null;
      this.apellidoUsuario = null;
      this.rfidUsuario = null;
      return;
    }
    
    let usuario = new Usuario(null, this.rutUsuario, this. nombreUsuario, this.apellidoUsuario, this.rfidUsuario);
    this.usuarioService.saveUsuario(usuario).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Colaborador agregado');
        this.RegistroService.creaRegistro("Se ha creado un colaborador, rut:"+usuario.rut+" y nombre: "+usuario.nombre+" "+usuario.apellido);
        this.rutUsuario = null;
        this.nombreUsuario = null;
        this.apellidoUsuario = null;
        this.rfidUsuario = null;
        this.listarUsuarios();
        
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo agregar al usuario, método agregarUsuario, component usuario');
        this.toastr.error('No se pudo agregar al colaborador', 'Oops');
        this.rutUsuario = null;
        this.nombreUsuario = null;
        this.apellidoUsuario = null;
        this.rfidUsuario = null;
      }
    );

  }

  //Metodo que se utiliza para abrir el modal editar usuario
  onEditar(usuario: Usuario) {
    this.currentUsuarioSelected = usuario;
    console.log(this.currentUsuarioSelected);
    this.usuarioService.getUsuario(this.currentUsuarioSelected.id).subscribe(
      res=>{
        this.selectedUsuarioObject=res.body;
        this.selectedUsuarioText=this.selectedUsuarioObject.nombre;
      },
      err=>{
        this.registroDevService.creaRegistroDev('No se pudo obtener al usuario, método onEditar, component usuario');
        this.toastr.error('No se pudo obtener el colaborador id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar un lector
  editarUsuario(form: NgForm) {
    console.log(this.currentUsuarioSelected);
    if (!form.value.nombre) {
      this.listarUsuarios();
      this.toastr.error('No se pudo editar el colaborador', 'Oops',);

      return;
    }
    let usuario: Usuario;
    if(this.selectedUsuarioObject){
      usuario = new Usuario(this.currentUsuarioSelected.id, this.currentUsuarioSelected.rut, this.currentUsuarioSelected.nombre, this.currentUsuarioSelected.apellido, this.currentUsuarioSelected.rfid);
      
    }    
    this.usuarioService.updateUsuario(usuario.id, usuario).subscribe(
      res => {
        this.RegistroService.creaRegistro("Se ha editado un colaborador, id de registro: "+usuario.id+", rut:"+usuario.rut);
        this.listarUsuarios();
        this.currentUsuarioSelected = null;
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo editar al usuario, método editarUsuario, component usuario');
        this.listarUsuarios();
        this.toastr.error('No se pudo editar el Colaborador', 'Oops',);
      }
    );
  }

  //Metodo que se utiliza para abrir el modal para eliminar un usuario.
  onEliminar(usuario: Usuario, modal) {
    this.currentUsuarioSelected = usuario;
  }
  //Metodo que sirve para eliminar el registro de un usuario en la base de datos.
  eliminarUsuario(usuario: Usuario){
    this.usuarioService.deleteUsuario(usuario.id).subscribe(
      res => {
        this.RegistroService.creaRegistro("Se ha eliminado un colaborador, id de registro: "+usuario.id+", rut:"+usuario.rut);
        this.listarUsuarios();
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudo eliminar al usuario, método eliminarUsuario, component usuario');
        this.toastr.error('No se pudo eliminar el colaborador', 'Oops');
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
        console.log(this.currentUsuarioSelected);
        this.eliminarUsuario(this.currentUsuarioSelected);
        
      }
      return `with: ${reason}`;
    }
  }

}
