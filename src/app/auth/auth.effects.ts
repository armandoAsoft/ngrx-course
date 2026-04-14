import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { AuthActions } from "./action-types";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private router = inject(Router);

  login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.login),
      tap(action => {
        localStorage.setItem('user', JSON.stringify(action.user));
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.logout),
      tap(() => {
        localStorage.removeItem('user');
        this.router.navigateByUrl('/login');
      })
    ), { dispatch: false }
  );
}