import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface MarketStatsProps {
  stats?: {
    currentPrice?: number;
    highestBid?: number;
    lowestAsk?: number;
    totalSellVolume?: number;
  };
  avgPrice: number;
}

const MarketStats: React.FC<MarketStatsProps> = ({ stats, avgPrice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Market Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current Price</span>
            <span className="font-semibold">
              ${stats?.currentPrice ?? avgPrice}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Highest Bid</span>
            <span className="font-semibold">
              {stats?.highestBid ? `$${stats.highestBid}` : "N/A"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Lowest Ask</span>
            <span className="font-semibold">
              {stats?.lowestAsk ? `$${stats.lowestAsk}` : "No Sell Orders"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Selling Volume</span>
            <span className="font-semibold">{stats?.totalSellVolume ?? 0}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MarketStats;
