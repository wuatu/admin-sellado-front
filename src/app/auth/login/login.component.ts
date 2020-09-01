import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{AuthService} from '../../services/auth.service';
import {User} from '../../models/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService:AuthService,
    private router:Router,
    //servicio toast ventana emergente que sirve para mostrar información al usuario
    private toastr: ToastrService
    ) { }

  ngOnInit() {
  }

  onLogin(form):void{
    this.authService.login(form.value).subscribe(
      res=>{
        this.router.navigateByUrl('/dashboard')
      err=>{
        this.toastr.error('Credenciales inválidas', 'Error');
      }
    });
  }
}
