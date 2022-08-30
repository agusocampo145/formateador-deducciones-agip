import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RetencionesComponent } from './retenciones/retenciones.component';
import { PercepcionesComponent } from './percepciones/percepciones.component';

@NgModule({
  declarations: [
    AppComponent,
    RetencionesComponent,
    PercepcionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
