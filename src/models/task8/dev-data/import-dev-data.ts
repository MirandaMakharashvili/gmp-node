import * as dotenv from 'dotenv';
dotenv.config();
/* import fs from 'fs'; */
import mongoose from 'mongoose';
import { User } from '../user-model';
import { Product } from '../product-model';
import { Cart } from '../cart-model';
import { Order } from '../order-model';

/* const fs = require('fs');
 */const path = require('path');

mongoose
    .connect('mongodb://localhost:27017/node_gmp', { useNewUrlParser: true, useUnifiedTopology: true } as any)
    .then(() => console.log('MongoDB connection successful!'))
    .catch((err: Error) => console.log(`Error connecting to MongoDB: ${err.message}`));



/* 
    I am not able to run this file with json
    it is saying Error: ENOENT: no such file or directory
 */

/* const cart = JSON.parse(fs.readFileSync(path.join(__dirname,'cart.json'), 'utf-8'));
const user = JSON.parse(fs.readFileSync(path.join(__dirname,'user.json'), 'utf-8'));
const order = JSON.parse(fs.readFileSync(path.join(__dirname,'order.json'), 'utf-8'));
const product = JSON.parse(fs.readFileSync(path.join(__dirname,'product.json'), 'utf-8'));
 */

/* 
    But when I am adding data directly in compass from this file it works 
    below approache works as well
*/

const cart = [
    {
        id: '1434fec6-cd85-420d-95c0-eee2301a971d',
        userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
        isDeleted: false,
        items: [
            {
                product: {
                    id: '51422fcd-0366-4186-ad5b-c23059b6f64f'
                },
                count: 2,
            },
        ],
    },
];
const user = {
    id: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
};
const order = [
    {
        id: 'dffd6fa8-be6b-47f6-acff-455612620ac2',
        userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
        cartId: '1434fec6-cd85-420d-95c0-eee2301a971d',
        items: [
            {
                product: {
                    id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
                },
                count: 2,
            },
        ],
        payment: {
            type: 'paypal',
            address: null,
            creditCard: null,
        },
        delivery: {
            type: 'post',
            address: null,
        },
        comments: '',
        status: 'created',
        total: 2,
    },
];
const product = [
    {
        id: '51422fcd-0366-4186-ad5b-c23059b6f64f',
        userId: '0fe36d16-49bc-4aab-a227-f84df899a6cb',
        isDeleted: false,
        items: [
            {
                product: {
                    id: '5c293ad0-19d0-41ee-baa3-4c648f9f7697'
                },

                count: 2,
            },
            {
                product: {
                    id: 'afdd68c4-d359-45e6-b9fd-c8fdb2a162a0'
                },

                count: 2,
            },
            {
                product: {
                    id: '21422fcd-0366-4186-ad5b-c23059b6f64f'
                },

                count: 2,
            },
        ],
    }
];


const importData = async () => {
    try {
        await User.create(user);
        await Product.create(product);
        await Cart.create(cart);
        await Order.create(order);        
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();
        await Order.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

/* if (process.argv[2] === '--import') { */
importData();
/* } else if (process.argv[2] === '--delete') {
    deleteData();
} */
