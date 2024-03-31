import { getProductsList, getProductById } from '../controllers/productsController';


const express = require('express');

const router = express.Router();


router.get('/', getProductsList);
router.get('/:productId', getProductById);


module.exports = router;
