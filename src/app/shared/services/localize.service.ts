import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from "./storage.service";
import {UserService} from "./user.service";

export enum Langs {
  uk = 'uk',
  en = 'en'
}

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {
  public languages = [Langs.uk, Langs.en];
  curLang!: Langs;

  constructor(
    private translateService: TranslateService,
    private userSvc: UserService
  ) {}

  async initLang() {
    const user = await this.userSvc.user;
    await this.changeLanguage(user?.settings?.lang || Langs.uk);
  }

  translate(key: string): string {
    return this.translateService.instant(key);
  }

  async changeLanguage(lang: Langs) {
    const isValid = this.languages.find(l => l === lang);
    if (!isValid) {
      lang = this.languages[0];
    }

    this.translateService.use(lang);
    this.curLang = lang as Langs;
  }
}
