import { getOrCreateCart, cartUpdate, deleteUserCart, makeOrder } from '../controllers/cartController';


const express = require('express');

const router = express.Router();

//Simple authentication middleware is added to check if user with such id exists
//router.get('/cart', userExists, getOrCreateCart); 

router.get('/cart', getOrCreateCart);
router.put('/cart', cartUpdate);
router.delete('/cart', deleteUserCart);
router.post('/cart/checkout', makeOrder);

module.exports = router;
