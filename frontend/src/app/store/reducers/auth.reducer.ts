import { createReducer, on } from '@ngrx/store';
import { login, loginSuccess, loginFailure } from '../actions/auth.actions';

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    error: string | null;
}

export const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    error: null,
};

export const authReducer = createReducer(
    initialState,
    on(login, state => ({ ...state, error: null })),
    on(loginSuccess, (state, { accessToken, refreshToken }) => ({
        ...state,
        accessToken,
        refreshToken,
    })),
    on(loginFailure, (state, { error }) => ({ ...state, error }))
);
