import { BrowserModule } from '@angular/platform-browser';
import { NgModule,LOCALE_ID  } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCl from '@angular/common/locales/es-CL';
registerLocaleData(localeCl);
import { NgbModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from "@angular/common/http";
import { LineasComponent } from './components/lineas/lineas.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RfidComponent } from './components/rfid/rfid.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { LectoresComponent } from './components/lectores/lectores.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioEnLineaComponent } from './components/usuario-en-linea/usuario-en-linea.component';
import { CalibradorComponent } from './components/calibrador/calibrador.component';
import { RegistroComponent } from './components/registro/registro.component';
import { TurnoComponent } from './components/turno/turno.component';
import { CajaComponent } from './components/caja/caja.component';
import { SeguimientoDeCajasComponent } from './components/seguimiento-de-cajas/seguimiento-de-cajas.component';
import { ProduccionColaboradorComponent } from './components/produccion-colaborador/produccion-colaborador.component'; 
import { ProduccionPorLineaComponent } from './components/produccion-por-linea/produccion-por-linea.component';
import { ProduccionPorCalibradorComponent } from './components/produccion-por-calibrador/produccion-por-calibrador.component';

//paginador
import {NgxPaginationModule} from 'ngx-pagination';
//Gráficos
import { ChartsModule } from 'ng2-charts';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
import { UsuarioAdminComponent } from './components/usuario-admin/usuario-admin.component';
import { MonitoreoCalibrador1Component } from './components/monitoreo-calibrador1/monitoreo-calibrador1.component';
import { MonitoreoCalibrador2Component } from './components/monitoreo-calibrador2/monitoreo-calibrador2.component';
import { LectorValidadorComponent } from './components/lector-validador/lector-validador.component';
import { RutValidationDirective } from './directive/rut-validation-directive.directive';
import { ipValidationDirective } from './directive/ip-validation-directive.directive';
import { RegistroDevComponent } from './components/registro-dev/registro-dev.component';
import { RegistroProduccionComponent } from './components/registro-produccion/registro-produccion.component';
import { CodigoUnitecComponent } from './components/codigo-unitec/codigo-unitec.component';
import { MonitoreoUsuarioEnLineaComponent } from './components/monitoreo-usuario-en-linea/monitoreo-usuario-en-linea.component';
import { RfidSalidaComponent } from './components/rfid-salida/rfid-salida.component';
import { MonitoreoSistemaComponent } from './components/monitoreo-sistema/monitoreo-sistema.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RfidRegistroColaboradorComponent } from './components/rfid-registro-colaborador/rfid-registro-colaborador.component';
import { InformeCalibradorComponent } from './components/informe-calibrador/informe-calibrador.component';







@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    DashboardComponent,
    LineasComponent,
    RfidComponent,
    MonitoreoComponent,
    LectoresComponent,
    AdministradorComponent,
    UsuarioComponent,
    UsuarioEnLineaComponent,
    CalibradorComponent,
    RegistroComponent,
    CajaComponent,
    SeguimientoDeCajasComponent,
    ProduccionColaboradorComponent,
    TurnoComponent,
    ProduccionPorLineaComponent,
    ProduccionPorCalibradorComponent,
    ConfiguracionComponent,
    UsuarioAdminComponent,
    MonitoreoCalibrador1Component,
    MonitoreoCalibrador2Component,
    LectorValidadorComponent,
    RutValidationDirective,
    ipValidationDirective,
    RegistroDevComponent,
    RegistroProduccionComponent,
    CodigoUnitecComponent,
    MonitoreoUsuarioEnLineaComponent,
    RfidSalidaComponent,
    MonitoreoSistemaComponent,
    RfidRegistroColaboradorComponent,
    InformeCalibradorComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    HttpClientModule,
    NgbModule,
    FormsModule,    
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgbModule,
    NgxPaginationModule,
    ChartsModule,
    FontAwesomeModule
  ],
  providers: [
    AuthService,
    { provide: LOCALE_ID, useValue: 'es-CL'},

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
