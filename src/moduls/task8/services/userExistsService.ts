import { Request, Response, NextFunction } from 'express';

export function userExists(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(400).json({ error: { message: 'User doesn not exists' } });
    }

    next();
}
