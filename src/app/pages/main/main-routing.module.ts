import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./main.component";
import {TrainingComponent} from "./components/training/training.component";
import {SuccessComponent} from "./components/success/success.component";
import {TestingComponent} from "./components/testing/testing.component";
import {ResultComponent} from "./components/result/result.component";
import {SettingsComponent} from "./components/settings/settings.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'training',
    component: TrainingComponent
  },
  {
    path: 'testing',
    component: TestingComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {}
