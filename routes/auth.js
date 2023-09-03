import express from "express";

import { register, login, secret, updateProfile} from "../controllers/auth.js";
import { requireSignin, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get('/auth-check', requireSignin, (req, res) => {
  res.json({ ok: true });
});
router.get("/admin-check", requireSignin, isAdmin, (req, res) => {
  res.json({ok: true});
});

router.put('/profile', requireSignin, updateProfile);

//test
router.get("/secret", requireSignin, isAdmin, secret)

export default router;