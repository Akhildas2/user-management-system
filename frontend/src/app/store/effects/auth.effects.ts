import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthServices } from '../../core/services/auth/auth.services';
import * as AuthActions from '../actions/auth.actions';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class AuthEffects {
  
  // Login Effect
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.AuthServices.login(action.email, action.password).pipe(
          map(response => {
            this.AuthServices.setAccessToken(response.accessToken);
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

  // Logout Effect
  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      mergeMap(() =>
        this.AuthServices.logout().pipe(
          map(() => {
            this.AuthServices.clearTokens();
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

  // Register Effect
  register$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.AuthServices.register(action.name, action.email, action.phone, action.password).pipe(
          map((response) => {
            this.AuthServices.setAccessToken(response.accessToken);
            this.router.navigate(['/home']);
            return AuthActions.registerSuccess({
              accessToken: response.accessToken,
              user: response.user
            });
          }),
          catchError(error => of(AuthActions.registerFailure({
            error: error.message || 'Registration  failed'
          })))
        )
      )
    );
  }, { functional: true });

  constructor(
    private actions$: Actions,
    private AuthServices: AuthServices,
    private router: Router
  ) { }
}