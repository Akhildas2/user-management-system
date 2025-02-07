import { createAction, props } from '@ngrx/store';
import { IUser } from '../../shared/models/userModel';

// Fetch All Users
export const fetchUsers = createAction('[Admin] Fetch Users');
export const fetchUsersSuccess = createAction('[Admin] Fetch Users Success', props<{ users: IUser[] }>());
export const fetchUsersFailure = createAction('[Admin] Fetch Users Failure', props<{ error: string }>());

// Add New User
export const addUser = createAction('[Admin] Add User', props<{ user: FormData }>());
export const addUserSuccess = createAction('[Admin] Add User Success', props<{ user: IUser }>());
export const addUserFailure = createAction('[Admin] Add User Failure', props<{ error: string }>());

// Update User
export const updateUser = createAction('[Admin] Update User', props<{ user: FormData }>());
export const updateUserSuccess = createAction('[Admin] Update User Success', props<{ user: IUser }>());
export const updateUserFailure = createAction('[Admin] Update User Failure', props<{ error: string }>());

// Delete User
export const deleteUser = createAction('[Admin] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[Admin] Delete User Success', props<{ id: string }>());
export const deleteUserFailure = createAction('[Admin] Delete User Failure', props<{ error: string }>());

// Select User
export const selectUser = createAction('[Admin] Select User', props<{ user: IUser }>());
export const clearSelectedUser = createAction('[Admin] Clear Selected User');
