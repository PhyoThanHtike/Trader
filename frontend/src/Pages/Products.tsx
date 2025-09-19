// components/Products.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { GetAllProducts, type allProducts } from "@/apiEndpoints/Products";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ProductCards from "@/AppComponents/Products/ProductCards";
import { motion } from "framer-motion";

const Products = () => {
  const {
    data: allProductsData,
    isLoading: productsLoading,
    error: productsError,
  } = useQuery<allProducts>({
    queryKey: ["allProducts"],
    queryFn: GetAllProducts,
  });

  if (productsLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="p-6">
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
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold"
        >
          Product Details
        </motion.h1>
        <div className="p-6 text-center">
          <Alert>
            <AlertTitle>No products found</AlertTitle>
            <AlertDescription>
              There are no products available at the moment.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl font-bold mb-6"
      >
        Products
      </motion.h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allProductsData.products.map((product: any, index: any) => (
          <ProductCards key={product.id} product={product} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Products;
