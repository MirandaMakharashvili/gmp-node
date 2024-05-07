import { IUser, UserAuth } from '../../../models/task9/user-model';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import { Request, Response, NextFunction } from 'express';

const filterObj = (obj: IUser, ...allowedFields: Array<keyof IUser>) => {
    const newObj: Partial<IUser> = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el as keyof IUser)) newObj[el as keyof IUser] = obj[el as keyof IUser];
    });
    return newObj;
};

export const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserAuth.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
});

export const updateMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates', 400));
    }

    const filteredBody = filterObj(req.body, 'email', 'role');
    const userId: string = req.get('x-user-id') as string;

    const updatedUser = await UserAuth.findByIdAndUpdate(userId, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
});

export const deleteMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.get('x-user-id') as string;

    await UserAuth.findByIdAndUpdate(userId, { active: false });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const getUser = (req: Request, res: Response) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

export const createUser = (req: Request, res: Response) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

export const updateUser = (req: Request, res: Response) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

export const deleteUser = (req: Request, res: Response) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};
