import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LineasComponent } from './components/lineas/lineas.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { LectoresComponent } from './components/lectores/lectores.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'monitoreo', component: MonitoreoComponent, canActivate: [AuthGuard] },
  { path: 'produccioncalibrador', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'produccionlinea', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'produccionusuario', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'usuarioenlinea', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'administrador', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'registroturnos', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'lineas', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'lector', component: LectoresComponent, canActivate: [AuthGuard] },
  { path: 'rfid', component: RfidComponent, canActivate: [AuthGuard] },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
