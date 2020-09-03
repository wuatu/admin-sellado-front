import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
  time = new Date();
  passAdmin = "";
  rutAdmin = "";
  closeResult = "";
  turnoIniciado=false;
  botonIniciarTurnoClass="btn-primary";
  botonIniciarTurnoText="Iniciar turno";
  constructor(private modalService: NgbModal, private toastr: ToastrService, private authService: AuthService) { }

  ngOnInit() {
    //get registro

    setInterval(() => {
      this.time = new Date();
    }, 1000);
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
      }
      return `with: ${reason}`;
    }
  }

  autenticarIniciarTurno(form) {
    console.log(form);
    this.authService.login(form.value).subscribe(
      res => {
        console.log(res);
        this.toastr.success("Sesion iniciada");
        this.botonIniciarTurnoClass="btn-danger"
        this.botonIniciarTurnoText="Finalizar turno";
        this.turnoIniciado=true;
      },
      err => {
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    );
    this.rutAdmin = "";
    this.passAdmin = "";
  }

  autenticarCerrarTurno(form) {
    console.log(form);
    this.authService.login(form.value).subscribe(
      res => {
        console.log(res);
        this.toastr.success("Sesion iniciada");
        this.botonIniciarTurnoClass="btn-primary"
        this.botonIniciarTurnoText="Iniciar Turno";
        this.turnoIniciado=false
      },
      err => {
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    );
    this.rutAdmin = "";
    this.passAdmin = "";
  }

}
