import { ProductEntity, product as bookProduct } from '../entities/product.entity'

export interface CartItemEntity {
  product: ProductEntity;
  count: number;
}

export interface CartEntity {
  id: string; // uuid
  userId: string;
  isDeleted: boolean;
  items: CartItemEntity[];
}

const cartItem: CartItemEntity = {
  product: bookProduct,
  count: 2,
}

export const cart: CartEntity = {
  id: '1434fec6-cd85-420d-95c0-eee2301a971d',
  userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
  isDeleted: false,
  items: [cartItem],
}