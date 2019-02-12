import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TelecommandsComponent } from './telecommands/telecommands.component';
import { LoginComponent } from './login/login.component';
import { TelecommandBatchesComponent } from './telecommand-batches/telecommand-batches.component';
import { QueuesComponent } from './queues/queues.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
  { path : 'telecommands', component: TelecommandsComponent },
  { path : 'telecommandBatches', component: TelecommandBatchesComponent },
  { path : 'queue', component: QueuesComponent },
  { path : 'login', component: LoginComponent },
  { path : 'users/create', component: CreateUserComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
