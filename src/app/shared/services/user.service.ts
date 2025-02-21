import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {BehaviorSubject} from "rxjs";
import {Langs} from "./localize.service";
import {FontSize, FontsSize} from "../../pages/main/components/settings/settings.component";
import {TrainingResults} from "../../pages/main/components/training/training.component";
import {Router} from "@angular/router";

export interface User {
  name: string,
  surname: string,
  trainingResults?: { [key: string]: TrainingResults[] },
  testResults?: [],
  settings?: Settings
}

export interface Settings {
  lang: Langs,
  fontSize: FontSize,
  theme: string,
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user$ = new BehaviorSubject<User | null>(null);
  fontsSize: FontsSize = {
    standard: {
      standard: 20,
      button: 22,
      title: 24,
      large: 30
    },
    large: {
      standard: 24,
      button: 26,
      title: 28,
      large: 34
    }
  }

  constructor(
    private storageSvc: StorageService,
    private router: Router
  ) {}

  get user(): Promise<User | null> {
    return this.storageSvc.getUser(this.user$.value!.surname);
  }

  set user(user: User|null) {
    this.user$.next(user);
  }

  async init() {
    const userId = await this.storageSvc.get('ACTIVE_USER');
    const user = await this.storageSvc.getUser(userId)
    this.user$.next(user || {});

    if (user) await this.router.navigate([`/main`]);
  }
}
