import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../states/app.state';

export const selectAuthState = createFeatureSelector<AuthState>('Auth');

export const selectAccessToken = createSelector(selectAuthState, state => state.accessToken);
export const selectAuthError = createSelector(selectAuthState, state => state.error);
export const selectIsLoading = createSelector(selectAuthState, state => state.isLoading);
export const selectCurrentUser = createSelector(selectAuthState, (state) => state.user);
export const selectCurrentUserId = createSelector(selectCurrentUser, (user) => user ? user.id : undefined);