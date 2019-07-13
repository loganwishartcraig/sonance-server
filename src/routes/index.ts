import { Express } from 'express';
import { registerApiRoutes } from './api';
import { registerResourceRoutes } from './resources';

export const registerRoutes = (app: Express) => {
    registerApiRoutes(app);
    registerResourceRoutes(app);
};
