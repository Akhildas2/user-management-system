import { createAction, props } from '@ngrx/store';
import { IUser } from '../../shared/models/userModel';

// Get User
export const getProfile = createAction('[User] Get Profile');
export const getProfileSuccess = createAction('[User] Get Profile Success', props<{ user: IUser }>());
export const getProfileFailure = createAction('[User] Get Profile Failure', props<{ error: string }>());

// Edit User
export const editProfile = createAction('[User] Edit Profile', props<{ user: Partial<IUser> }>());
export const editProfileSuccess = createAction('[User] Edit Profile Success', props<{ user: IUser }>());
export const editProfileFailure = createAction('[User] Edit Profile Failure', props<{ error: string }>());

// Delete User
export const deleteProfile = createAction('[User] Delete Profile', props<{ id: string }>());
export const deleteProfileSuccess = createAction('[User] Delete Profile Success');
export const deleteProfileFailure = createAction('[User] Delete Profile Failure', props<{ error: string }>());
