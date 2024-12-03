import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import { AuthActions } from '../actions/auth.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(response => {
            // Store the access token
            this.authService.setAccessToken(response.accessToken);

            // Navigate to home page
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

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) { }
}