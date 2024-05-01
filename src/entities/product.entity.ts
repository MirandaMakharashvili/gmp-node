import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Order } from './order.entity';
import { Cart } from './cart.entity';

@Entity()
export class Product {
    @PrimaryKey()
    productId: string = v4();

    @Property({ type: 'text' })
    title: string;

    @Property({ type: 'text' })
    description: string;

    @Property({ type: 'number' })
    price: number;

    @ManyToOne(() => Order)
    order!: Order;

    @ManyToOne(() => Cart)
    cart!: Cart;

    constructor(title: string, description: string, price: number) {
        this.productId = v4();
        this.title = title;
        this.description = description;
        this.price = price;
    }
}
