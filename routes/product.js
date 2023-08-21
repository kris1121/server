import express from "express";
import formidable from "express-formidable";

//middlewares
import { requireSignin, isAdmin } from "../middlewares/auth.js";
//controllers
import { create } from "../controllers/product.js"

const router = express.Router();

router.post('/product', requireSignin, isAdmin, formidable(), create);


export default router;