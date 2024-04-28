import mongoose, { Document, Schema } from 'mongoose';
import { CartItemSchema, ICartItemEntity } from './cart-model';

enum ORDER_STATUS {
    Created = 'created',
    Completed = 'completed',
}

interface IOrderEntity extends Document {
    id: string;
    userId: { type: Schema.Types.ObjectId; ref: 'User' };
    cartId: { type: Schema.Types.ObjectId; ref: 'Cart' };
    items: ICartItemEntity[];
    payment: {
        type: string;
        address?: any;
        creditCard?: any;
    };
    delivery: {
        type: string;
        address: any;
    };
    comments: string;
    status: ORDER_STATUS;
    total: number;
}

const OrderSchema = new Schema<IOrderEntity>({
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
    cartId: String,
    items: [CartItemSchema],
    payment: {
        type: {
            type: String,
            required: true,
        },
        address: Schema.Types.Mixed,
        creditCard: Schema.Types.Mixed,
    },
    delivery: {
        type: {
            type: String,
            required: true,
        },
        address: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    comments: String,
    status: {
        type: String,
        enum: ORDER_STATUS,
        default: ORDER_STATUS.Created,
    },
    total: Number,
});

const Order = mongoose.model<IOrderEntity>('Order', OrderSchema);

export { ORDER_STATUS, IOrderEntity, Order };
