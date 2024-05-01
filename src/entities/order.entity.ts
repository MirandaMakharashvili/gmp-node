import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, Collection } from "@mikro-orm/core";
import { v4 } from 'uuid';
import { User } from './user.entity'; 
import { Product } from './product.entity'; 
import { Cart } from './cart.entity'; 

@Entity()
export class Order {
  @PrimaryKey()
  orderId: string = v4();

  @ManyToOne(() => User)
  userId!: string;

  @ManyToOne(() => Cart)
  cartId!: string;

  @OneToMany(() => Product, product => product.order)
  items = new Collection<Product>(this);

  @Property()
  payment!: {
    type: string,
    address?: any,
    creditCard?: any,
  };

  @Property()
  delivery!: {
    type: string,
    address: any,
  };

  @Property()
  comments!: string;

  @Property()
  status!: string;

  @Property()
  total!: number;

  constructor(user: User, cart: Cart, items: Product[] = []) {
    this.orderId = v4();
    this.userId = user.userId;
    this.cartId = cart.cartId;
    for (const item of items) {
      this.items.add(item);
    }
  }
}