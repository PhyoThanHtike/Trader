import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  createdAt: string;
  avgPrice: number;
}

interface ProductCardProps {
  product: Product;
  index: number;
}

const ProductCards: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{ y: -6 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer overflow-hidden border border-transparent hover:border-primary/30 transition-all duration-300 shadow-md hover:shadow-2xl rounded-xl"
        onClick={handleCardClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <motion.h3
              className="text-lg font-semibold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            >
              {product.name}
            </motion.h3>
            <span className="text-xs text-muted-foreground">
              Added: {formatDate(product.createdAt)}
            </span>
          </div>
        </CardHeader>
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              e.currentTarget.src =
                "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
            }}
          />
        </motion.div>

        <CardContent>
          <div className="flex items-center justify-between">
            <motion.h3
              className="text-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            >
              Current Market Value:
            </motion.h3>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            >
              <Badge
                variant="secondary"
                className="bg-gray-800 text-white px-2 py-1"
              >
                ${product.avgPrice}
              </Badge>
            </motion.div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center items-center border-t">
          <motion.div whileHover={{ x: 4 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="text-primary hover:text-primary/80"
            >
              View Details →
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCards;
