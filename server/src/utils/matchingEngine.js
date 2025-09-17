import prisma from "./database.js";
import { sendEmailNotification } from "./emailService.js";

export const matchingEngine = async (newOrder) => {
  try {
    const matches = [];
    const oppositeType = newOrder.type === 'BUY' ? 'SELL' : 'BUY';

    // Find matching orders based on price priority
    let matchingOrders = await prisma.order.findMany({
      where: {
        productId: newOrder.productId,
        type: oppositeType,
        status: { in: ['PENDING', 'PARTIALLY_FILLED'] },
        price: newOrder.type === 'BUY' ? { lte: newOrder.price } : { gte: newOrder.price }
      },
      orderBy: [
        { price: newOrder.type === 'BUY' ? 'asc' : 'desc' }, // Price priority
        { createdAt: 'asc' } // Time priority
      ],
      include: {
        user: true,
        product: true
      }
    });

    let remainingVolume = newOrder.volume - newOrder.filled;

    for (const matchOrder of matchingOrders) {
      if (remainingVolume <= 0) break;

      const availableVolume = matchOrder.volume - matchOrder.filled;  
      const tradeVolume = Math.min(remainingVolume, availableVolume);    //Calculating Trade volume

      if (tradeVolume > 0) {
        // Send email notification to the counterparty
        await sendEmailNotification({
          to: matchOrder.user.email,
          subject: `New ${newOrder.type.toLowerCase()} order matches your ${matchOrder.type.toLowerCase()} order`,
          html: `
            <p>Hello ${matchOrder.user.name},</p>
            <p>A new ${newOrder.type.toLowerCase()} order for ${matchOrder.product.name} matches your ${matchOrder.type.toLowerCase()} order.</p>
            <p>Order Details:</p>
            <ul>
              <li>Price: $${newOrder.price}</li>
              <li>Volume: ${tradeVolume}</li>
              <li>Total: $${newOrder.price * tradeVolume}</li>
            </ul>
            <p>Please check your dashboard to accept or reject this trade.</p>
          `
        });

        matches.push({
          orderId: matchOrder.id,
          price: matchOrder.price,
          volume: tradeVolume,
          counterparty: {
            id: matchOrder.user.id,
            name: matchOrder.user.name,
            email: matchOrder.user.email
          }
        });

        remainingVolume -= tradeVolume;
      }
    }

    return matches;

  } catch (error) {
    console.log("Error in matching engine", error.message);
    return [];
  }
};