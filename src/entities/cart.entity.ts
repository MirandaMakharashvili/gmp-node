import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { Product } from './product.entity';

@Entity()
export class Cart {
    @PrimaryKey()
    cartId: string = v4();

    @ManyToOne(() => User)
    userId!: string;

    @Property()
    isDeleted = false;

    @OneToMany(() => Product, (product: Product) => product.cart)
    items = new Collection<Product>(this);

    constructor(user: User, items: Product[] = [], isDeleted = false) {
        this.cartId = v4();
        this.userId = user.userId;
        this.isDeleted = isDeleted;
        for (const item of items) {
            this.items.add(item);
        }
    }
}
