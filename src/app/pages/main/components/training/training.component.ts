import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {rectangle} from "../../../../shared/components/shapes/canvas/shapes/rectangle";
import {circle} from "../../../../shared/components/shapes/canvas/shapes/circle";
import {hourglass} from "../../../../shared/components/shapes/canvas/shapes/hourglass";
import {eight} from "../../../../shared/components/shapes/canvas/shapes/eight";
import {AlertController} from "@ionic/angular";
import {StorageService} from "../../../../shared/services/storage.service";
import {User, UserService} from "../../../../shared/services/user.service";
import {Router} from "@angular/router";
import {LocalizeService} from "../../../../shared/services/localize.service";

export enum CoefficientPermissibleErrors {
  curve = 15,
  direct = 7
}

export enum TrainingShapes {
  rectangle = 'rectangle',
  hourglass = 'hourglass',
  eight = 'eight',
  circle = 'circle',
  square = 'square',
  triangle =  'triangle'
}

export interface Shape {
  shape: TrainingShapes,
  func: Function,
  coeffPermissibleErrors: CoefficientPermissibleErrors,
  results: number[];
}

export type TrainingResults = {
  [key in TrainingShapes]?: number
}

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
  standalone: false
})

export class TrainingComponent implements OnInit {
  shapes: Shape[] = [
    {
      shape: TrainingShapes.rectangle,
      func: rectangle,
      coeffPermissibleErrors: CoefficientPermissibleErrors.direct,
      results: []
    },
    {
      shape: TrainingShapes.hourglass,
      func: hourglass,
      coeffPermissibleErrors: CoefficientPermissibleErrors.direct,
      results: []
    },

    {
      shape: TrainingShapes.circle,
      func: circle,
      coeffPermissibleErrors: CoefficientPermissibleErrors.curve,
      results: []
    },
    {
      shape: TrainingShapes.eight,
      func: eight,
      coeffPermissibleErrors: CoefficientPermissibleErrors.curve,
      results: []
    }
  ]
  stage = 1;
  activeShapeIndex = 0;
  activeShape: any = this.shapes[0].func;
  currResult: number = 0;
  trainingResults: TrainingResults = {};
  user!: User;


  constructor (
    private chRef: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private storageSvc: StorageService,
    private userSvc: UserService,
    private router: Router,
    private localizeSvc: LocalizeService
  ) {}

  async ngOnInit() {
    const alert = await this.alertCtrl.create({
      header: this.localizeSvc.translate('TITLES.INSTRUCTION'),
      message: this.localizeSvc.translate('INFO.START_TRAINING'),
      cssClass: 'alert',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text:  this.localizeSvc.translate('BUTTON.BACK'),
          role: 'cancel',
          handler: () => this.router.navigate(['/main'], {replaceUrl: true})
        },
        {
          text: this.localizeSvc.translate('BUTTON.START'),
          role: 'confirm',
        },
      ]
    })
    await alert.present();
    this.user = (await this.userSvc.user)!;
  }

  async handleDrawingResult(result: number): Promise<any> {
    this.currResult = +result.toFixed(2);
    if (!result || result < 70) {
      this.activeShape = null;
      this.chRef.detectChanges();
      this.activeShape = this.shapes[this.activeShapeIndex].func;
      return;
    }

    this.shapes[this.activeShapeIndex].results.splice(this.stage - 1, 1, result);

    if (this.stage <= 2) {
      this.stage++;
      this.activeShape = null;
      this.chRef.detectChanges();
      this.activeShape = this.shapes[this.activeShapeIndex].func;
      this.currResult = 0;
    }

    if (this.shapes[this.activeShapeIndex].results.length === 3) {
      this.shapes.forEach(shape => {
        this.trainingResults[shape.shape] = shape.results.reduce((sum, currentValue) => sum + currentValue, 0) / shape.results.length;
      })
    }

    if (this.shapes[3].results.length === 3) {
      const alert = await this.alertCtrl.create({
        header: this.localizeSvc.translate('TITLES.TRAINING_FINISH'),
        message: this.localizeSvc.translate('INFO.FINISH'),
        cssClass: 'alert',
        mode: 'ios',
        buttons: [
          {
            text: this.localizeSvc.translate('BUTTON.TO_RESULT'),
            role: 'confirm',
            handler: () => this.router.navigate(['main/success'], {replaceUrl: true})
          },
        ]
      })
      await this.storageSvc.setTrainingResult(this.trainingResults, this.user)
      await alert.present();
    }
  }

  switchShape(i: number) {
    this.stage = 1;
    this.activeShapeIndex += i;
    this.activeShape = this.shapes[this.activeShapeIndex].func;
    this.currResult = 0;
  }
}
