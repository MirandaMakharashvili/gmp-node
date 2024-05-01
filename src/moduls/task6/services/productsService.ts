import { ProductEntity } from "../../../models/task7/product.model";

export function handleProductResData(pruducts: ProductEntity[]) {
    const data = {
        data: pruducts,
        error: null,
    };

    return data;
}

export function handleGetProductErrorData(code: number) {
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
