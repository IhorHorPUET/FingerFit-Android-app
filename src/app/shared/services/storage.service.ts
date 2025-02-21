import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {TrainingResults} from "../../pages/main/components/training/training.component";
import {User} from "./user.service";
import {Langs} from "./localize.service";
import {FontSize, Theme} from "../../pages/main/components/settings/settings.component";


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  protected store: Storage;

  constructor() {
    this.store = new Storage();
  }

  async initStorage() {
    await this.store.create();
  }

  async setNewUser(data: any) {
    let users = await this.get('USERS');
    if (!users) users = [];

    data.trainingResults = {};
    data.testResults = [];
    data.settings = {
      lang: Langs.uk,
      fontSize: FontSize.standard,
      theme: Theme.light,
    };

    users[data.surname] = data;
    await this.store.set('USERS', users);
  }

  async setActiveUser (name: string) {
    return this.store.set('ACTIVE_USER', name);
  }

  async setTrainingResult(trainingResults: TrainingResults, currUser: User) {
    let users = await this.get('USERS');
    const date = new Date().toISOString();
    const user = users[currUser?.surname!];

    if (!user.trainingResults?.[date]) user.trainingResults[date] = [];
    user.trainingResults[date].push(trainingResults);
    await this.store.set('USERS', users);
  }

  async setTestingResult(testResult: number, currUser: User) {
    let users = await this.get('USERS');
    const date = new Date().toISOString();
    const user = users[currUser?.surname!];

    user.testResults.push({result: testResult, date});
    await this.store.set('USERS', users);
  }

  async setLanguage(lang: Langs, currUser: User) {
    let users = await this.get('USERS');
    const user: User = users[currUser?.surname!];
    user.settings!.lang = lang;
    await this.store.set('USERS', users);
  }

  async setSettings(user: User) {
    let users = await this.get('USERS');
    users[user?.surname!] = user;
    await this.store.set('USERS', users);
  }


  async getUser(key: string) {
    return (await this.store.get('USERS'))?.[key];
  }

  async get(key: string) {
    return await this.store.get(key);
  }
}
