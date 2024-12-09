import { createAction, props } from '@ngrx/store';
import { IUser } from '../../shared/models/userModel';

// Login Actions
export const login = createAction('[Auth] Login', props<{ email: string; password: string }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ accessToken: string; user: IUser }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

// Logout Actions
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');
export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

// Register Actions
export const register = createAction('[Auth] Register', props<{ name: string; email: string; phone: number; password: string }>());
export const registerSuccess = createAction('[Auth] Register Success', props<{ accessToken: string; user: IUser }>());
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: string }>());