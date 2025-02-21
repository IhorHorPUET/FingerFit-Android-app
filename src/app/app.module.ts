import {NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthComponent} from "./pages/auth/auth.component";
import {ReactiveFormsModule} from "@angular/forms";
import localeUk from '@angular/common/locales/uk';
import localeEn from '@angular/common/locales/en';
import {Drivers} from "@ionic/storage";
import {IonicStorageModule} from "@ionic/storage-angular";
import {registerLocaleData} from "@angular/common";
import {HttpClient,provideHttpClient} from "@angular/common/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from '@ngx-translate/http-loader';


@NgModule({
  declarations: [AppComponent,AuthComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateLoader  => {
          return new TranslateHttpLoader(http, './assets/locale/', '.json');
        },
        deps: [HttpClient],
      },
      defaultLanguage: 'uk'
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideHttpClient()],
  bootstrap: [AppComponent],
})
export class AppModule {}
