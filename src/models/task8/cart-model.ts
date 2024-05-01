import mongoose, { Document, ObjectId, Schema, Types } from 'mongoose';
import { IProduct } from './product-model';

interface ICartItemEntity extends Document {
    product: IProduct | ObjectId;
    count: number;
}

interface ICart extends Document {
    id: string;
    userId: { type: Schema.Types.ObjectId; ref: 'User' };
    isDeleted: boolean;
    items: ICartItemEntity[];
}

const CartItemSchema = new Schema<ICartItemEntity>({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    count: Number,
});

const CartSchema = new Schema<ICart>({
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
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: Boolean,
    items: [CartItemSchema],
});

const Cart = mongoose.model<ICart>('Cart', CartSchema);

export { ICartItemEntity, ICart, Cart, CartItemSchema };
