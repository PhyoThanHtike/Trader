import express from 'express';
import { cancelOrder, deleteOrder, getUserOrders, placeOrder } from '../controllers/order.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/placeOrder", protectRoute, placeOrder);
router.get("/getUserOrders", protectRoute, getUserOrders);
router.put("/cancelOrder", protectRoute, cancelOrder);
router.delete("/deleteOrder/:orderId", protectRoute, deleteOrder);

export default router;