import { Component } from '@angular/core';
import { MenubarService } from './services/menubar.service';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { AuthModule } from './auth/auth.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showMenu;
  showMenu$: Observable<boolean>;
  isLoggedIn$:Observable<boolean>;
  isLoggedIn;

  constructor(
    public menubar:MenubarService,
    public router:Router,
    private authService:AuthService
  ){
    this.showMenu$=this.menubar.getVisible$();
    this.showMenu$.subscribe(showMenu => this.showMenu = showMenu);
    this.isLoggedIn$=this.authService.isLoggedIn$();
    this.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.showMenu=this.menubar.visible;
    this.isLoggedIn=this.authService.isLogin();
  }

  ngOnInit() {
    if(this.authService.isLogin()){
      this.router.navigate(['/monitoreo']);
    }
  }

}
