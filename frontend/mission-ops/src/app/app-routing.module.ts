import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelecommandsComponent } from './telecommands/telecommands.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path : 'telecommands', component: TelecommandsComponent },
  { path : 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
