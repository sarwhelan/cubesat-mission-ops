import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // TODO: Before deployment, maybe refine this to only the modules we need to reduce package size
import { HttpClientModule } from '@angular/common/http'; 

import { HighchartsChartModule } from 'highcharts-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TelecommandsComponent } from './telecommands/telecommands.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { TelecommandDetailsComponent } from './telecommand-details/telecommand-details.component';
import { TelecommandBatchesComponent } from './telecommand-batches/telecommand-batches.component';
import { TelecommandBatchDetailsComponent } from './telecommand-batch-details/telecommand-batch-details.component';
import { QueuesComponent } from './queues/queues.component';
import { ExecutionQueueComponent } from './execution-queue/execution-queue.component';
import { TransmissionQueueComponent } from './transmission-queue/transmission-queue.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { AlertComponent } from './alert/alert.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ModalComponent } from './modal/modal.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { LogoutComponent } from './logout/logout.component';
import { ChartComponent } from './chart/chart.component';
import { ComponentListComponent } from './component-list/component-list.component';
import { ComponentTelemetryComponent } from './component-telemetry/component-telemetry.component';
import { TelemetryDataComponent } from './telemetry-data/telemetry-data.component';
import { UsersComponent } from './users/users.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ModifyUserComponent } from './modify-user/modify-user.component';
import { TelemLimitsComponent } from './telem-limits/telem-limits.component';
import { CreateSystemComponent } from './create-system/create-system.component';
import { CreateComponentComponent } from './create-component/create-component.component';
import { CreateComponentTelemetryComponent } from './create-component-telemetry/create-component-telemetry.component';
import { CubesatSysInputsComponent } from './cubesat-sys-inputs/cubesat-sys-inputs.component';

@NgModule({
  declarations: [
    AppComponent,
    TelecommandsComponent,
    HeaderComponent,
    LoginComponent,
    TelecommandDetailsComponent,
    TelecommandBatchesComponent,
    TelecommandBatchDetailsComponent,
    QueuesComponent,
    ExecutionQueueComponent,
    TransmissionQueueComponent,
    CreateUserComponent,
    AlertComponent,
    NewPasswordComponent,
    ModalComponent,
    AccessDeniedComponent,
    LogoutComponent,
    ChartComponent,
    ComponentListComponent,
    ComponentTelemetryComponent,
    TelemetryDataComponent,
    UsersComponent,
    PaginationComponent,
    ModifyUserComponent,
    TelemLimitsComponent,
    CreateSystemComponent,
    CreateComponentComponent,
    CreateComponentTelemetryComponent,
    CubesatSysInputsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    HttpClientModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CreateSystemComponent, 
    CreateComponentComponent,
    CreateComponentTelemetryComponent,
  ]
})
export class AppModule { }
