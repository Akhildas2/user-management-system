import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducers';

export const selectUserState = createFeatureSelector<UserState>('userState');
export const selectUser = createSelector(selectUserState, (state: UserState) => state.user);
export const selectUserLoading = createSelector(selectUserState, (state: UserState) => state.loading);
export const selectUserError = createSelector(selectUserState, (state: UserState) => state.error);
