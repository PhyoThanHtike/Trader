import prisma from "../utils/database.js";
import { sendEmailNotification } from "../utils/emailService.js";

export const getTradeMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // 'BUY' or 'SELL'
    console.log(userId);

    let matches = [];

    if (type === "SELL") {
      // Get buy orders that match seller's criteria
      matches = await prisma.order.findMany({
        where: {
          type: "BUY",
          status: { in: ["PENDING", "PARTIALLY_FILLED"] },
          product: {
            orders: {
              some: {
                userId: userId,
                type: "SELL",
                status: { in: ["PENDING", "PARTIALLY_FILLED"] },
              },
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: true,
        },
        orderBy: [{ price: "desc" }, { createdAt: "asc" }],
      });
    } else if (type === "BUY") {
      // Get sell orders that match buyer's criteria
      matches = await prisma.order.findMany({
        where: {
          type: "SELL",
          status: { in: ["PENDING", "PARTIALLY_FILLED"] },
          product: {
            orders: {
              some: {
                userId: userId,
                type: "BUY",
                status: { in: ["PENDING", "PARTIALLY_FILLED"] },
              },
            },
          },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          product: true,
        },
        orderBy: [{ price: "asc" }, { createdAt: "asc" }],
      });
    }

    res.json({
      success: true,
      message: "Trade matches retrieved successfully",
      matches,
    });
  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserTrades = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    // Build where clause
    const whereClause = {
      OR: [
        { buyerId: userId },
        { sellerId: userId }
      ]
    };

    // Add type filter if provided
    if (type === 'buy') {
      whereClause.OR = [{ buyerId: userId }];
    } else if (type === 'sell') {
      whereClause.OR = [{ sellerId: userId }];
    }

    const trades = await prisma.trade.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    const tradeStats = {
      totalTrades: trades.length,
      totalVolume: trades.reduce((sum, trade) => sum + trade.volume, 0),
      totalValue: trades.reduce((sum, trade) => sum + (trade.price * trade.volume), 0),
      buyCount: trades.filter(trade => trade.buyerId === userId).length,
      sellCount: trades.filter(trade => trade.sellerId === userId).length
    };

    // Format response with user role in each trade
    const formattedTrades = trades.map(trade => ({
      id: trade.id,
      price: trade.price,
      volume: trade.volume,
      totalValue: trade.price * trade.volume,
      createdAt: trade.createdAt,
      product: trade.product,
      // User's role in this trade
      userRole: trade.buyerId === userId ? 'buyer' : 'seller',
      // Counterparty information
      counterparty: trade.buyerId === userId ? {
        id: trade.seller.id,
        name: trade.seller.name,
        email: trade.seller.email,
        profilePicture: trade.seller.profilePicture
      } : {
        id: trade.buyer.id,
        name: trade.buyer.name,
        email: trade.buyer.email,
        profilePicture: trade.buyer.profilePicture
      }
    }));

    res.json({
      success: true,
      message: "Trades retrieved successfully",
      data: {
        trades: formattedTrades,
        stats: tradeStats
      }
    });

  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error" 
    });
  }
};
