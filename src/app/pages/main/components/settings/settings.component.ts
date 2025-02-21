import {Component, OnDestroy, OnInit} from '@angular/core';
import {Langs, LocalizeService} from "../../../../shared/services/localize.service";
import {StorageService} from "../../../../shared/services/storage.service";
import {Settings, User, UserService} from "../../../../shared/services/user.service";
import {FontsService} from "../../../../shared/services/fonts.service";
import {Router} from "@angular/router";

export enum FontSize {
  standard = 'standard',
  large = 'large',
}
export enum Theme{
  light = 'light',
  dark = 'dark',
  cont = 'cont'
}

export interface FontsSize {
  [FontSize.standard]: FontCategory;
  [FontSize.large]: FontCategory;
}

export interface FontCategory {
  standard: number;
  button: number;
  title: number;
  large: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit, OnDestroy {
  protected readonly Langs = Langs;
  readonly Object = Object;
  protected readonly FontSize = FontSize;

  settings!: Settings;
  user!: User;
  submitted = false;

  constructor(private localizeSvc: LocalizeService,
              private  userSvc: UserService,
              private fontsSvc: FontsService,
              private storageSvc: StorageService,
              private router: Router) {}

  async ngOnInit(): Promise<any>  {
    this.user = (await this.userSvc.user)!
    this.settings = {...this.user?.settings!};
  }

  changeLang(event: CustomEvent) {
    this.localizeSvc.changeLanguage(event.detail.value);
    this.settings.lang = event.detail.value;
  }

  async changeFontSize(event: CustomEvent) {
    await this.fontsSvc.initFontSize(event.detail.value);
    this.settings.fontSize = event.detail.value;
  }

  switchThemeMode(event: CustomEvent) {
    document.body.className = ""
    document.body.classList.add(event.detail.value);
    this.settings.theme = event.detail.value;
  }

  async submit() {
    const user = (await this.userSvc.user)!;
    user.settings = this.settings;
    await this.storageSvc.setSettings(user);
    await this.router.navigate(['/main'], {replaceUrl: true})
    this.submitted = true;
  }

  async logout() {
    await this.storageSvc.setActiveUser('');
    this.userSvc.user = null;
    await this.router.navigate(['/auth', {replaceUrl: true}]);
  }

  async ngOnDestroy() {
    if (!this.submitted) {
      await this.localizeSvc.initLang();
      await this.fontsSvc.initFontSize();

      document.body.className = ""
      document.body.classList.add(this.user.settings!.theme);
    }
  }

  protected readonly Theme = Theme;
}
