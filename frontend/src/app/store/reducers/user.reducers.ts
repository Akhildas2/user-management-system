import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { UserState } from '../states/app.state';

export const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  // Get Profile
  on(UserActions.getProfile, state => ({ ...state, loading: true, error: null })),
  on(UserActions.getProfileSuccess, (state, { user }) => ({ ...state, profile: user, loading: false, error: null })),
  on(UserActions.getProfileFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Edit Profile
  on(UserActions.editProfile, state => ({ ...state, loading: true, error: null })),
  on(UserActions.editProfileSuccess, (state, { user }) => ({ ...state, profile: { ...state.profile, ...user }, loading: false, error: null })),
  on(UserActions.editProfileFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Delete Profile
  on(UserActions.deleteProfile, state => ({ ...state, loading: true, error: null })),
  on(UserActions.deleteProfileSuccess, () => ({ ...initialState })),
  on(UserActions.deleteProfileFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Upload Photo
  on(UserActions.updateProfileImage, state => ({ ...state, loading: true, error: null })),
  on(UserActions.updateProfileImageSuccess, (state, { user }) => ({ ...state, profile: { ...state.profile, ...user }, loading: false, error: null })),
  on(UserActions.updateProfileImageFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
