import express from "express";

import { requireSignin } from "../middlewares/auth.js";
import { getOrder } from "../controllers/order.js";


const router = express.Router();

router.get('/orders', requireSignin, getOrder);


export default router;