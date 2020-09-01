import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthService,
    public router: Router
  ){ }

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if(this.authService.isLogin()!== true){
      this.router.navigate(['/auth/login']);
    }
    return true;
  }

}