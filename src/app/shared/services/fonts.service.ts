import { Injectable } from '@angular/core';
import {UserService} from "./user.service";
import {FontSize} from "../../pages/main/components/settings/settings.component";

@Injectable({
  providedIn: 'root'
})
export class FontsService {

  constructor(private userSvc: UserService) { }

  async initFontSize(font?: FontSize) {
    const user = await this.userSvc.user;
    if (!user && !font) return;

    const fontsSize = this.userSvc.fontsSize[font || user!.settings!.fontSize];
    document.documentElement.style.setProperty('--font-size', fontsSize.standard + 'px');
    document.documentElement.style.setProperty('--font-size-button', fontsSize.button + 'px');
    document.documentElement.style.setProperty('--font-size-title', fontsSize.title + 'px');
    document.documentElement.style.setProperty('--font-size-large', fontsSize.large + 'px');
  }
}
