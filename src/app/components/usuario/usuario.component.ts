import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

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


  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    this.listarUsuarios();
  }
  
  //metodo que lista los usuarios registrados en el sistema.
  listarUsuarios(){
    console.log("HOLA ESTOY LISTANDO LOS USUARIOS!!!!");
    
    this.usuarioService.getUsuarios().subscribe(
      res=>{
        console.log(res);
        this.usuarios=res;
        
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener a los usuarios', 'Oops');
      }
    );
  }
  
  //metodo que crea un nuevo lector
  agregarUsuario(form: NgForm) {  
    if (!form.value.nombre ) {
      this.toastr.error('No se pudo agregar usuario', 'Oops');
      this.rutUsuario = null;
      this.nombreUsuario = null;
      this.apellidoUsuario = null;
      this.rfidUsuario = null;
      return;
    }
    
    let usuario = new Usuario(null, this.rutUsuario, this. nombreUsuario, this.apellidoUsuario, this.rfidUsuario);
    console.log(usuario);
    this.usuarioService.saveUsuario(usuario).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Usuario agregado');
        this.rutUsuario = null;
        this.nombreUsuario = null;
        this.apellidoUsuario = null;
        this.rfidUsuario = null;
        this.listarUsuarios();
        
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo agregar al usuario', 'Oops');
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
        this.selectedUsuarioObject=res;
        this.selectedUsuarioText=this.selectedUsuarioObject.nombre;
        console.log("HOLA HOLA");
        console.log(this.selectedUsuarioObject);
      },
      err=>{
        console.log(err);
        this.toastr.error('No se pudo obtener el usuario id', 'Oops',);
      }
    )
  }

  //metodo que sirve para editar un lector
  editarLector(form: NgForm) {
    console.log(this.currentUsuarioSelected);
    if (!form.value.nombre) {
      this.listarUsuarios();
      this.toastr.error('No se pudo editar el lector', 'Oops',);

      return;
    }
    let usuario: Usuario;
    if(this.selectedUsuarioObject){
      usuario = new Usuario(this.currentUsuarioSelected.id, this.currentUsuarioSelected.rut, this.currentUsuarioSelected.nombre, this.currentUsuarioSelected.apellido, this.currentUsuarioSelected.rfid);
      
    }    
    this.usuarioService.updateUsuario(usuario.id, usuario).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector editado');
        console.log(res);
        this.listarUsuarios();
        this.currentUsuarioSelected = null;
      },
      err => {
        console.log(err);
        this.listarUsuarios();
        this.toastr.error('No se pudo editar el lector', 'Oops',);
      }
    );
  }
  //Metodo que se utiliza para abrir el modal para eliminar un usuario.
  onEliminar(usuario: Usuario, modal) {
    this.currentUsuarioSelected = usuario;
    console.log(this.currentUsuarioSelected);
    this.open(modal);
  }
  //Metodo que sirve para eliminar el registro de un usuario en la base de datos.
  eliminarUsuario(usuario: Usuario){
    this.usuarioService.deleteUsuario(usuario.id).subscribe(
      res => {
        this.toastr.success('Operación satisfactoria', 'Lector eliminado');
        this.listarUsuarios();
      },
      err => {
        console.log(err);
        this.toastr.error('No se pudo eliminar lector', 'Oops');
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
