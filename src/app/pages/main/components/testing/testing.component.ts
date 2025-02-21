import { Component, OnInit } from '@angular/core';
import {hourglass} from "../../../../shared/components/shapes/canvas/shapes/hourglass";
import {circle} from "../../../../shared/components/shapes/canvas/shapes/circle";
import {CoefficientPermissibleErrors, Shape, TrainingShapes} from "../training/training.component";
import {square} from "../../../../shared/components/shapes/canvas/shapes/square";
import {triangle} from "../../../../shared/components/shapes/canvas/shapes/triangle";
import {AlertController} from "@ionic/angular";
import {StorageService} from "../../../../shared/services/storage.service";
import {User, UserService} from "../../../../shared/services/user.service";
import {Router} from "@angular/router";
import {LocalizeService} from "../../../../shared/services/localize.service";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  standalone: false
})
export class TestingComponent  implements OnInit {
  shapes: Shape[] = [
    {
      shape: TrainingShapes.circle,
      func: circle,
      coeffPermissibleErrors: CoefficientPermissibleErrors.curve,
      results: []
    },
    {
      shape: TrainingShapes.square,
      func: square,
      coeffPermissibleErrors: CoefficientPermissibleErrors.direct,
      results: []
    },
    {
      shape: TrainingShapes.triangle,
      func: triangle,
      coeffPermissibleErrors: CoefficientPermissibleErrors.direct,
      results: []
    },
    {
      shape: TrainingShapes.hourglass,
      func: hourglass,
      coeffPermissibleErrors: CoefficientPermissibleErrors.direct,
      results: []
    },
  ]
  activeShapeIndex: number = 0;
  activeShape: any = this.shapes[0].func;
  currResult: number|null = null;
  timer = 5;
  timeoutId: any;
  user!: User;

  constructor(
    private alertCtrl: AlertController,
    private storageSvc: StorageService,
    private userSvc: UserService,
    private router: Router,
    private localizeSvc: LocalizeService
  ) { }

  async ngOnInit() {
    const alert = await this.alertCtrl.create({
      header: this.localizeSvc.translate('TITLES.INSTRUCTION'),
      message: this.localizeSvc.translate('INFO.START_TEST'),
      mode: 'ios',
      cssClass: 'alert',
      backdropDismiss: false,
      buttons: [
        {
          text: this.localizeSvc.translate('BUTTON.BACK'),
          role: 'cancel',
          handler: () => this.router.navigate(['/main'], {replaceUrl: true})
        },
        {
          text: this.localizeSvc.translate('BUTTON.START'),
          role: 'confirm',
          handler: () => this.startTimer()
        },
      ]
    })
    await alert.present();
    this.user = (await this.userSvc.user)!;
  }

  startTimer () {
    clearTimeout(this.timeoutId);

    if (this.timer > 0) {
      this.timeoutId = setTimeout(() => {
        this.timer --;
        this.startTimer()
      },1000)
    }
  }

  async handleDrawingResult(result: number): Promise<any> {
    console.log(result);
    this.currResult = result;

    this.shapes[this.activeShapeIndex].results.splice(this.activeShapeIndex, 1, result);
    if (this.activeShapeIndex === 3 && this.shapes[3].results.length) {
      const values = this.shapes.map(shape => +shape.results[0].toFixed(2));
      const testResult = values.reduce((sum, currentValue) => sum + currentValue, 0) / values.length;
      const alert = await this.alertCtrl.create({
        header: this.localizeSvc.translate('TITLES.TESTING_FINISH'),
        message: this.localizeSvc.translate('INFO.FINISH'),
        mode: 'ios',
        cssClass: 'alert',
        buttons: [
          {
            text: this.localizeSvc.translate('BUTTON.RETRY'),
            role: 'confirm',
            handler: () => window.location.reload()
          },
          {
            text: this.localizeSvc.translate('BUTTON.TO_RESULT'),
            role: 'confirm',
            handler: () => this.router.navigate(['main/result'], {replaceUrl: true})
          },
        ]
      })
      await this.storageSvc.setTestingResult(testResult, this.user);
      await alert.present();
    }
  }

  nextShape() {
    this.activeShapeIndex ++;
    this.activeShape = this.shapes[this.activeShapeIndex].func;
    this.timer = 5;
    this.startTimer();
    this.currResult = null;
  }
}
