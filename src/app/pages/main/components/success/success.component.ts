import {Component, OnInit} from '@angular/core';
import {BarController, BarElement, CategoryScale, Chart, ChartConfiguration, LinearScale,} from 'chart.js';
import {StorageService} from "../../../../shared/services/storage.service";
import {UserService} from "../../../../shared/services/user.service";
import {TrainingResults, TrainingShapes} from "../training/training.component";
import {FontSize, Theme} from "../settings/settings.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  standalone: false
})
export class SuccessComponent  implements OnInit {
  trainingResults:  { [key: string]: TrainingResults[] } = {};
  config!: ChartConfiguration;
  chartsData!: {[key in TrainingShapes]?: ChartConfiguration};
  fontColor = getComputedStyle(document.body).getPropertyValue('--dark-color');

  constructor(private storageSvc: StorageService,
              private userSvc: UserService) { }

  async ngOnInit() {
    await this.initConfig();
    await this.initChartData();
    setTimeout(() => this.initCharts())
  }

  initCharts() {
    if (!Object.keys(this.trainingResults)?.length) return;

    Chart.register(BarController, CategoryScale, LinearScale, BarElement);
    const charts = [];
    Object.keys(this.chartsData).forEach(key => {
      const ctx = document.getElementById(key) as HTMLCanvasElement;
      charts.push(new Chart(ctx, this.chartsData[key as TrainingShapes]!));
    })
  }

  async initChartData() {
    this.trainingResults = (await this.userSvc.user)!.trainingResults!;
    if (!this.trainingResults) return;

    const isContrMode = (await this.userSvc.user)!.settings!.theme === Theme.cont
    this.chartsData = {
      [TrainingShapes.rectangle]: structuredClone(this.config),
      [TrainingShapes.hourglass]: structuredClone(this.config),
      [TrainingShapes.eight]: structuredClone(this.config),
      [TrainingShapes.circle]:structuredClone(this.config),
    }

    return Object.entries(this.trainingResults).forEach(([date,arr])=> {
      arr.forEach(r => Object.entries((r)).forEach(([shape, val],i) => {
        const datePipe = new DatePipe('en-US');
        const formattedDate = datePipe.transform(date, 'dd/MM HH:mm');
        this.chartsData[shape as TrainingShapes]!.data.datasets[0].data.push(val);
        (this.chartsData[shape as TrainingShapes]!.data.datasets[0].backgroundColor as string[]).push(isContrMode ? 'rgba(49, 49, 49, .9)' : val > 80 ?  'rgba(130,206,90,0.7)':'rgba(255, 99, 132, 0.7)')
        this.chartsData[shape as TrainingShapes]!.data.labels!.push(formattedDate);
      }))
    })
  }

  async initConfig() {
    const user = await this.userSvc.user;
    const isFontStandard = user?.settings?.fontSize === FontSize.standard;
    this.config = {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: []
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
        scales: {
          x: {
            ticks: {
              color: this.fontColor,
              autoSkip: true,
              font: {
                size: isFontStandard ? 16 : 20,
              }
            },
            grid: {
              color: this.fontColor + '6F',
            }
          },
          y: {
            ticks: {
              color: this.fontColor,
              font: {
                size: isFontStandard ? 16 : 20
              },
            },
            grid: {
              color: this.fontColor + '6F',
            },
            min: 0,
            max: 100
          }
        }
      },
    }
  }

  protected readonly Object = Object;
}
