import { Component } from '@angular/core';
import {Platform} from "@ionic/angular";
import {StorageService} from "./shared/services/storage.service";
import {UserService} from "./shared/services/user.service";
import {LocalizeService} from "./shared/services/localize.service";
import {FontsService} from "./shared/services/fonts.service";
import {Theme} from "./pages/main/components/settings/settings.component";



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private storageSvc: StorageService,
    private userSvc: UserService,
    private localizeSvc: LocalizeService,
    private fontSvc: FontsService
  ) {
    this.init()
  }

  async init() {
    await this.storageSvc.initStorage();
    await this.platform.ready();
    await this.userSvc.init();
    await this.localizeSvc.initLang();
    await this.fontSvc.initFontSize();

    const user = await this.userSvc.user;
    document.body.classList.add(user?.settings?.theme || Theme.light);
  }
}
