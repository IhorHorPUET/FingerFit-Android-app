import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CoefficientPermissibleErrors} from "../../../../pages/main/components/training/training.component";
import {User, UserService} from "../../../services/user.service";
import {Theme} from "../../../../pages/main/components/settings/settings.component";


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
  standalone: false

})
export class CanvasComponent implements OnInit {
  @ViewChild('canvasElement', {static: false}) canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() drawingComplete: EventEmitter<number> = new EventEmitter();

  @Input() coeff!: CoefficientPermissibleErrors;
  @Input() set stage(event: number) {
    this._stage = event
  }
  @Input() set drawShape(func: any) {
    if (!func) return;

    setTimeout(async () => {
      await this.init();
      this.contourPoints = func(this.canvas, this.ctx, this.stage - 1, this.user.settings!.theme === Theme.cont);
      this.shape = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    })
  }
  @Input() set timer(event: number) {
    if (event === 0 && !this.disabledCanvas) this.finishDrawing();
  }

  contourPoints: Map<string, { x: number; y: number; }> = new Map<string, { x: number; y: number }>();
  ctx!: CanvasRenderingContext2D;
  shape!: ImageData;
  path: { x: number; y: number; }[] = [];
  canvas!: HTMLCanvasElement;
  accuracy!: number;
  _stage!: number;
  disabledCanvas = false;
  drawing = false;
  user!: User;


  get stage() {
    return this._stage;
  }

  constructor(private userSvc: UserService) {}

  ngOnInit() {}


  touchstart() {
    if (this.disabledCanvas) return;

    this.drawing = true;
    this.ctx.beginPath();
    this.path = [];
    this.ctx!.putImageData(this.shape, 0, 0);
  }

  touchmove(e: any) {
    if (this.disabledCanvas) return;

    const x = +e.changedTouches[0].clientX;
    const y = +e.changedTouches[0].clientY - 60;
    const prevPoint = this.path?.[this.path.length - 1];

    const dx = x - prevPoint?.x;
    const dy = y - prevPoint?.y;
    const pointsDistance = Math.sqrt(dx ** 2 + dy ** 2);
    if (pointsDistance >= 3) {
      const segments = Math.ceil(pointsDistance);
      for (let j = 3; j < segments; j += 3) {
        const t = j / segments;
        const newX = prevPoint?.x + t * dx;
        const newY = prevPoint?.y + t * dy;
        this.path.push({x: +newX, y: +newY});
      }
    }
    if (this.path.length === 0) this.path.push({x, y});
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  touchend() {
    if (this.disabledCanvas) return;

    this.finishDrawing();
  }

  async init() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext("2d")!;

    this.canvas.width = innerWidth
    this.canvas.height = innerHeight * 0.85 + 60; //toolbar height

    this.path = [];
    this.disabledCanvas = false;
    this.user = (await this.userSvc.user)!;
  }

  calculateAccuracy() {
    const maxDistance = 10;
    let correctPoints = new Map();
    const counterPointsCopy = structuredClone(this.contourPoints);

    this.path.forEach((userPoint) => {
      let minDistance = Infinity;
      let closestIndex: string;

      this.contourPoints.forEach((contourPoint, key) => {
        const distance = Math.sqrt((userPoint.x - contourPoint.x) ** 2 + (userPoint.y - contourPoint.y) ** 2);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = key;
        }
      })

      if ((minDistance <= maxDistance && closestIndex!)) {
        correctPoints.set(JSON.stringify(closestIndex), this.contourPoints.get(closestIndex));
        this.contourPoints.delete(closestIndex);
      }
    });

    const qualityToQuantityRatio = ((correctPoints.size / counterPointsCopy.size * 100) / 100 * counterPointsCopy.size) / this.path.length * (100 + this.coeff) / 100;
    let accuracy = (correctPoints.size / counterPointsCopy.size * 100) * qualityToQuantityRatio || 0;
    accuracy = Math.min(100, accuracy);
    this.accuracy = +accuracy.toFixed(2)
    this.drawingComplete.emit(this.accuracy);
  }

  finishDrawing() {
    this.drawing = false;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.calculateAccuracy();
    this.disabledCanvas = true;
  }
}
