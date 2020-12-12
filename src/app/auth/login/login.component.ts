import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{AuthService} from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { ExportTurno } from '../../models/export-turno';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  addRut:string;
  closeResult = "";
  bandera:boolean=true;
  constructor(
    private authService:AuthService,
    private router:Router,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    private modalService: NgbModal,
    ) { }

  ngOnInit() {
    this.isLoggedIn();
  }

  isLoggedIn(): void {
    if (this.authService.isLogin()) {
      this.router.navigate(['/monitoreo'])
    }
  }

  onLogin(form):void{
    this.authService.login(form.value).subscribe(
      res=>{      
        this.router.navigate(['/monitoreo'])
      err=>{
       
      }
    });
  }

  public open(modal) {
    
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  private getDismissReason(reason: any): string {
    console.log(reason);
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
      this.bandera = false;
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      console.log("sera");
      this.bandera = false;
      return 'by clicking on a backdrop';

    } else {
      this.bandera = false;
      return `with: ${reason}`;
    }
  }
}
