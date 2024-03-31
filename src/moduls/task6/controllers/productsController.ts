import { Request, Response, NextFunction } from 'express';
import { PRODUCTS } from '../../../models/task6/dev-data/products';
import { handleGetProductErrorData, handleProductResData } from '../services/productsService';

export const getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];

    let products = PRODUCTS.filter((product) => product.userId === userId).flatMap((product) =>
        product.items.map((item) => item.product),
    );

    try {
        if (!userId) {
            const errorMessage = handleGetProductErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (!products) {
            return res.status(404).json({ data: null, error: { message: `No products For user ${userId}` } });
        }

        if (products) {
            const resData = handleProductResData(products);

            return res.status(200).json(resData);
        }

        if (userId && !products) {
            const errorMessage = handleGetProductErrorData(403);
            res.status(401).json(errorMessage);
        }
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

    let products = PRODUCTS.filter((product) => product.userId === userId).flatMap((product) =>
        product.items.map((item) => item.product),
    );

    let simpleProduct = products.find((product) => product.id === productId);

    try {
        if (!userId) {
            const errorMessage = handleGetProductErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (!simpleProduct) {
            return res.status(404).json({ data: null, error: { message: `No product with such ${productId}` } });
        }

        if (products) {
            const resData = handleProductResData([simpleProduct]);

            return res.status(200).json(resData);
        }

        if (userId && !simpleProduct) {
            const errorMessage = handleGetProductErrorData(403);
            res.status(401).json(errorMessage);
        }
    } catch (err) {
        console.error(err);
        const errorMessage = handleGetProductErrorData(500);
        res.status(500).send(errorMessage);
    }
    next();
};

module.exports = { getProductsList, getProductById };
