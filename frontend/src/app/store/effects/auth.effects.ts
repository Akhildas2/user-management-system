import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => {
            this.authService.setAccessToken(response.accessToken);
            this.router.navigate(['/home']);
            return AuthActions.loginSuccess({
              accessToken: response.accessToken,
              user: response.user
            });
          }),
          catchError(error => of(AuthActions.loginFailure({
            error: error.message || 'Login failed'
          })))
        )
      )
    );
  }, { functional: true });

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.authService.logout().pipe(
          map(() => {
            this.authService.clearTokens();
            this.router.navigate(['/login']);
            return AuthActions.logoutSuccess();
          }),
          catchError(error => of(AuthActions.logoutFailure({
            error: error.message || 'Logout failed'
          })))
        )
      )
    );
  }, { functional: true });

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }
}