import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TelecommandsComponent } from './telecommands/telecommands.component';
import { LoginComponent } from './login/login.component';
import { TelecommandBatchesComponent } from './telecommand-batches/telecommand-batches.component';
import { QueuesComponent } from './queues/queues.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LogoutComponent } from './logout/logout.component';
import { ChartComponent } from './chart/chart.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { UsersComponent } from './users/users.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { TelemLimitsComponent } from './telem-limits/telem-limits.component';
import { CubesatSysInputsComponent } from './cubesat-sys-inputs/cubesat-sys-inputs.component';
import { HomePageComponent } from './home-page/home-page.component';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { AntiAuthGuardService } from './services/anti-auth-guard/anti-auth-guard.service';
import { AdminGuardService } from './services/admin-guard/admin-guard.service';
import { AdminOrSelfGuardService } from './services/admin-or-self-guard/admin-or-self-guard.service';

const routes: Routes = [
  { path : '', component: HomePageComponent },
  { path : 'telecommands', component: TelecommandsComponent },
  { path : 'telecommandBatches', component: TelecommandBatchesComponent },
  { path : 'queue', component: QueuesComponent },
  { path : 'login', component: LoginComponent, canActivate: [AntiAuthGuardService] },
  { path : 'users/create', component: CreateUserComponent, canActivate: [] },
  { path : 'error/access-denied', component: AccessDeniedComponent },
  { path : 'logout', component: LogoutComponent, canActivate: [AuthGuardService] },
  { path : 'chart', component: ChartComponent },
  { path: 'telemetry', component: ComponentListComponent },
  { path : 'users', component: UsersComponent, canActivate: [AuthGuardService, AdminGuardService] },
  { path : 'users/edit', component: ModifyUserComponent, canActivate: [AuthGuardService, AdminOrSelfGuardService] },
  { path : 'telem-limits', component: TelemLimitsComponent },
  { path : 'system-inputs', component: CubesatSysInputsComponent, canActivate: [AuthGuardService, AdminGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
