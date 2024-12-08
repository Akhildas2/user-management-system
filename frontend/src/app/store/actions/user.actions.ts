import { createAction, props } from "@ngrx/store";
import { IUser } from "../../shared/models/userModel";


// Load Users
export const loadUser = createAction('[User] Load User', props<{ id: string }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: IUser }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());
