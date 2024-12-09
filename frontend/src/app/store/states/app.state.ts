import { IUser } from "../../shared/models/userModel";


export interface AuthState {
    accessToken: string | null;
    user: IUser | null;
    error: string | null;
    isLoading: boolean;
}


export interface UserState {
    profile: IUser | null;
    loading: boolean;
    error: string | null;
}

export interface AdminState {
    users: IUser[];
    selectedUser: IUser | null;
    loading: boolean;
    error: string | null;
}