import { authFeature } from '../reducers/auth.reducer';

export const selectAuthState = authFeature.selectAuthState;
export const selectAccessToken = authFeature.selectAccessToken;
export const selectAuthError = authFeature.selectError;
export const selectUser = authFeature.selectUser;
export const selectIsLoading = authFeature.selectIsLoading;