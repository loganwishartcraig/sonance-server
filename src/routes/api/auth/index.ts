import { Router } from 'express';
import { checkRouter } from './check';
import { loginRouter } from './login';
import { registerRouter } from './register';

export const authRoutes: Router[] = [
    checkRouter,
    loginRouter,
    registerRouter,
];
