import prisma from "../utils/database.js";
import { sendEmailNotification } from "../utils/emailService.js";

export const getTradeMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query; // 'BUY' or 'SELL'

    let matches = [];

    if (type === 'SELL') {
      // Get buy orders that match seller's criteria
      matches = await prisma.order.findMany({
        where: {
          type: 'BUY',
          status: { in: ['PENDING', 'PARTIALLY_FILLED'] },
          product: {
            orders: {
              some: {
                userId: userId,
                type: 'SELL',
                status: { in: ['PENDING', 'PARTIALLY_FILLED'] }
              }
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          product: true
        },
        orderBy: [
          { price: 'desc' },
          { createdAt: 'asc' }
        ]
      });
    } else if (type === 'BUY') {
      // Get sell orders that match buyer's criteria
      matches = await prisma.order.findMany({
        where: {
          type: 'SELL',
          status: { in: ['PENDING', 'PARTIALLY_FILLED'] },
          product: {
            orders: {
              some: {
                userId: userId,
                type: 'BUY',
                status: { in: ['PENDING', 'PARTIALLY_FILLED'] }
              }
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          product: true
        },
        orderBy: [
          { price: 'asc' },
          { createdAt: 'asc' }
        ]
      });
    }

    res.json({
      success: true,
      message: "Trade matches retrieved successfully",
      matches
    });

  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const acceptTrade = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // Get the counterparty order
    const counterpartyOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        product: true
      }
    });

    if (!counterpartyOrder) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Get user's order for the same product
    const userOrder = await prisma.order.findFirst({
      where: {
        userId,
        productId: counterpartyOrder.productId,
        type: counterpartyOrder.type === 'BUY' ? 'SELL' : 'BUY',
        status: { in: ['PENDING', 'PARTIALLY_FILLED'] }
      }
    });

    if (!userOrder) {
      return res.status(404).json({ 
        success: false, 
        message: "No matching order found" 
      });
    }

    // Calculate trade volume (minimum of available volumes)
    const tradeVolume = Math.min(
      counterpartyOrder.volume - counterpartyOrder.filled,
      userOrder.volume - userOrder.filled
    );

    // Create trade
    const trade = await prisma.trade.create({
      data: {
        price: counterpartyOrder.price,
        volume: tradeVolume,
        buyerId: counterpartyOrder.type === 'BUY' ? counterpartyOrder.userId : userId,
        sellerId: counterpartyOrder.type === 'SELL' ? counterpartyOrder.userId : userId,
        productId: counterpartyOrder.productId
      }
    });

    // Update orders
    await prisma.order.update({
      where: { id: counterpartyOrder.id },
      data: {
        filled: counterpartyOrder.filled + tradeVolume,
        status: (counterpartyOrder.filled + tradeVolume) === counterpartyOrder.volume ? 'FILLED' : 'PARTIALLY_FILLED'
      }
    });

    await prisma.order.update({
      where: { id: userOrder.id },
      data: {
        filled: userOrder.filled + tradeVolume,
        status: (userOrder.filled + tradeVolume) === userOrder.volume ? 'FILLED' : 'PARTIALLY_FILLED'
      }
    });

    // Send email notifications
    if (counterpartyOrder.type === 'BUY') {
      // Seller accepted buyer's offer - notify buyer
      await sendEmailNotification({
        to: counterpartyOrder.user.email,
        subject: "Your buy order has been accepted",
        html: `
          <p>Hello ${counterpartyOrder.user.name},</p>
          <p>Your buy order for ${counterpartyOrder.product.name} has been accepted by a seller.</p>
          <p>Trade Details:</p>
          <ul>
            <li>Product: ${counterpartyOrder.product.name}</li>
            <li>Price: $${counterpartyOrder.price}</li>
            <li>Volume: ${tradeVolume}</li>
            <li>Total: $${counterpartyOrder.price * tradeVolume}</li>
          </ul>
          <p>Please contact the seller to complete the transaction.</p>
        `
      });
    } else {
      // Buyer accepted seller's offer - notify seller
      await sendEmailNotification({
        to: counterpartyOrder.user.email,
        subject: "Your sell order has been accepted",
        html: `
          <p>Hello ${counterpartyOrder.user.name},</p>
          <p>Your sell order for ${counterpartyOrder.product.name} has been accepted by a buyer.</p>
          <p>Trade Details:</p>
          <ul>
            <li>Product: ${counterpartyOrder.product.name}</li>
            <li>Price: $${counterpartyOrder.price}</li>
            <li>Volume: ${tradeVolume}</li>
            <li>Total: $${counterpartyOrder.price * tradeVolume}</li>
          </ul>
          <p>Please contact the buyer to complete the transaction.</p>
        `
      });
    }

    res.json({
      success: true,
      message: "Trade accepted successfully",
      trade
    });

  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const rejectTrade = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // Here you might want to store rejection information
    // to prevent showing the same match again

    res.json({
      success: true,
      message: "Trade rejected successfully"
    });

  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserTrades = async (req, res) => {
  try {
    const userId = req.user.id;

    const trades = await prisma.trade.findMany({
      where: {
        OR: [
          { buyerId: userId },
          { sellerId: userId }
        ]
      },
      include: {
        product: true,
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      message: "Trades retrieved successfully",
      trades
    });

  } catch (error) {
    console.log("Error in trade controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};