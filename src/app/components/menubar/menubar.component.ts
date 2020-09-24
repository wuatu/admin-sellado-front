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
  isCollapseProduccion = false;
  isCollapseAdministrar = true;
  isCollapseRegistros = true;
  expandItem=0;
  expandItemAnterior=0;
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

  setCurrentItem(i,produccion?,administrar?,registros?,seguimiento?) {
    if(this.expandItemAnterior==1 && i != 1){
      produccion.click();
    } else if(this.expandItemAnterior==2 && i != 2){
      administrar.click();
    } else if(this.expandItemAnterior==3 && i != 3){
      registros.click();
    } else if(this.expandItemAnterior==4 && i != 4){
      seguimiento.click();
    } else{

    }
    if (i == 1 && this.expandItemAnterior==1) {
      this.expandItem=1;
      this.expandItemAnterior=0;
    } else if(i == 1 && this.expandItemAnterior!=1){
      this.expandItem=1;
      this.expandItemAnterior=1;
    } else if(i == 2 && this.expandItemAnterior==2){
      this.expandItem=2;
      this.expandItemAnterior=0;
    } else if (i == 2 && this.expandItemAnterior!=2) {
      this.expandItem=2;
      this.expandItemAnterior=2;
    } else if (i == 3 && this.expandItemAnterior==3) {
      this.expandItem=3;
      this.expandItemAnterior=0;
    } else if(i == 3 && this.expandItemAnterior!=3){
      this.expandItem=3;
      this.expandItemAnterior=3;
    } else if (i == 4 && this.expandItemAnterior==4) {
      this.expandItem=4;
      this.expandItemAnterior=0;
    } else if(i == 4 && this.expandItemAnterior!=4){
      this.expandItem=4;
      this.expandItemAnterior=4;
    }
  }
}
