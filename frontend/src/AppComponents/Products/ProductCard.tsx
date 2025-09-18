// components/ProductCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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

const ProductCard: React.FC<ProductCardProps> = ({ product, index }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const truncateDescription = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
      className="h-full"
    >
      <Card 
        className="h-full cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
        onClick={handleCardClick}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
            }}
          />
        </motion.div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <motion.h3 
              className="text-xl font-bold"
            //   whileHover={{ color: "#3b82f6" }}
            //   transition={{ duration: 0.2 }}
            >
              {product.name}
            </motion.h3>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              ${product.avgPrice}
            </Badge>
          </div>
        </CardHeader>
        
        {/* <CardContent className="pb-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {truncateDescription(product.description, 120)}
          </p>
        </CardContent> */}
        
        <CardFooter className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Added: {formatDate(product.createdAt)}
          </span>
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;