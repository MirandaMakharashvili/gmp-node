import type { EntityManager } from '@mikro-orm/sqlite';
import { Seeder } from '@mikro-orm/seeder';
import { User } from 'src/entities/user.entity';
import { Cart } from 'src/entities/cart.entity';
import { product } from 'src/models/task7/product.model';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';

export class ProjectSeeder extends Seeder {
    async run(em: EntityManager): Promise<void> {
        const user = em.create(User, {
            userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
        });

        const cart = em.create(Cart, {
            cartId: '1434fec6-cd85-420d-95c0-eee2301a971d',
            userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
            isDeleted: false,
            items: [],
        });

        const order = em.create(Order, {
            orderId: 'dffd6fa8-be6b-47f6-acff-455612620ac2',
            userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
            cartId: '',
            items: [],
            payment: {
                type: 'paypal',
                address: undefined,
                creditCard: undefined,
            },
            delivery: {
                type: 'post',
                address: undefined,
            },
            comments: '',
            status: 'created',
            total: 2,
        });
    }
}
