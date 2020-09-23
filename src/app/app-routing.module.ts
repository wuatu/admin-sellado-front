import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { LineasComponent } from './components/lineas/lineas.component';
import { RfidComponent } from './components/rfid/rfid.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { LectoresComponent } from './components/lectores/lectores.component';
import { AdministradorComponent } from './components/administrador/administrador.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { UsuarioEnLineaComponent } from './components/usuario-en-linea/usuario-en-linea.component';
import { CalibradorComponent } from './components/calibrador/calibrador.component';
import { RegistroComponent } from './components/registro/registro.component';
import { CajaComponent } from './components/caja/caja.component';
import { SeguimientoDeCajasComponent } from './components/seguimiento-de-cajas/seguimiento-de-cajas.component';
import { ProduccionColaboradorComponent } from './components/produccion-colaborador/produccion-colaborador.component';
import { TurnoComponent } from './components/turno/turno.component';


const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'monitoreo', component: MonitoreoComponent, canActivate: [AuthGuard] },
  { path: 'produccioncalibrador', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'produccionlinea', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'produccionusuario', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'usuarioenlinea', component: UsuarioEnLineaComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'administrador', component: AdministradorComponent, canActivate: [AuthGuard] },
  { path: 'registroturnos', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'lineas', component: LineasComponent, canActivate: [AuthGuard] },
  { path: 'lector', component: LectoresComponent, canActivate: [AuthGuard] },
  { path: 'usuario', component: UsuarioComponent, canActivate: [AuthGuard] },
  { path: 'rfid', component: RfidComponent, canActivate: [AuthGuard] },
  { path: 'calibrador', component: CalibradorComponent, canActivate: [AuthGuard] },
  { path: 'registro', component: RegistroComponent, canActivate: [AuthGuard] },
  { path: 'turnos', component: TurnoComponent, canActivate: [AuthGuard] },
  { path: 'caja', component: CajaComponent, canActivate: [AuthGuard] },
  { path: 'seguimientodecajas', component: SeguimientoDeCajasComponent, canActivate: [AuthGuard] },
  { path: 'produccioncolaborador', component: ProduccionColaboradorComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
