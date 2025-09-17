import prisma from "../utils/database.js";
import { matchingEngine } from "../utils/matchingEngine.js";
import { sendEmailNotification } from "../utils/emailService.js";

// export const placeOrder = async (req, res) => {
//   try {
//     const { type, price, volume, productId } = req.body;
//     const userId = req.user.id;

//     // Validate input
//     if (!type || !price || !volume || !productId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Missing required fields" 
//       });
//     }

//     if (price <= 0 || volume <= 0) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Price and volume must be positive" 
//       });
//     }

//     // Check if product exists
//     const product = await prisma.product.findUnique({
//       where: { id: productId }
//     });

//     if (!product) {
//       return res.status(404).json({ 
//         success: false, 
//         message: "Product not found" 
//       });
//     }

//     // Create order
//     const order = await prisma.order.create({
//       data: {
//         type,
//         price,
//         volume,
//         userId,
//         productId,
//         status: 'PENDING'
//       },
//       include: {
//         user: true,
//         product: true
//       }
//     });

//     // Run matching engine
//     const matches = await matchingEngine(order);

//     res.json({
//       success: true,
//       message: "Order placed successfully",
//       order: {
//         id: order.id,
//         type: order.type,
//         price: order.price,
//         volume: order.volume,
//         status: order.status,
//         product: order.product.name
//       },
//       matches: matches
//     });

//   } catch (error) {
//     console.log("Error in order controller", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

export const placeOrder = async (req, res) => {
  try {
    const { type, price, volume, productId } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!type || !price || !volume || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    if (price <= 0 || volume <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Price and volume must be positive" 
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // For future payment integration:
    // const totalAmount = price * volume;
    // let paymentIntentId = null;
    // if (type === 'BUY') {
    //   const paymentIntent = await createPaymentIntent({
    //     amount: Math.round(totalAmount * 100),
    //     currency: 'usd',
    //     metadata: { userId, productId, orderType: 'BUY' }
    //   });
    //   paymentIntentId = paymentIntent.id;
    // }

    // Create order
    const order = await prisma.order.create({
      data: {
        type,
        price,
        volume,
        userId,
        productId,
        // totalAmount, // For future payment
        // paymentIntentId, // For future payment
        status: 'PENDING'
      },
      include: {
        user: true,
        product: true
      }
    });

    // Run automatic matching engine
    const tradeResults = await matchingEngine(order);

    res.json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order.id,
        type: order.type,
        price: order.price,
        volume: order.volume,
        status: order.status,
        filled: order.filled,
        product: order.product.name
      },
      trades: tradeResults.trades,
      message: tradeResults.message
    });

  } catch (error) {
    console.log("Error in order controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, type, productId } = req.query;

    const whereClause = { userId };
    
    if (status) whereClause.status = status;
    if (type) whereClause.type = type;
    if (productId) whereClause.productId = productId;

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        product: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      message: "Orders retrieved successfully",
      orders
    });

  } catch (error) {
    console.log("Error in order controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true }
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to cancel this order" 
      });
    }

    if (order.status === 'FILLED') {
      return res.status(400).json({ 
        success: false, 
        message: "Cannot cancel filled order" 
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' }
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order: updatedOrder
    });

  } catch (error) {
    console.log("Error in order controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};