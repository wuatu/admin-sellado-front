import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AdministradorService } from 'src/app/services/administrador.service';
import { TurnoService } from 'src/app/services/turno.service';
import { Turno } from 'src/app/models/turno';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit {
  iniciarCerrar = "iniciar";
  IniciarCerrar = "Iniciar";
  time = new Date();
  passAdmin = "";
  rutAdmin = "";
  closeResult = "";
  turnoIniciado=false;
  botonIniciarTurnoClass="btn-primary";
  botonIniciarTurnoText="Iniciar turno";
  constructor(private modalService: NgbModal, private toastr: ToastrService, private authService: AuthService) { }
  turnoIniciado = false;
  botonIniciarTurnoClass = "btn-primary";
  botonIniciarTurnoText = "Iniciar turno";
  turno;
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private administradorService: AdministradorService,
    private turnoService: TurnoService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    //get registro
    this.turnoService.getTurnoSinId().subscribe(
      res => {
        this.turno = res;
        if (this.turno) {
          console.log(this.turno.id);
          this.sesionIniciada();
          this.toastr.info("Turno se encuentra iniciado", "Información");
        } else {
          this.toastr.info("Favor inicie turno", "Información");
        }
      },
      err => {
        this.toastr.info('No se ha iniciado turno', 'Información');
      }
    )
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
      return `with: ${reason}`;
    }
  }

  //metodo que sirve para saber la razon por la cual un modal fue cerrado
  private getDismissReasonForm(reason: any) {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      return 'by clicking on a backdrop';
    } else {
      if (reason == 'ok') {
        if (this.turnoIniciado === false) {
          return this.iniciarTurno();
        } {
          return this.cerrarTurno();
        }
      }
    }
  }

  autenticarTurno(modal) {
    console.log(this.rutAdmin, this.passAdmin);
    this.openModal(modal);
  }

  private iniciarTurno() {
    this.administradorService.getLoginAdministrador(this.rutAdmin, this.passAdmin).subscribe(
      res => {
        console.log(JSON.parse(localStorage.getItem('USER')));
        let administrador = JSON.parse(localStorage.getItem('USER'));
        console.log(administrador.id);
        let turno = new Turno();
        turno.fechaApertura(null, new Date().toISOString(), administrador.id, administrador.nombre, administrador.apellido, "", "", "", "");
        this.turnoService.saveTurno(turno).subscribe(
          res => {
            this.sesionIniciada();
            this.toastr.success("Turno iniciado correctamente");
          },
          err => {
            this.toastr.error('Error al iniciar turno', 'Error');
          }
        );
      },
      err => {
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    )
    this.rutAdmin = "";
    this.passAdmin = "";
  }

  sesionIniciada() {
    this.botonIniciarTurnoClass = "btn-danger"
    this.botonIniciarTurnoText = "Cerrar Turno";
    this.turnoIniciado = true;
  }

  sesionCerrada() {
    this.botonIniciarTurnoClass = "btn-primary"
    this.botonIniciarTurnoText = "Iniciar Turno";
    this.turnoIniciado = false;
  }

  private cerrarTurno() {
    this.administradorService.getLoginAdministrador(this.rutAdmin, this.passAdmin).subscribe(
      res => {
        let administrador = JSON.parse(localStorage.getItem('USER'));
        let turno:Turno=new Turno();
        turno.id=this.turno.id;
        turno.fecha_apertura=this.turno.fecha_apertura;
        turno.nombre_administrador_apertura=this.turno.nombre_administrador_apertura;
        turno.apellido_administrador_apertura=this.turno.apellido_administrador_apertura;
        turno.fechaCierre(new Date().toISOString(), administrador.id, administrador.nombre, administrador.apellido);
        this.turnoService.updateTurno(this.turno.id, turno).subscribe(
          res => {
            this.sesionCerrada();
            this.toastr.success("Turno cerrado correctamente");
          },
          err => {
            this.toastr.error('Error al cerrar turno', 'Error');
          }
        );
      },
      err => {
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    )
    this.rutAdmin = "";
    this.passAdmin = "";
  }

  openModal(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
      console.log(this.rutAdmin, this.passAdmin);
      this.closeResult = `Dismissed ${this.getDismissReasonForm(reason)}`;
    });
  }

}
