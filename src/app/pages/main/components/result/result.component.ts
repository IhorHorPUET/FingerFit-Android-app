import { Component, OnInit } from '@angular/core';
import {StorageService} from "../../../../shared/services/storage.service";
import {UserService} from "../../../../shared/services/user.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  standalone: false
})
export class ResultComponent  implements OnInit {
  results: {result: number, date: string}[] = [];

  constructor(
    private userSvc: UserService
  ) { }

  async ngOnInit() {
    const user = (await this.userSvc.user)!;
    this.results = user.testResults!;
  }
}
