import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../core/services/user/user.service";
import * as UserActions from '../actions/user.actions'
import { catchError, mergeMap, of, map } from "rxjs";

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService) { }

    loadUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUser),
            mergeMap(action =>
                this.userService.getUserById(action.id).pipe(
                    map(user => UserActions.loadUserSuccess({ user })),
                    catchError(error => of(UserActions.loadUserFailure({ error: error.message })))
                )
            )
        )
    );
}