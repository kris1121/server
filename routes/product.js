import express from "express";
import formidable from "express-formidable";

//middlewares
import { requireSignin, isAdmin } from "../middlewares/auth.js";
//controllers
import { 
  create, 
  list, 
  read, 
  photo, 
  remove, 
  update, 
  filteredProducts,
  productsCount,
  listProducts,
  productsSearch,
  relatedProducts,
  getBraintreeToken,
  processPayment
} from "../controllers/product.js"

const router = express.Router();

router.post('/product', requireSignin, isAdmin, formidable(), create);
router.get('/products', list);
router.get('/product/:slug', read);
router.get('/product/photo/:productId', photo);
router.delete('/product/:productId', requireSignin, isAdmin, remove);
router.put('/product/:productId', requireSignin, isAdmin, formidable(), update)
router.post('/filtered-products', filteredProducts);
router.get('/products-count', productsCount);
router.get('/list-products/:page', listProducts);
router.get('/products/search/:keyword', productsSearch);
router.get('/related-products/:productId/:categoryId', relatedProducts);

router.get('/braintree/token', getBraintreeToken);
router.post('/braintree/payment', requireSignin, processPayment);

export default router;