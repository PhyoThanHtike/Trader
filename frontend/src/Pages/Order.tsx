// components/Order.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetAllProducts, type allProducts } from "@/apiEndpoints/Products";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShoppingCart, CheckCircle2 } from "lucide-react";

const Order = () => {
  const navigate = useNavigate();

  const {
    data: allProductsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<allProducts>({
    queryKey: ["allProducts"],
    queryFn: GetAllProducts,
  });

  const handleProductClick = (productId: string) => {
    navigate(`/order/form/${productId}`);
  };

  if (productsLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Order (Buy / Sell)</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="cursor-pointer">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!allProductsData?.products || allProductsData.products.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTitle>No products available</AlertTitle>
          <AlertDescription>
            There are no products available for trading at the moment.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl font-bold mb-4"
      >
        Order (Buy / Sell)
      </motion.h1>

      {/* Short guide */}
      {/* Short guide */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="
    rounded-xl p-6 shadow-md mb-8 
    bg-gradient-to-tl from-blue-50 via-green-50 to-red-50 
    dark:from-slate-800 dark:via-slate-900 dark:to-slate-800
  "
      >
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-primary" /> How to place an
          order
        </h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
            <span>Browse through the available products listed below.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
            <span>Select the product you wish to trade by clicking on it.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
            <span>Fill in your order details (buy/sell) in the form.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1" />
            <span>Submit and confirm your order instantly.</span>
          </li>
        </ul>
      </motion.div>

      {/* Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProductsData.products.map((product: any, index: number) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -8,
              scale: 1.03,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
          >
            <Card
              className="cursor-pointer h-full border-2 border-transparent hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => handleProductClick(product.id)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg truncate">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="text-muted-foreground text-sm line-clamp-3 mb-3"
                >
                  {product.description || "No description available."}
                </motion.p>
                <div className="flex items-center justify-between">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="text-sm text-muted-foreground font-medium"
                  >
                    Market Value: ${product.avgPrice} / kg
                  </motion.span>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.25, duration: 0.6 }}
                  className="text-xs text-primary font-semibold pt-4"
                >
                  Click to trade →
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Order;
