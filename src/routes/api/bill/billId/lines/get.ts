import { Router, Request, Response } from 'express';

const router = Router();

router.get(
    '/',
    (req: Request, res: Response) => {
        res.sendStatus(204);
    }

);

export { router as getAllLinesRouter };
