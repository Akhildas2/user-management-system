import { createActionGroup, props } from '@ngrx/store';

export const AuthActions = createActionGroup({
    source: 'Auth',
    events: {
        'Login': props<{ email: string; password: string }>(),
        'Login Success': props<{ accessToken: string; user: any }>(),
        'Login Failure': props<{ error: string }>()
    }
});