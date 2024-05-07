import { IUser, UserAuth } from '../../../models/task9/user-model';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import { promisify } from 'util';
dotenv.config();

interface CookieOptions {
    expires: Date;
    httpOnly: boolean;
    secure?: boolean;
}

const jwt = require('jsonwebtoken');

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
    const token = signToken(user._id);
    const JWT_COOKIE_EXPIRES_IN = parseInt(process.env.JWT_COOKIE_EXPIRES_IN!);

    if (isNaN(JWT_COOKIE_EXPIRES_IN)) {
        throw new Error('JWT_COOKIE_EXPIRES_IN must be a number');
    }

    const cookieOptions: CookieOptions = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000),
        httpOnly: true,
    };
    
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',        
        data: {
            user: user.email,
            role: user.role,
        },
        message: 'Hi there'
    });
};

export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await UserAuth.create({        
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });
    
    createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    
    const user:IUser = await UserAuth.findOne({ email }).select('+password');

    if (user && !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    console.log(user)
    createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await UserAuth.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    req.body.user = currentUser;
    next();
});

//to us for rule: Only admin users can delete user cart.
export const restrictTo = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        if (!roles.includes(req.body.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }

        next();
    };
};

export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await UserAuth.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId: string = req.get('x-user-id') as string;
    const user = await UserAuth.findById(userId).select('+password');
    
    if(!user){
        return next(new AppError('User does not exists.', 401));
    }

    if (user && !(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    
    createSendToken(user, 200, res);
});
