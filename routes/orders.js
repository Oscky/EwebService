import express from 'express';


import { getOrders, createOrder, getOrder} from '../controllers/orders.js';


const router = express.Router();

router.get('/', getOrders);

router.post('/', createOrder);

router.get('/:_id', getOrder);

export default router;