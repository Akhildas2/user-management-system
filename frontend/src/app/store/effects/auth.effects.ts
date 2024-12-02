import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../core/services/auth/auth.service';
import { login, loginSuccess, loginFailure } from '../actions/auth.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    constructor(private actions$: Actions, private authService: AuthService) { }

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(login),
            switchMap(action =>
                this.authService.login(action.email, action.password).pipe(
                    map(response => loginSuccess({ accessToken: response.accessToken, refreshToken: response.refreshToken })),
                    catchError(error => of(loginFailure({ error: error.message })))
                )
            )
        )
    );
}
