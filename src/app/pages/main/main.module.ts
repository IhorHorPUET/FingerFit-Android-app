import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MainComponent} from "./main.component";
import {IonicModule} from "@ionic/angular";
import {MainRoutingModule} from "./main-routing.module";
import {TrainingComponent} from "./components/training/training.component";
import { register } from 'swiper/element/bundle';
import {CanvasComponent} from "../../shared/components/shapes/canvas/canvas.component";
import {SuccessComponent} from "./components/success/success.component";
import {TestingComponent} from "./components/testing/testing.component";
import {ResultComponent} from "./components/result/result.component";
import {TranslatePipe} from "@ngx-translate/core";
import {SettingsComponent} from "./components/settings/settings.component";


register();
@NgModule({
  declarations: [
    MainComponent,
    TrainingComponent,
    CanvasComponent,
    SuccessComponent,
    TestingComponent,
    ResultComponent,
  SettingsComponent],
    imports: [
        CommonModule,
        IonicModule,
        MainRoutingModule,
        TranslatePipe
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainModule { }
