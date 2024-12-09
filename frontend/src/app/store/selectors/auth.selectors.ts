import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../states/app.state';

export const selectAuthState = createFeatureSelector<AuthState>('Auth');
export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectCurrentUserId  = createSelector(selectAuthState, state => state.user?.id);
export const selectIsLoading = createSelector(selectAuthState, state => state.isLoading);
