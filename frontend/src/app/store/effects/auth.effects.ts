import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthServices } from '../../core/services/auth/auth.services';
import * as AuthActions from '../actions/auth.actions';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of } from 'rxjs';
import { NotificationService } from '../../shared/services/notification.service';

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
            this.AuthServices.setUserId(response.user._id);
            this.notificationService.showNotification('Login successful! Welcome back.', 'success');
            this.router.navigate(['/home']);

            return AuthActions.loginSuccess({
              accessToken: response.accessToken,
              user: response.user
            });
          }),
          catchError(error => {
            const errorMessage = error?.error?.message || 'Login failed. Please check your credentials.';
            this.notificationService.showNotification(errorMessage, 'error');
            return of(AuthActions.loginFailure({
              error: error.message
            }));
          })
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
            this.AuthServices.setUserId('');
            this.notificationService.showNotification('Logout successful. See you soon!', 'success');
            this.router.navigate(['/login']);

            return AuthActions.logoutSuccess();
          }),
          catchError((error) => {
            const errorMessage = error?.error?.message || 'Logout failed. Please try again.';
            this.notificationService.showNotification(errorMessage, 'error');
            return of(AuthActions.logoutFailure({
              error: errorMessage
            }));
          })
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
            this.AuthServices.setUserId(response.user._id)
            this.notificationService.showNotification('Registration successful! Welcome to our platform!', 'success');
            this.router.navigate(['/home']);

            return AuthActions.registerSuccess({
              accessToken: response.accessToken,
              user: response.user
            });
          }),
          catchError((error) => {
            const errorMessage = error?.error?.message || 'Registration failed. Please try again.';
            this.notificationService.showNotification(errorMessage, 'error');
            return of(AuthActions.registerFailure({
              error: errorMessage
            }));
          })
        )
      )
    );
  }, { functional: true });

  constructor(
    private actions$: Actions,
    private AuthServices: AuthServices,
    private router: Router,
    private notificationService: NotificationService
  ) { }
}