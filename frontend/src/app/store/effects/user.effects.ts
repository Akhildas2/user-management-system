import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../core/services/user/user.service';
import * as UserActions from '../actions/user.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthServices } from '../../core/services/auth/auth.services';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../shared/services/notification.service';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private userService: UserService,
    private authService: AuthServices,
    private store: Store,
    private notificationService: NotificationService,
    private router:Router,
  ) { }

  // Get Profile
  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.getProfile),
      mergeMap(() => {
        const userId = this.authService.getUserId();
        if (!userId) {
          this.notificationService.showNotification('User session expired. Please login again.', 'error');
          return of(UserActions.getProfileFailure({ error: 'User session expired. Please login again.' }));
        }
        return this.userService.getUserById(userId).pipe(
          map(user => {
            return UserActions.getProfileSuccess({ user });
          }),
          catchError(error => {
            console.error('Error fetching profile:', error);
            this.notificationService.showNotification('Failed to load profile.', 'error');
            return of(UserActions.getProfileFailure({ error: error.message }));
          })
        );
      })
    ),
    { functional: true }
  );

  // Edit Profile
  editProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.editProfile),
      mergeMap(action => {
        const userId = this.authService.getUserId();
        if (!userId) {
          this.notificationService.showNotification('User session expired. Please login again.', 'error');
          return of(UserActions.editProfileFailure({ error: 'User session expired. Please login again.' }));
        }
        const updatedUser = { ...action.user, id: userId };
        return this.userService.updateUser(updatedUser).pipe(
          map(updatedUser => {
            this.notificationService.showNotification('Profile updated successfully.', 'success');
            this.store.dispatch(UserActions.getProfile());
            return UserActions.editProfileSuccess({ user: updatedUser });
          }),
          catchError(error => {
            console.error('Error updating profile:', error);
            this.notificationService.showNotification('Failed to update profile.', 'error');
            return of(UserActions.editProfileFailure({ error: error.message }));
          })
        );
      })
    ),
    { functional: true }
  );

  // Delete Profile
  deleteProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteProfile),
      mergeMap(action =>
        this.userService.deleteUser(action.id).pipe(
          map(() => {
            this.authService.clearTokens();
            this.authService.setUserId('');
            this.notificationService.showNotification('Profile deleted successfully. See you soon!', 'success');
            this.router.navigate(['/login']);
            return UserActions.deleteProfileSuccess();
          }),
          catchError(error => {
            this.notificationService.showNotification('Failed to delete profile.', 'error');
            return of(UserActions.deleteProfileFailure({ error: error.message }));
          })
        )
      )
    ),
    { functional: true }
  );
}
