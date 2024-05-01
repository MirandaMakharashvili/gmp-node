import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Cart } from './cart.entity';
import { Order } from './order.entity';

@Entity()
export class User {
    @PrimaryKey()
    userId: string = v4();

    @OneToMany(() => Cart, (cart) => cart.user)
    carts = new Collection<Cart>(this);

    @OneToMany(() => Order, (order) => order.user)
    orders = new Collection<Order>(this);

    constructor() {
        this.userId = v4();
    }
}
