import { createFeature, createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/auth.actions';
import { IUser } from '../../shared/models/userModel';

export interface AuthState {
    accessToken: string | null;
    user: IUser | null;
    error: string | null;
    isLoading: boolean;
}

export const initialState: AuthState = {
    accessToken: null,
    user: null,
    error: null,
    isLoading: false
};

export const authFeature = createFeature({
    name: 'auth',
    reducer: createReducer(
        initialState,
        on(AuthActions.login, state => ({
            ...state,
            isLoading: true,
            error: null
        })),
        on(AuthActions.loginSuccess, (state, { accessToken, user }) => ({
            ...state,
            accessToken,
            user,
            isLoading: false,
            error: null
        })),
        on(AuthActions.loginFailure, (state, { error }) => ({
            ...state,
            accessToken: null,
            user: null,
            isLoading: false,
            error
        })),
        on(AuthActions.logout, state => ({
            ...state,
            isLoading: true
        })),
        on(AuthActions.logoutSuccess, () => initialState),
        on(AuthActions.logoutFailure, (state, { error }) => ({
            ...state,
            isLoading: false,
            error
        }))
    )
});