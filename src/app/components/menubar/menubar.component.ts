import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { MenubarService } from 'src/app/services/menubar.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModule } from 'src/app/auth/auth.module';
import { Router } from '@angular/router';
import { AdministradorService } from 'src/app/services/administrador.service';
import { Administrador } from 'src/app/models/administrador';
declare var name: any;
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  superAdmin = false;
  admin: Administrador = JSON.parse(localStorage.getItem('USER'));
  constructor(
    public menubar: MenubarService,
    private authService: AuthService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    new name();
    console.log(this.admin);
    if (this.admin.superAdmin == true) {
      this.superAdmin = true;
    }
  }

  showMenu(isVisible: boolean) {
    this.menubar.visibleToggleAction();
  }

  logout() {
    this.authService.logout();
    this.authService.isLogin();
    this.router.navigate(['/auth/login']);
  }
}
