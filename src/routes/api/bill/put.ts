import { Request, Response, Router } from 'express';
import { check } from 'express-validator';
import { validationController } from '@controllers';

const router = Router();

const validation = [
    check('id', 'Invalid ID included').isMongoId(),
];

router.put(
    '/',
    validation,
    validationController.ensureNoErrors,
    (req: Request, res: Response) => {
        console.warn(req.body);
        return res.sendStatus(500);
    }
);

export { router as rootPutRouter };
