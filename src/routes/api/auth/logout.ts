import { Router } from 'express';
import passport = require('passport');

const router = Router();

router.post(
    '/logout',
    (req, res) => {
        req.logout();
        return res.sendStatus(204);
    }
);

export { router as logoutRouter };
