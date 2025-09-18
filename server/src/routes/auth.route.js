import express from "express";
import { getUser, login, logOut, signUp } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post('/logout', logOut);
router.get('/getUser', protectRoute, getUser);

export default router;