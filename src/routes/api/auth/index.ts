import { Router } from 'express';
import { checkRouter } from './check';
import { loginRouter } from './login';
import { registerRouter } from './register';
import { logoutRouter } from './logout';

export const authRoutes: Router[] = [
    checkRouter,
    loginRouter,
    registerRouter,
    logoutRouter,
];
