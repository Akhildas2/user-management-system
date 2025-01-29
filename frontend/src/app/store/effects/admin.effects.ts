import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AdminService } from '../../core/services/admin/admin.service';
import * as AdminActions from '../actions/admin.actions';
import { NotificationService } from '../../shared/services/notification.service';

@Injectable()
export class AdminEffects {
    constructor(
        private actions$: Actions,
        private adminService: AdminService,
        private notificationService: NotificationService
    ) { }

    // Fetch Users
    fetchUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.fetchUsers),
            mergeMap(() => {
                return this.adminService.getUsers().pipe(
                    map((users) => {
                        return AdminActions.fetchUsersSuccess({ users });
                    }),
                    catchError(error => {
                        const errorMessage = error?.error?.message || 'Failed to load users list.';
                        this.notificationService.showNotification(errorMessage, 'error');
                        return of(AdminActions.fetchUsersFailure({ error: error.message }));
                    })
                );
            })
        ),
        { functional: true }
    );

    // Add User
    addUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.addUser),
            mergeMap(({ user }) => {
                return this.adminService.createUser(user).pipe(
                    map((newUser) => AdminActions.addUserSuccess({ user: newUser })),
                    catchError((error) => {
                        const errrorMessage = error?.error?.message || 'Failed to add user.';
                        this.notificationService.showNotification(errrorMessage, 'error');
                        return of(AdminActions.addUserFailure({ error: errrorMessage }))
                    })
                )
            }
            )), { functional: true }
    )


    // Update User
    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.updateUser),
            mergeMap(({ id, user }) => {
                return this.adminService.updateUser(id, user).pipe(
                    map((updatedUser) => AdminActions.updateUserSuccess({ user: updatedUser })),
                    catchError((error) => {
                        const errrorMessage = error?.error?.message || 'Failed to update user.';
                        this.notificationService.showNotification(errrorMessage, 'error');
                        return of(AdminActions.updateUserFailure({ error: errrorMessage }))
                    })
                )
            }
            )), { functional: true }
    )


    // Delete User
    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AdminActions.deleteUser),
            mergeMap(({ id }) => {
                return this.adminService.deleteUser(id).pipe(
                    map(() => AdminActions.deleteUserSuccess({ id })),
                    catchError((error) => {
                        const errrorMessage = error?.error?.message || 'Failed to delete user.';
                        this.notificationService.showNotification(errrorMessage, 'error');
                        return of(AdminActions.updateUserFailure({ error: errrorMessage }))
                    })
                )
            }
            )), { functional: true }
    )

}