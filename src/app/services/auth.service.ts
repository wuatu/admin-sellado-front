import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { JwtResponse } from '../models/jwt-response';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // <- ADD THIS
})
export class AuthService {
  AUTH_SERVER: string = 'http://localhost:3000';
  authSubject = new BehaviorSubject(false);
  private token: string;
  private _isLoggedIn = new Subject<boolean>();
  isLoggedIn = false;
  constructor(private httpClient: HttpClient) { }

  register(user: User): Observable<JwtResponse> {
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
            console.log(res);
            //guardar token
            localStorage.setItem('USER', JSON.stringify(res.dataUser));
            this.saveToken(res.dataUser.accessToken, res.dataUser.expiresIn);
          } else {
            this.logout();
          }
        }
      ));
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
