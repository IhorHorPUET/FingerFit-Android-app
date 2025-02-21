import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

import {IonModal} from "@ionic/angular";
import {User, UserService} from "../../shared/services/user.service";
import {StorageService} from "../../shared/services/storage.service";
import {Router} from "@angular/router";
import {LocalizeService} from "../../shared/services/localize.service";
import {FontsService} from "../../shared/services/fonts.service";


export enum AuthMode{
  auth = 'auth',
  register = 'register'
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: false,
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent  implements OnInit {
  @ViewChild('usersModal', {static: false}) userModal!: IonModal;

  mode: AuthMode = AuthMode.auth;
  form = new FormGroup<{
    surname: FormControl<string | null>;
    name?: FormControl<string | null>;}>({
    surname: new FormControl(null, [Validators.required, Validators.minLength(4)])
  });
  users: User[] = [];

  constructor(
    private storageSvc: StorageService,
    private userSvc: UserService,
    private router: Router,
    private localize: LocalizeService,
    private fontService: FontsService
  ) { }

  ngOnInit() {}

  async submit(): Promise<any> {
    if (this.form.invalid) return;

    const body = this.form.value;
    let user;

    if (this.mode === AuthMode.auth) {
      user  = await this.storageSvc.getUser(body.surname!);
      if (!user) return this.changeAuthMode();

      this.users = await this.storageSvc.get('USERS');
      if (Object.keys(this.users).length > 1) {
        await this.userModal.present()
      } else {
        await this.auth(user)
      }
    } else {
      await this.storageSvc.setNewUser(body);
      user = body as User;
      // this.userSvc.user = body as User;
      await this.auth(user)
    }

  }

  async auth(user: User) {
    this.userSvc.user = user;
    await this.storageSvc.setActiveUser(user.surname);
    await this.fontService.initFontSize(user.settings?.fontSize);
    await this.localize.initLang();
    document.body.className = ""
    document.body.classList.add(user.settings!.theme);
    setTimeout(() => this.router.navigate(['main'],{replaceUrl: true}))
  }

  changeAuthMode(){
   this.mode = this.mode === AuthMode.auth ?  AuthMode.register : AuthMode.auth;

   if (this.mode === AuthMode.register) {
     this.form.addControl('name', new FormControl(null, [Validators.required, Validators.minLength(4)]));
   } else {
     this.form.removeControl('name');
   }
  }

  error(control: FormControl) {
    if (control?.errors?.['minlength']) return 'ERROR.MIN_LENGTH'
    if (control?.errors?.['required']) return `ERROR.REQUIRED`
    return '';
  }

  protected readonly Object = Object;
  protected readonly AuthMode = AuthMode;
}
