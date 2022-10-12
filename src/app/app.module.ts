import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { DatePipe } from '@angular/common';
import { JwPaginationModule } from 'jw-angular-pagination';
import { CoreModule } from './core/core.module';
import { BroadcastModule } from './spring-boot-api/broadcast.module';
import { WebexModule } from './webex-api/webex.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwPaginationModule,
    CoreModule,
    BroadcastModule,
    WebexModule
  ],
  providers: [
    DatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
