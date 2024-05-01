import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
    id: string;
    cartId?: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    id: {
        type: String,
        required: true,
        validate: {
            validator: function (v: string) {
                return v.match(
                    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/i,
                );
            },
            message: (props) => `${props.value} is not a valid UUID v4!`,
        },
    },
    cartId: Schema.Types.ObjectId,
});

const User = mongoose.model<IUser>('User', userSchema);

export { IUser, User };
