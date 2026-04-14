import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AppState } from "../reducers";
import { inject } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { isLoggedIn } from "./auth.selector";
import { tap } from "rxjs/operators";

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const store = inject(Store<AppState>);
  const router = inject(Router);

  return store.pipe(
    select(isLoggedIn),
    tap(loggedIn => {
      if (!loggedIn) {
        router.navigateByUrl('/login');
      }
    })
  );
};