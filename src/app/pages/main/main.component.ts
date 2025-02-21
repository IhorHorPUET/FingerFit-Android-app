import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: false
})
export class MainComponent   {

  constructor(
    private router: Router
  ) { }



  async navigateTo(link: string) {
    await this.router.navigate([link, {}])
  }

}
