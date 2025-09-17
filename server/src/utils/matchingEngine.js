// import prisma from "./database.js";
// import { sendEmailNotification } from "./emailService.js";

// export const matchingEngine = async (newOrder) => {
//   try {
//     const matches = [];
//     const oppositeType = newOrder.type === 'BUY' ? 'SELL' : 'BUY';

//     // Find matching orders based on price priority
//     let matchingOrders = await prisma.order.findMany({
//       where: {
//         productId: newOrder.productId,
//         type: oppositeType,
//         status: { in: ['PENDING', 'PARTIALLY_FILLED'] },
//         price: newOrder.type === 'BUY' ? { lte: newOrder.price } : { gte: newOrder.price }
//       },
//       orderBy: [
//         { price: newOrder.type === 'BUY' ? 'asc' : 'desc' }, // Price priority
//         { createdAt: 'asc' } // Time priority
//       ],
//       include: {
//         user: true,
//         product: true
//       }
//     });

//     let remainingVolume = newOrder.volume - newOrder.filled;

//     for (const matchOrder of matchingOrders) {
//       if (remainingVolume <= 0) break;

//       const availableVolume = matchOrder.volume - matchOrder.filled;
//       const tradeVolume = Math.min(remainingVolume, availableVolume);    //Calculating Trade volume

//       if (tradeVolume > 0) {
//         // Send email notification to the counterparty
//         await sendEmailNotification({
//           to: matchOrder.user.email,
//           subject: `New ${newOrder.type.toLowerCase()} order matches your ${matchOrder.type.toLowerCase()} order`,
//           html: `
//             <p>Hello ${matchOrder.user.name},</p>
//             <p>A new ${newOrder.type.toLowerCase()} order for ${matchOrder.product.name} matches your ${matchOrder.type.toLowerCase()} order.</p>
//             <p>Order Details:</p>
//             <ul>
//               <li>Price: $${newOrder.price}</li>
//               <li>Volume: ${tradeVolume}</li>
//               <li>Total: $${newOrder.price * tradeVolume}</li>
//             </ul>
//             <p>Please check your dashboard to accept or reject this trade.</p>
//           `
//         });

//         matches.push({
//           orderId: matchOrder.id,
//           price: matchOrder.price,
//           volume: tradeVolume,
//           counterparty: {
//             id: matchOrder.user.id,
//             name: matchOrder.user.name,
//             email: matchOrder.user.email
//           }
//         });

//         remainingVolume -= tradeVolume;
//       }
//     }

//     return matches;

//   } catch (error) {
//     console.log("Error in matching engine", error.message);
//     return [];
//   }
// };

import prisma from "../utils/database.js";
import { sendEmailNotification } from "../utils/emailService.js";
// import { releaseEscrow } from "../utils/stripeService"; // For future payment integration

export const matchingEngine = async (newOrder) => {
  try {
    const trades = [];
    const oppositeType = newOrder.type === "BUY" ? "SELL" : "BUY";
    let remainingVolume = newOrder.volume;

    // Find matching orders based on price and time priority
    let matchingOrders = await prisma.order.findMany({
      where: {
        productId: newOrder.productId,
        type: oppositeType,
        status: { in: ["PENDING", "PARTIALLY_FILLED"] },
        price:
          newOrder.type === "BUY"
            ? { lte: newOrder.price }
            : { gte: newOrder.price },
        NOT: {
          userId: newOrder.userId, // 👈 Prevent self-trading
        },
      },
      orderBy: [
        { price: newOrder.type === "BUY" ? "asc" : "desc" }, // Best price first
        { createdAt: "asc" }, // First come first served
      ],
      include: {
        user: true,
        product: true,
      },
    });

    for (const matchOrder of matchingOrders) {
      if (remainingVolume <= 0) break;

      const availableVolume = matchOrder.volume - matchOrder.filled;
      const tradeVolume = Math.min(remainingVolume, availableVolume);
      const tradePrice = matchOrder.price; // Use the matched order's price

      if (tradeVolume > 0) {
        // Create trade record
        const trade = await prisma.trade.create({
          data: {
            price: tradePrice,
            volume: tradeVolume,
            buyerId:
              newOrder.type === "BUY" ? newOrder.userId : matchOrder.userId,
            sellerId:
              newOrder.type === "SELL" ? newOrder.userId : matchOrder.userId,
            productId: newOrder.productId,
          },
          include: {
            buyer: true,
            seller: true,
            product: true,
          },
        });

        trades.push(trade);

        // Update both orders
        await prisma.order.update({
          where: { id: newOrder.id },
          data: {
            filled: { increment: tradeVolume },
            status:
              newOrder.filled + tradeVolume === newOrder.volume
                ? "FILLED"
                : "PARTIALLY_FILLED",
          },
        });

        await prisma.order.update({
          where: { id: matchOrder.id },
          data: {
            filled: { increment: tradeVolume },
            status:
              matchOrder.filled + tradeVolume === matchOrder.volume
                ? "FILLED"
                : "PARTIALLY_FILLED",
          },
        });

        remainingVolume -= tradeVolume;

        // Send email notifications
        await sendTradeNotifications(trade, newOrder.type);

        // For future payment integration:
        // if (newOrder.type === 'BUY') {
        //   // Release escrow funds to seller
        //   await releaseEscrow(newOrder.paymentIntentId, tradeVolume * tradePrice);
        // }
      }
    }

    return {
      trades,
      message:
        trades.length > 0
          ? `Order matched with ${trades.length} trade(s)`
          : "No immediate matches found",
    };
  } catch (error) {
    console.log("Error in automatic matching engine", error.message);
    return { trades: [], message: "Matching engine error" };
  }
};

const sendTradeNotifications = async (trade, initiatorType) => {
  try {
    // Notify buyer
    await sendEmailNotification({
      to: trade.buyer.email,
      subject: `Trade executed for ${trade.product.name}`,
      html: `
        <p>Hello ${trade.buyer.name},</p>
        <p>Your trade for ${trade.product.name} has been executed.</p>
        <p>Trade Details:</p>
        <ul>
          <li>Product: ${trade.product.name}</li>
          <li>Price: $${trade.price} per unit</li>
          <li>Volume: ${trade.volume} units</li>
          <li>Total: $${trade.price * trade.volume}</li>
          <li>Seller: ${trade.seller.name} (${trade.seller.email})</li>
        </ul>
      `,
    });

    // Notify seller
    await sendEmailNotification({
      to: trade.seller.email,
      subject: `Trade executed for ${trade.product.name}`,
      html: `
        <p>Hello ${trade.seller.name},</p>
        <p>Your trade for ${trade.product.name} has been executed.</p>
        <p>Trade Details:</p>
        <ul>
          <li>Product: ${trade.product.name}</li>
          <li>Price: $${trade.price} per unit</li>
          <li>Volume: ${trade.volume} units</li>
          <li>Total: $${trade.price * trade.volume}</li>
          <li>Buyer: ${trade.buyer.name} (${trade.buyer.email})</li>
        </ul>
      `,
    });
  } catch (error) {
    console.log("Error sending trade notifications", error.message);
  }
};
