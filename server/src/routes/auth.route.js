import express from "express";
import { checkUser, login, logOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post('/logout', logOut);
router.get('/checkUser', protectRoute, checkUser);

export default router;