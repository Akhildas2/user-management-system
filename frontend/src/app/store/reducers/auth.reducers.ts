import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { IUser } from '../../shared/models/userModel';
import { AuthState } from '../states/app.state';

export const initialState: AuthState = {
    accessToken: null,
    user: null,
    error: null,
    isLoading: false
};


export const authReducer = createReducer(
    initialState,

    // Login Reducers
    on(AuthActions.login, state => ({ ...state, isLoading: true, error: null })),
    on(AuthActions.loginSuccess, (state, { accessToken, user }) => ({ ...state, accessToken, user, isLoading: false, error: null })),
    on(AuthActions.loginFailure, (state, { error }) => ({ ...state, accessToken: null, user: null, isLoading: false, error })),

    // Logout Reducers
    on(AuthActions.logout, state => ({ ...state, isLoading: true })),
    on(AuthActions.logoutSuccess, () => initialState),
    on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

    //Register Reducers
    on(AuthActions.register, state => ({ ...state, isLoading: true, error: null })),
    on(AuthActions.registerSuccess, (state, { accessToken, user }) => ({ ...state, accessToken, user, isLoading: false, error: null })),
    on(AuthActions.registerFailure, (state, { error }) => ({ ...state, accessToken: null, user: null, isLoading: false, error }))

);