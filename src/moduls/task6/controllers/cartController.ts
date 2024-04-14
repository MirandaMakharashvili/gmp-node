import { Request, Response, NextFunction } from 'express';
import { CART } from '../../../models/task6/dev-data/cart';
import { handleGetErrorData, handleResData, validateCartRequestBody } from '../services/cartService';
import { ORDER } from '../../../models/task6/dev-data/order';

export const getOrCreateCart = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];
    let cartItem = CART.find((cart) => cart.userId === userId);

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (cartItem) {
            const resData = handleResData(cartItem);

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
    let cartItem = CART.find((cart) => cart.userId === userId);

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (cartItem) {
            const id = cartItem.id;
            const updatedItems = cartItem.items.map((productItem) => {
                if (productItem.product.id === productId) {
                    return {
                        id: id,
                        userId: userId,
                        isDeleted: false,
                        items: [
                            {
                                ...productItem,
                                count: count,
                            },
                        ],
                    };
                }
            });

            const resData = {
                data: {
                    cart: {
                        id: updatedItems[0]?.id,
                        items: updatedItems[0]?.items,
                    },
                    total: updatedItems[0]?.items[0].count * cartItem.items[0].product.price,
                },
                error: null,
            };

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

export const deleteUserCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.get('x-user-id');
    let cartItem = CART.find((cart) => cart.userId === userId);

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (!cartItem) {
            return res.status(404).json({ data: null, error: { message: `No items in cart For user ${userId}` } });
        }

        if (cartItem) {
            //Made this version as well
            /* let index = CART.findIndex((item) => item.id === cartItem?.id);
            index !== -1 && CART.splice(index, 1); */
            cartItem.isDeleted = true;

            return res.status(200).json({ data: { success: true }, error: null });
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

export const makeOrder = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.get('x-user-id');
    let cartItem = CART.find((cart) => cart.userId === userId);
    let orderItem = ORDER.find((order) => order.userId === userId);

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (cartItem && orderItem) {
            const data ={
                data: {
                  order: {
                    id: cartItem.id,
                    userId: cartItem.userId,
                    cartId: orderItem.cartId,
                    items: cartItem.items,
                    payment: {
                      type: orderItem.payment.type,
                      address: orderItem.payment.address,
                      creditCard: orderItem.payment.creditCard
                    },
                    delivery: {
                      type: orderItem.delivery.type,
                      address: orderItem.delivery.address
                    },
                    comments: orderItem.comments,
                    status: orderItem.status,
                    total: cartItem.items[0].count * cartItem.items[0].product.price
                  }
                },
                error: null
              }

            return res.status(200).json(data);
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
};

module.exports = { getOrCreateCart, cartUpdate, deleteUserCart, makeOrder };
