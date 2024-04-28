import { Request, Response, NextFunction } from 'express';
import { handleGetProductErrorData, handleProductResData } from '../services/productsService';
import { IUser, User } from '../../../models/task8/user-model';
import { Cart, ICart } from '../../../models/task8/cart-model';
import { IProduct, Product } from '../../../models/task8/product-model';

export const getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];
    try {
        if (!userId) {
            const errorMessage = handleGetProductErrorData(403);
            return res.status(403).json(errorMessage);
        }

        const user: IUser | null = await User.findById(userId);

        if (!user || !user.cartId) {
            const errorMessage = handleGetProductErrorData(403);
            return res.status(403).json(errorMessage);
        }

        const cart: ICart | null = await Cart.findById(user.cartId).populate('items.product');

        if (!cart || !cart.items.length) {
            const errorMessage = handleGetProductErrorData(404);
            return res.status(404).json(errorMessage);
        }

        const products: IProduct[] = cart.items.map((item) => item.product as IProduct);

        const resData = handleProductResData(products);

        return res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetProductErrorData(500);
        res.status(500).send(errorMessage);
    }
    next();
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];
    const productId = req.params.productId;
    
    try {
        if (!userId) {
            const errorMessage = handleGetProductErrorData(403);
            return res.status(403).json(errorMessage);
        }

        const product: IProduct | null = await Product.findById(productId).exec();

        if (!product) {
            return res.status(404).json({ data: null, error: { message: `No product with an id of ${productId}` } });
        }

        const resData = handleProductResData([product]);

        return res.status(200).json(resData);
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetProductErrorData(500);
        res.status(500).send(errorMessage);
    }
    next();
};

module.exports = { getProductsList, getProductById };
