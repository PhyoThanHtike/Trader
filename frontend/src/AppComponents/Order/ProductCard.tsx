import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BanknoteArrowDown, BanknoteArrowUp, Info } from "lucide-react";

interface ProductCardProps {
  product: {
    productName: string;
    productDescription: string;
    productImage?: string;
    avgPrice: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const estimates = {
    buy: Math.round(product.avgPrice * 0.95 * 100) / 100,
    sell: Math.round(product.avgPrice * 1.05 * 100) / 100,
  };

  return (
    <motion.div
      className="lg:col-span-2"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {product.productImage && (
            <div className="md:w-2/5">
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-64 md:h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                }}
              />
            </div>
          )}
          <div className="p-6 flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold">{product.productName}</h2>
              </div>
              <div className="flex items-center justify-center gap-2">
                    <span>Market Value:</span>
                  <Badge className="text-lg px-3 py-1">
                     ${product.avgPrice}
                  </Badge>
              </div>
            </div>
                            <p className="text-muted-foreground mt-1">
                  {product.productDescription}
                </p>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-muted/40 rounded-lg">
                <div className="flex items-center mb-2">
                  <BanknoteArrowDown className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm font-medium">Estimated Sell</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ${estimates.buy}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ~5% below average
                </p>
              </div>

              <div className="p-4 bg-muted/40 rounded-lg">
                <div className="flex items-center mb-2">
                  <BanknoteArrowUp className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium">Estimated Buy</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${estimates.sell}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ~5% above average
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-2" />
              <span>
                Market prices are estimates based on current averages
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
