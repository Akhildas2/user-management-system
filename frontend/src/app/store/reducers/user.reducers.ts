import { createReducer, on } from "@ngrx/store";
import { IUser } from "../../shared/models/userModel";
import * as UserActions from '../actions/user.actions'

export interface UserState {
    user: IUser | null;
    loading: boolean;
    error: string | null;
}

export const initialstate: UserState = {
    user: null,
    loading: false,
    error: null
};

export const userReducer = createReducer(
    initialstate,
    on(UserActions.loadUser, state => ({ ...state, loading: true })),
    on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, user, loading: false })),
    on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, loading: false, error }))
)