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
    private router: Router,
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
            const errorMessage = error?.error?.msg || 'Failed to load profile.';
            this.notificationService.showNotification(errorMessage, 'error');
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
            const errorMessage = error?.error?.msg || 'Failed to update profile.';
            this.notificationService.showNotification(errorMessage, 'error');
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
            const errorMessage = error?.error?.msg || 'Failed to delete profile.';
            this.notificationService.showNotification(errorMessage, 'error');
            return of(UserActions.deleteProfileFailure({ error: error.message }));
          })
        )
      )
    ),
    { functional: true }
  );

  // Upload Photo
  uploadPhoto$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateProfileImage),
      mergeMap(action => {
        const formData = action.formData;
        return this.userService.uploadPhoto(formData).pipe(
          map((response) => {
            this.notificationService.showNotification('Photo updated successfully.', 'success');
            this.store.dispatch(UserActions.getProfile());
            return UserActions.updateProfileImageSuccess({ user: response.user });
          }),
          catchError((error) => {
            const errorMessage = error?.error?.msg || error?.message || 'Failed to update profile photo.';
            this.notificationService.showNotification(errorMessage, 'error');
            return of(UserActions.updateProfileImageFailure({ error: errorMessage }));
          })
        );
      })
    ),
    { functional: true }
  );

}
