import express from "express";
import { addProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getAllProducts", protectRoute, getAllProducts);
router.get("/getProductById/:productId", protectRoute, getProductById);

export default router;