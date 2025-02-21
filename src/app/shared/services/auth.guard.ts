import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./user.service";
import {filter, map} from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const userSvc = inject(UserService);
  const router = inject(Router);

  return userSvc.user$.pipe(
    map(user => {
      console.log(user);
      if (route.routeConfig?.path === 'auth') {
        return !user?.surname || router.createUrlTree(['/main']);
      } else return !!user?.surname ||  router.createUrlTree(['/auth']);
    }),
  )
};
