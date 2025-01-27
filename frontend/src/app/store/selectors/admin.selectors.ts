import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AdminState } from "../states/app.state";

// Feature Selector
export const selectAdminState = createFeatureSelector<AdminState>('Admin');


export const selectAllUsers = createSelector(selectAdminState, (state) => state.users)
export const selectAdminLoading = createSelector(selectAdminState, (state) => state.loading)
export const selectAdminError = createSelector(selectAdminState, (state) => state.error)
export const selectSelectedUser = createSelector(selectAdminState, (state: AdminState) => state.selectedUser)