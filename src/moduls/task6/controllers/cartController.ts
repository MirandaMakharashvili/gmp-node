import { Request, Response, NextFunction } from 'express';
import { handleGetErrorData, handleResData, validateCartRequestBody } from '../services/cartService';
import { container } from '../../../init';
import { Cart } from '../../../entities/cart.entity';
import { CartEntity } from '../../../models/task7/cart.model';
import { Order } from '../../../entities/order.entity';

export const getOrCreateCart = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];
    /* let cartItem = CART.find((cart) => cart.userId === userId); */

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        const cartItem = await container.em.findOne(Cart, { userId: userId});

        if (cartItem) {
            const resData = cartItem;

            return res.status(200).json(resData);
        }

        if (userId && !cartItem) {
            const errorMessage = handleGetErrorData(403);
            res.status(401).json(errorMessage);
        }
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }
    next();
};

//TODO: simplfy cartUpdate code
export const cartUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const { error } = validateCartRequestBody(req.body);
    const { productId, count } = req.body;

    if (error) return res.status(400).send({ data: null, error: { message: 'Products are not valid' } });

    const userId = req.headers['x-user-id'];

    try {
        const cartRepo = container.em.getRepository(Cart);
        let cart = await cartRepo.findOne({userId: userId});

        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (cart) {
            const productItem = cart.items.getItems().find((item) => item.productId == productId);
            if (productItem) {                
                productItem.cart.items.count = count;
                await container.em.persistAndFlush(cart);

                
                const resData = {
                    data: {
                        cart: cart,
                        total: cart.items.getItems().reduce((sum, curr) => sum + count * curr.price, 0),
                    },
                    error: null,
                };
                return res.status(200).json(resData);
            }
        }

        if (userId && !cart) {
            const errorMessage = handleGetErrorData(403);
            res.status(401).json(errorMessage);
        }
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }

    next();
};

export const deleteUserCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.get('x-user-id');

    try {
        const cartRepo = container.em.getRepository(Cart);

        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        const cart = await cartRepo.findOne({userId: userId});

        if (!cart) {
            return res.status(404).json({ data: null, error: { message: `No items in cart For user ${userId}` } });
        }

        if (cart) {
            cart.isDeleted = true;

            await container.em.persistAndFlush(cart);

            return res.status(200).json({ data: { success: true }, error: null });
        }

        if (userId && !cart) {
            const errorMessage = handleGetErrorData(403);
            res.status(401).json(errorMessage);
        }
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }

    next();
};

export const makeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.get('x-user-id');

    try {

        const cartRepo = container.em.getRepository(Cart);
        const orderRepo = container.em.getRepository(Order);

        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        const cart = await cartRepo.findOne({ userId: userId});
        const order = await orderRepo.findOne({ userId: userId });

        if (cart && order) {
            const data = {
                data: {
                    order: {
                        id: cart.cartId,
                        userId: cart.userId,
                        cartId: order.cartId,
                        items: cart.items,
                        payment: {
                            type: order.payment.type,
                            address: order.payment.address,
                            creditCard: order.payment.creditCard,
                        },
                        delivery: {
                            type: order.delivery.type,
                            address: order.delivery.address,
                        },
                        comments: order.comments,
                        status: order.status,
                        total: order.items.count,
                    },
                },
                error: null,
            };

            return res.status(200).json(data);
        }

        if (userId && !cart) {
            const errorMessage = handleGetErrorData(403);
            res.status(401).json(errorMessage);
        }
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }
};

module.exports = { getOrCreateCart, cartUpdate, deleteUserCart, makeOrder };
