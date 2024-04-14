import Joi from 'joi';
import { CartEntity, CartItemEntity } from '../../../models/task6/schemas/cart.entity';

export function handleResData(cartItem: CartEntity) {
    const data = {
        data: {
            cart: {
                id: cartItem?.id,
                items: cartItem?.items,
            },
            total: cartItem.items[0].product.price * cartItem.items[0].count,
        },
        error: null,
    };

    return data;
}

export function handleGetErrorData(code: number) {
    const message =
        code === 403
            ? 'You must be authorized user'
            : code === 401
            ? 'User is not authorized'
            : 'Internal Server Error';
    const data = {
        data: null,
        error: {
            message: message,
        },
    };

    return data;
}

export function validateCartRequestBody(data: CartItemEntity) {
    const schema = Joi.object({
        productId: Joi.string().required(),
        count: Joi.number().required(),
    });

    return schema.validate(data);
}
