import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../core/services/user/user.service';
import * as UserActions from '../actions/user.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { AuthServices } from '../../core/services/auth/auth.services';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService, private authService: AuthServices) { }

    // Get Profile
    getProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.getProfile),
            mergeMap(() => {
                const userId = this.authService.getUserId();
                console.log("userid from user effect", userId);

                if (userId) {
                    return this.userService.getUserById(userId).pipe(
                        map(user => UserActions.getProfileSuccess({ user })),
                        catchError(error => of(UserActions.getProfileFailure({ error: error.message })))
                    );
                } else {
                    return of(UserActions.getProfileFailure({ error: 'User ID not found in local storage' }));
                }
            })
        ), { functional: true });

    // Edit Profile
    editProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.editProfile),
            mergeMap(action =>
                this.userService.updateUser(action.user).pipe(
                    map(updatedUser => UserActions.editProfileSuccess({ user: updatedUser })),
                    catchError(error => of(UserActions.editProfileFailure({ error: error.message })))
                )
            )
        ), { functional: true });

    // Delete Profile
    deleteProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteProfile),
            mergeMap(action =>
                this.userService.deleteUser(action.id).pipe(
                    map(() => UserActions.deleteProfileSuccess()),
                    catchError(error => of(UserActions.deleteProfileFailure({ error: error.message })))
                )
            )
        ), { functional: true });

}
