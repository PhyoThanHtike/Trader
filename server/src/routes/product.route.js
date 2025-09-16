import express from "express";
import { addProduct, getAllProducts, getProductById } from "../controllers/product.controller.js";

const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/getProductById/:productId", getProductById);

export default router;