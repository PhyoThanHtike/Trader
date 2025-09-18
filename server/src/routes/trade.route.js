import express from 'express';
import { getTradeMatches, getUserTrades } from '../controllers/trade.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/getTradeMatches", protectRoute, getTradeMatches);
router.get("/getUserTrades", protectRoute, getUserTrades);

export default router;