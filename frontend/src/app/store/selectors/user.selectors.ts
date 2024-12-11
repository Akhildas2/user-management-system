import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../states/app.state';

export const selectUserState = createFeatureSelector<UserState>('User');

export const selectUserProfile = createSelector(selectUserState, (state) => state.profile);
export const selectUserLoading = createSelector(selectUserState, (state) => state.loading);
export const selectUserError = createSelector(selectUserState, (state) => state.error);
