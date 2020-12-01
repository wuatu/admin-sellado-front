import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{AuthService} from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons, NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';

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
  }

  onLogin(form):void{
    this.authService.login(form.value).subscribe(
      res=>{
        this.router.navigateByUrl('/monitoreo')
      err=>{
        console.log("I AM IN THE ERR!!!!");
        this.bandera = true;
        this.open("mymodalError12Credentials");
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    });
  }

  open(modal) {
    
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
