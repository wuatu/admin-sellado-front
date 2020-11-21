import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{AuthService} from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  addRut:string;
  constructor(
    private authService:AuthService,
    private router:Router,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService,
    ) { }

  ngOnInit() {
  }

  onLogin(form):void{
    this.authService.login(form.value).subscribe(
      res=>{
        this.router.navigateByUrl('/monitoreo')
      err=>{
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    });
  }
}
