export interface IUser {
    _id?: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    photo?: String,
    dob?: Date,
    gender?: string,
    skills?: String,
    position?: string,
    profileImage?: string,
    isAdmin?: boolean,
    isBlocked?: boolean;
    isVerified?: boolean;
    [key: string]: any;
}
