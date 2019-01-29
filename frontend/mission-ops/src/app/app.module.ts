import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TelecommandsComponent } from './telecommands/telecommands.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { TelecommandDetailsComponent } from './telecommand-details/telecommand-details.component';
import { TelecommandBatchesComponent } from './telecommand-batches/telecommand-batches.component';
import { TelecommandBatchDetailsComponent } from './telecommand-batch-details/telecommand-batch-details.component';

@NgModule({
  declarations: [
    AppComponent,
    TelecommandsComponent,
    HeaderComponent,
    LoginComponent,
    TelecommandDetailsComponent,
    TelecommandBatchesComponent,
    TelecommandBatchDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
