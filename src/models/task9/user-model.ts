import mongoose, { Document, Query, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface IUser extends Document {
    email: string;
    role: string;
    password?: string;
    passwordConfirm?: string;
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    correctPassword: (candidatePassword: string, userPassword?: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: number) => boolean;
    createPasswordResetToken: () => Promise<string>;
    active: boolean;
}

interface IUserModel {
    passwordConfirm?: any;
    password?: any;
}

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email'],
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                validator: function (this: IUser, el: string): boolean {
                    return el === this.password;
                },
                message: 'Passwords are not the same!',
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = this.password && await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});

userSchema.pre<Query<any, IUser>>(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    this: IUser,
    candidatePassword: string,
    userPassword: string,
): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (this: IUser, JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString());

        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const UserAuth = mongoose.model<IUser & IUserModel>('UserAuth', userSchema);

export { IUser, UserAuth };
