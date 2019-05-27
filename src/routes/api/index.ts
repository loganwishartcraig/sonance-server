import { Express } from 'express';
import { authRoutes } from './auth';
import { billRoutes } from './bill';

const BASE_API_ROUTE: string = '/api/1';

export const registerApiRoutes = (app: Express) => {

    // Enable CORS for development.
    if (process.env.NODE_ENV === 'development') {

        const devServerOrigin = 'https://localhost:8080';

        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', devServerOrigin);
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Max-Age', (24 * 60 * 60).toString());
            next();
        });

        app.options('/*', (req, res, next) => {
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
            res.header(
                'Access-Control-Allow-Headers',
                'Content-Type, Authorization, Content-Length, X-Requested-With'
            );
            res.sendStatus(200);
        });

    }

    app.use(`${BASE_API_ROUTE}/auth`, authRoutes);
    app.use(`${BASE_API_ROUTE}/bill`, billRoutes);

};
