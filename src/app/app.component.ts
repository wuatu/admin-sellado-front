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
  isLoggedIn$: Observable<boolean>;
  isLoggedIn;
  colMenuBar = "col-lg-2 col-md-3 col-sm-4 col-xs-5";
  colApp = "col-lg-10 col-md-9 col-sm-8 col-xs-5";

  constructor(
    public menubar: MenubarService,
    public router: Router,
    private authService: AuthService
  ) {
    this.showMenu$ = this.menubar.getVisible$();
    this.showMenu$.subscribe(showMenu => this.showMenu = showMenu);
    this.isLoggedIn$ = this.authService.isLoggedIn$();
    this.isLoggedIn$.subscribe(isLoggedIn => this.isLoggedIn = isLoggedIn);
    this.showMenu = this.menubar.visible;
    this.isLoggedIn = this.authService.isLogin();
  }

  changeScreenMenuBar(): string {
    if (this.showMenu) {
      return this.colMenuBar = "col-lg-0 col-md-0 col-sm-0 col-xs-0";
    } else {
      return this.colMenuBar = "col-lg-2 col-md-3 col-sm-4 col-xs-5";
    }
  }

  changeScreenApp(): string {
    if (this.showMenu) {
      return this.colApp = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
    } else {
      return this.colApp = "col-lg-10 col-md-9 col-sm-8 col-xs-5";
    }
  }

  ngOnInit() {
    if (this.authService.isLogin()) {
      this.router.navigate(['/monitoreo']);
    }
  }

}
