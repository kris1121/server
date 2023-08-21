import express from "express";

import { register, login, secret} from "../controllers/auth.js";
import { requireSignin, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//test
router.get("/secret", requireSignin, isAdmin, secret)

export default router;