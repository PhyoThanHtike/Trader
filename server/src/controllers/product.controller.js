import prisma from "../utils/database.js";

export const addProduct = async (req, res) => {
  try {
    const { name, avgPrice } = req.body;
    // const userId = req.user.id;
    // const user = await prisma.user.findUnique({ userId });
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not found!" });
    // }
    // if (user.role != "ADMIN") {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "User not allowed!" });
    // }
    const product = await prisma.product.create({
      data: {
        name,
        avgPrice,
      },
    });
    res.json({
      success: true,
      message: "Product added successful",
      product: {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productDescription: product.description,
        productAvgPrice: product.avgPrice,
      },
    });
  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products not found!" });
    }
    res.json({
      success: true,
      message: "Products found!",
      products: products,
    });
  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get product details
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
            orders:true,
            trades:true
          },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    // 1. Price Trend Chart (Last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const priceTrend = await prisma.dailyAnalytics.findMany({
      where: {
        productId: id,
        date: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        avgPrice: true,
        totalVolume: true
      }
    });

    // 2. Order Book Depth Chart (Current buy/sell orders)
    const [buyOrders, sellOrders] = await Promise.all([
      prisma.order.findMany({
        where: {
          productId: id,
          type: 'BUY',
          status: { in: ['PENDING', 'PARTIALLY_FILLED'] }
        },
        orderBy: { price: 'desc' },
        select: {
          price: true,
          volume: true,
          filled: true
        }
      }),
      prisma.order.findMany({
        where: {
          productId: id,
          type: 'SELL',
          status: { in: ['PENDING', 'PARTIALLY_FILLED'] }
        },
        orderBy: { price: 'asc' },
        select: {
          price: true,
          volume: true,
          filled: true
        }
      })
    ]);

    // 3. Recent Trades Chart (Last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const recentTrades = await prisma.trade.findMany({
      where: {
        productId: id,
        createdAt: {
          gte: twentyFourHoursAgo
        }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        price: true,
        volume: true,
        createdAt: true
      }
    });

    // Format data for Recharts
    const priceChartData = priceTrend.map(day => ({
      date: day.date.toISOString().split('T')[0],
      price: day.avgPrice,
      volume: day.totalVolume
    }));

    // Order book data for depth chart (group by price levels)
    const orderBookData = [
      // Buy side (sorted high to low)
      ...buyOrders.map(order => ({
        price: order.price,
        type: 'buy',
        volume: order.volume - order.filled
      })),
      // Sell side (sorted low to high)
      ...sellOrders.map(order => ({
        price: order.price,
        type: 'sell',
        volume: order.volume - order.filled
      }))
    ].sort((a, b) => b.price - a.price); // Sort for depth chart display

    const tradesChartData = recentTrades.map(trade => ({
      time: trade.createdAt.toISOString(),
      price: trade.price,
      volume: trade.volume
    }));

    // Current market stats
    const marketStats = {
      currentPrice: product.avgPrice,
      highestBid: buyOrders.length > 0 ? Math.max(...buyOrders.map(o => o.price)) : null,
      lowestAsk: sellOrders.length > 0 ? Math.min(...sellOrders.map(o => o.price)) : null,
      totalBuyVolume: buyOrders.reduce((sum, order) => sum + (order.volume - order.filled), 0),
      totalSellVolume: sellOrders.reduce((sum, order) => sum + (order.volume - order.filled), 0),
      dailyVolume: priceTrend.length > 0 ? priceTrend[priceTrend.length - 1].totalVolume : 0
    };

    res.json({
      success: true,
      message: "Product found with chart data!",
      product: {
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        productDescription: product.description,
        avgPrice: product.avgPrice,
        // orders: product.orders,
        // trades: product.trades
      },
      marketStats,
      charts: {
        // 1. Price Trend Chart (Line chart)
        priceTrend: {
          data: priceChartData,
          config: {
            xKey: "date",
            lines: [
              { key: "price", name: "Average Price", color: "#8884d8" },
              { key: "volume", name: "Volume", color: "#82ca9d", yAxisId: "right" }
            ]
          }
        },
        
        // 2. Order Book Depth Chart (Bar chart)
        orderDepth: {
          data: orderBookData,
          config: {
            xKey: "price",
            bars: [
              { 
                key: "volume", 
                name: "Buy Volume", 
                fill: "#00C49F",
                filter: (d) => d.type === 'buy'
              },
              { 
                key: "volume", 
                name: "Sell Volume", 
                fill: "#FF8042",
                filter: (d) => d.type === 'sell'
              }
            ]
          }
        },
        
        // 3. Recent Trades Chart (Scatter/Area chart)
        recentTrades: {
          data: tradesChartData,
          config: {
            xKey: "time",
            areas: [
              { key: "price", name: "Trade Price", color: "#8884d8" }
            ],
            points: [
              { key: "volume", name: "Trade Volume", color: "#ff7300" }
            ]
          }
        }
      }
    });

  } catch (error) {
    console.log("Error in product controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const getProductById = async (req, res) => {
//   try {
//     const productId = req.params;
//     console.log(productId);
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });
//     if (!product) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Products not found!" });
//     }
//     res.json({
//       success: true,
//       message: "Product found!",
//       product: {
//         productId: product.id,
//         productName: product.name,
//         productDescription: product.description,
//         productImage: product.image,
//         productAvgPrice: product.avgPrice,
//       },
//     });
//   } catch (error) {
//     console.log("Error in product controller", error.message);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

