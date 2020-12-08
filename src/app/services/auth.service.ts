import { Injectable, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { JwtResponse } from '../models/jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Administrador } from '../models/administrador';
import { AdministradorService } from './administrador.service';
import { LoginComponent } from '../auth/login/login.component';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'  // <- ADD THIS
})
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  private token: string;

  private _isLoggedIn = new Subject<boolean>();
  isLoggedIn = false;
  
  admin: any;
  
  constructor(private httpClient: HttpClient, private administradorService:AdministradorService,private toastr:ToastrService) { }

  

  register(user: Administrador): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(`${this.AUTH_SERVER}/register`,
      user).pipe(tap(
        (res: JwtResponse) => {
          if (res) {
            //guardar token
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          }
        }
      ));
  }

  login(user: User): Observable<JwtResponse> {
    return this.httpClient.post<JwtResponse>(`${this.AUTH_SERVER}/login`,
      user).pipe(tap(
        (res: JwtResponse) => {
          if (res) {
            console.log("sera aqui ?????");
            console.log(res);
            //guardar token
            localStorage.setItem('USER', JSON.stringify(res.dataUser));
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          }
        },
        err=>{
          console.log();
          //alert("Rut o Contraseña invalida");
          this.toastr.error('Rut o Contraseña invalida','Oops');
          console.log("AQUI ENTRO AL ERROR !!!!")
        }
      )
    );    
  }

  logout() {
    this.token = '';
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("EXPIRES_IN");
    localStorage.setItem('USER', null);
    JSON.parse(localStorage.getItem('USER'));
  }

  private saveToken(token: string, expiresIn: string): void {
    localStorage.setItem("ACCESS_TOKEN", token);
    localStorage.setItem("EXPIRES_IN", expiresIn);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("ACCESS_TOKEN");
    }
    return this.token;
  }

  // Returns true when user is looged in and email is verified
  isLogin(): boolean {
    const user = JSON.parse(localStorage.getItem('USER'));
    const token = (localStorage.getItem('ACCESS_TOKEN'));
    const expiresIn = (localStorage.getItem('EXPIRES_IN'));
    console.log(user);
    console.log(expiresIn);
    console.log(token);
    if ((user !== null && token !== null && expiresIn !== null)) {
      this.isLoggedIn = true;
      this._isLoggedIn.next(this.isLoggedIn);
    } else {
      this.isLoggedIn = false;
      this._isLoggedIn.next(this.isLoggedIn);
    }
    return this.isLoggedIn;
  }

  public isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn.asObservable();
  }

}
