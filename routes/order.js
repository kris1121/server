import express from "express";

import { requireSignin, isAdmin } from "../middlewares/auth.js";
import { getOrder, getAllOrders, updateOrderStatus } from "../controllers/order.js";


const router = express.Router();

router.get('/orders', requireSignin, getOrder);
router.get('/all-orders', requireSignin, isAdmin, getAllOrders);
router.put('/order-status/:orderId', requireSignin, isAdmin, updateOrderStatus);


export default router;