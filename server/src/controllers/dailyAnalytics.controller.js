import prisma from "../utils/database.js";
import cron from "node-cron";

export const calculateDailyAnalytics = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all products
    const products = await prisma.product.findMany();

    for (const product of products) {
      // Get all trades for this product from yesterday
      const trades = await prisma.trade.findMany({
        where: {
          productId: product.id,
          createdAt: {
            gte: yesterday,
            lt: today
          }
        }
      });

      if (trades.length > 0) {
        // Calculate average price and total volume
        const totalVolume = trades.reduce((sum, trade) => sum + trade.volume, 0);
        const totalValue = trades.reduce((sum, trade) => sum + (trade.price * trade.volume), 0);
        const avgPrice = totalValue / totalVolume;

        // Save to daily analytics
        await prisma.dailyAnalytics.create({
          data: {
            date: yesterday,
            avgPrice,
            totalVolume,
            productId: product.id
          }
        });

        // Update product's average price
        await prisma.product.update({
          where: { id: product.id },
          data: { avgPrice }
        });
      }
    }

    console.log("Daily analytics calculated successfully");
  } catch (error) {
    console.log("Error in daily analytics calculation", error.message);
  }
};

// Schedule to run at midnight every day
cron.schedule('0 0 * * *', calculateDailyAnalytics);