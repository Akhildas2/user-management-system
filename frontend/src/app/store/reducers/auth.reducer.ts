import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';

export interface AuthState {
    accessToken: string | null;
    user: any | null;
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
        }))
    )
});