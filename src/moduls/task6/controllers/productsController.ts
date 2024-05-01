import { Request, Response, NextFunction } from 'express';
import { Product } from '../../../entities/product.entity'; 
import { handleGetProductErrorData, handleProductResData } from '../services/productsService';
import { container } from '../../../init';

/* const em = new EntityManager(); */

export const getProductsList = async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.headers['x-user-id'];

    let products = await container.em.find(Product, { productId: userId });

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

    let simpleProduct = await container.em.findOne(Product, { productId: productId });

    try {
        if (!userId) {
            const errorMessage = handleGetProductErrorData(403);

            return res.status(403).json(errorMessage);
        }

        if (!simpleProduct) {
            return res.status(404).json({ data: null, error: { message: `No product with such ${productId}` } });
        }

        if (simpleProduct) {
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
