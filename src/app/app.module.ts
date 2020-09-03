import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenubarComponent } from './components/menubar/menubar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { HttpClientModule } from "@angular/common/http";
import { LineasComponent } from './components/lineas/lineas.component';
import {NgbAlertModule, NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RfidComponent } from './components/rfid/rfid.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { LectoresComponent } from './components/lectores/lectores.component';

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    DashboardComponent,
    LineasComponent,
    RfidComponent,
    MonitoreoComponent,
    LectoresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,  
    HttpClientModule,
    NgbAlertModule,
    NgbDropdownModule,
    FormsModule,    
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
