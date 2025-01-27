import { createReducer, on } from "@ngrx/store";
import { AdminState } from "../states/app.state";
import * as AdminActions from '../actions/admin.actions';

export const initialState: AdminState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
};

export const adminReducer = createReducer(
    initialState,

    // Fetch Users
    on(AdminActions.fetchUsers, (state) => ({ ...state, loading: true })),
    on(AdminActions.fetchUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
    on(AdminActions.fetchUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
    // Add User
    on(AdminActions.addUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], })),
    // Update User
    on(AdminActions.updateUserSuccess, (state, { user }) => ({
        ...state,
        users: state.users.map((u) => (u._id === user._id ? user : u)),
    })),
    // Delete User
    on(AdminActions.deleteUserSuccess, (state, { id }) => ({
        ...state,
        users: state.users.filter((user) => user._id !== id),
    })),
    //Selected User
    on(AdminActions.selectUser, (state, { user }) => ({
        ...state,
        selectedUser: user,
    })),
    on(AdminActions.clearSelectedUser, (state) => ({ ...state, selectedUser: null }))

)