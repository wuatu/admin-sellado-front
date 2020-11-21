import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthRoutingModule} from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import {RegisterComponent} from './register/register.component';
import { from } from 'rxjs';
import {AuthService} from '../services/auth.service';
import { RutValidationAuthDirective } from '../Directive/rut-validation-auth.directive';




@NgModule({
  declarations: [RegisterComponent, LoginComponent, RutValidationAuthDirective],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    HttpClientModule

  ],
  providers:[AuthService]
})
export class AuthModule { }
