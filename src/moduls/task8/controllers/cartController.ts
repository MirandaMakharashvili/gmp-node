import { Request, Response, NextFunction } from 'express';
import { handleGetErrorData } from '../services/cartService';
import { IUser, User } from '../../../models/task8/user-model';
import { Cart, ICart, ICartItemEntity } from '../../../models/task8/cart-model';
import { IProduct, Product } from '../../../models/task8/product-model';
import { IOrderEntity, ORDER_STATUS, Order } from '../../../models/task8/order-model';

export const getOrCreateCart = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];

    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);
            return res.status(403).json(errorMessage);
        }

        User.findById(userId, async (err: Request, user: IUser) => {
            if (err) {
                console.error(err);
                const errorMessage = handleGetErrorData(500);
                return res.status(500).json(errorMessage);
            }

            if (!user) {
                const errorMessage = handleGetErrorData(403);
                return res.status(403).json(errorMessage);
            }

            if (user.cartId) {
                Cart.findById(user.cartId)
                    .populate('items.product')
                    .then((cart: ICart | null) => {
                        if (err) {
                            console.error(err);
                            const errorMessage = handleGetErrorData(500);
                            return res.status(500).json(errorMessage);
                        }

                        if (!cart || !(cart.items && cart.items.length > 0 && cart.items[0].product)) {
                            const errorMessage = handleGetErrorData(404);
                            return res.status(404).json(errorMessage);
                        }

                        const total = cart.items[0].count * (cart.items[0].product as IProduct).price;

                        const resData = {
                            data: {
                                cart: {
                                    items: cart.items,
                                },
                                total: total,
                            },
                            error: null,
                        };

                        return res.status(200).json(resData);
                    })
                    .catch((err) => {
                        console.error(err);
                        const errorMessage = handleGetErrorData(500);
                        res.status(500).send(errorMessage);
                    });
            }
        });
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }
    next();
};

export const cartUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'];
    const { productId, count } = req.body;
    try {
        if (!userId) {
            const errorMessage = handleGetErrorData(403);
            return res.status(403).json(errorMessage);
        }

        const userCart: ICart | null = await Cart.findOne({ userId: userId });

        if (!userCart) {
            const errorMessage = handleGetErrorData(403);
            return res.status(401).json(errorMessage);
        }

        const itemIndex = userCart.items.findIndex((item: ICartItemEntity) => item?.product?.toString() === productId);
        const product: IProduct | null = await Product.findById(productId);

        if (itemIndex !== -1) {
            userCart.items[itemIndex].count = count;
        } else {
            (userCart.items as any).push({ product: productId, count: count });
        }

        await userCart.save();

        let total = 0;

        if (product) {
            total = userCart.items.reduce((acc, item) => acc + item.count * product.price, 0);
        }

        const resData = {
            data: {
                cart: userCart,
                total: total,
            },
            error: null,
        };

        return res.status(200).json(resData);
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
        if (!userId) {
            const errorMessage = handleGetErrorData(403);

            return res.status(403).json(errorMessage);
        }

        const user: IUser | null = await User.findById(userId);

        if (!user || !user.cartId) {
            return res.status(404).json({ data: null, error: { message: `No items in cart for user ${userId}` } });
        }

        const updatedCart: ICart | null = await Cart.findByIdAndUpdate(
            user.cartId,
            { isDeleted: true }
        ).exec();

        if (!updatedCart) {           
            const errorMessage = handleGetErrorData(404);
            return res.status(500).json(errorMessage);
        }

        return res.status(200).json({ data: { success: true }, error: null });
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
        if (!userId) {
            const errorMessage = handleGetErrorData(403);
            return res.status(403).json(errorMessage);
        }

        const user: IUser | null = await User.findById(userId);

        if (!user || !user.cartId) {
            const errorMessage = handleGetErrorData(403);
            res.status(403).json(errorMessage);
        }

        const cart: ICart | null = await Cart.findById(user?.cartId).populate('items.product');

        if (!cart || !cart.items.length) {
            const errorMessage = handleGetErrorData(403);
            res.status(403).json(errorMessage);
        }
        const newOrder: IOrderEntity = new Order({
            userId: user?._id,
            cartId: cart?._id,
            items: cart?.items,
            delivery: {},
            payment: {},
            comments: {},
            status: ORDER_STATUS.Created,
            total: cart?.items.reduce(
                (acc, item) => acc + (item.product as IProduct).price * item.count, 0
            )
        });

        await newOrder.save();

        const resData = {
            data: {
                order: newOrder,
            },
            error: null,
        };

        return res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetErrorData(500);
        res.status(500).send(errorMessage);
    }
};

module.exports = { getOrCreateCart, cartUpdate, deleteUserCart, makeOrder };
