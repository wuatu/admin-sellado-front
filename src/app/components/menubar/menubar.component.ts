import { Component, OnInit, Input, ViewChild, ElementRef , ComponentFactoryResolver, ViewContainerRef, ComponentRef,  ReflectiveInjector} from '@angular/core';
import { MenubarService } from 'src/app/services/menubar.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthModule } from 'src/app/auth/auth.module';
import { Router } from '@angular/router';
import { AdministradorService } from 'src/app/services/administrador.service';
import { Administrador } from 'src/app/models/administrador';
import { CalibradorService } from '../../services/calibrador.service';

import { RegistroDevService } from '../../services/registro-dev.service';
import { resolve } from 'url';


import { MonitoreoCalibradorComponent } from '../monitoreo-calibrador/monitoreo-calibrador.component';
import { MonitoreoCalibradoresService } from '../../services/monitoreo-calibradores.service';
import { Subscription, timer } from 'rxjs';

declare var name: any;
@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  @ViewChild('placeHolder', {read: ViewContainerRef}) private _placeHolder: MonitoreoCalibradorComponent;
  
  subscriptionTimer: Subscription;
  rol = 0;
  admin: Administrador ;
  expandItem=0;
  expandItemAnterior=0;
  calibradores: any = [];
  calibradoresAux: any = [];
  calibrador: any;
  sizeCaliper: number = 0;
  sizeCaliperAux:number = 0;
  constructor(
    public menubar: MenubarService,
    private authService: AuthService,
    private router: Router,
    private calibradorService: CalibradorService,
    private registroDevService: RegistroDevService,
  ){
  }

  ngOnInit() {
    new name();
    this.admin = JSON.parse(localStorage.getItem('USER'));
    if(this.admin.rol == 1) {
      this.rol = 1;
    }else if(this.admin.rol == 2){
      this.rol = 2;
    }

    this.subscriptionTimer = timer(0,5000).subscribe(() => {
      this.getCalibradores();
    });
  }

  ngOnDestroy(){
    if (this.subscriptionTimer != null) {
      console.log("muerte a subscriptionTimer.....");
      this.subscriptionTimer.unsubscribe();
    }
  }

  getCalibradores() {
    this.calibradorService.getCalibradores().subscribe(
      res => {
        this.calibradores = res.body;
        
        //this.calibrador = this.calibradores[0];
      },
      err => {
        this.registroDevService.creaRegistroDev('No se pudieron obtener los calibradores, método getCalibradores, component menuBar');
      }
    );
  }

  showMenu() {
    this.menubar.visibleToggleAction();
  }

  logout() {
    this.authService.logout();
    this.authService.isLogin();
    this.router.navigate(['/auth/login']);
  }

  setCurrentItem(i,produccion?,administrar?,registros?,seguimiento?,monitoreo?) {
    if(this.expandItemAnterior==1 && i != 1){
      produccion.click();
    } else if(this.expandItemAnterior==2 && i != 2){
      administrar.click();
    } else if(this.expandItemAnterior==3 && i != 3){
      registros.click();
    } else if(this.expandItemAnterior==4 && i != 4){
      seguimiento.click();
    } else if(this.expandItemAnterior==5 && i != 5){
      monitoreo.click();
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
    }else if (i == 5 && this.expandItemAnterior==5) {
      this.expandItem=5;
      this.expandItemAnterior=0;
    } else if(i == 5 && this.expandItemAnterior!=5){
      this.expandItem=5;
      this.expandItemAnterior=5;
    }
  }

  
}
