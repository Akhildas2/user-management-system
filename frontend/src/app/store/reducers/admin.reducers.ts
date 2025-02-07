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
    on(AdminActions.fetchUsers, (state) => ({ ...state, loading: true, error: null })),
    on(AdminActions.fetchUsersSuccess, (state, { users }) => ({ ...state, users, loading: false, error: null })),
    on(AdminActions.fetchUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
    // Add User
    on(AdminActions.addUser, (state) => ({ ...state, loading: true, error: null })),
    on(AdminActions.addUserSuccess, (state, { user }) => ({ ...state, users: [...state.users, user], loading: false, error: null })),
    on(AdminActions.addUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
    // Update User
    on(AdminActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
    on(AdminActions.updateUserSuccess, (state, { user }) => ({ ...state, user, loading: false, error: null })),
    on(AdminActions.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
    // Delete User
    on(AdminActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
    on(AdminActions.deleteUserSuccess, (state, { id }) => ({ ...state, users: state.users.filter(user => user._id !== id), loading: false, error: null })),
    on(AdminActions.deleteUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
    //Selected User
    on(AdminActions.selectUser, (state, { user }) => ({ ...state, selectedUser: user })),
    on(AdminActions.clearSelectedUser, (state) => ({ ...state, selectedUser: null }))

)