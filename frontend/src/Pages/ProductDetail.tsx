// components/ProductDetail.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetProductById, type productById } from "@/apiEndpoints/Products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  TrendingUp,
  BarChart3,
  Activity,
} from "lucide-react";
import ChartComponent from "@/AppComponents/ProductDetail/ChartComponent";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading: productLoading,
    error: productError,
  } = useQuery<productById>({
    queryKey: ["productById", id],
    queryFn: () => {
      if (!id) throw new Error("Product ID is required");
      return GetProductById(id);
    },
    enabled: !!id,
  });

  const calculatePriceEstimates = (avgPrice: number) => {
    const buyPrice = avgPrice * 0.95; // 5% below avg price
    const sellPrice = avgPrice * 1.05; // 5% above avg price
    return {
      buyPrice: Math.round(buyPrice * 100) / 100,
      sellPrice: Math.round(sellPrice * 100) / 100,
    };
  };

  if (productLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-24 mb-4" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load product details: {productError.message}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  if (!productData?.product) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertTitle>Product not found</AlertTitle>
          <AlertDescription>
            The product you're looking for doesn't exist.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate(-1)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const { product, marketStats, charts } = productData;
  const priceEstimates = calculatePriceEstimates(product.avgPrice);

  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold"
        >
          Product Details
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{product.productName}</CardTitle>
              <Badge
                variant="secondary"
                className="text-lg bg-primary text-primary-foreground"
              >
                ${product.avgPrice}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <img
                src={product.productImage}
                alt={product.productName}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";
                }}
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estimated Sell Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  ${priceEstimates.buyPrice}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Estimated Buy Price</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600">
                  ${priceEstimates.sellPrice}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Market Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Market Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Current Price:</span>
                <span className="font-semibold">
                  ${marketStats.currentPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Highest Bid:</span>
                <span className="font-semibold">
                  {marketStats.highestBid
                    ? `$${marketStats.highestBid}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Lowest Ask:</span>
                <span className="font-semibold">
                  {marketStats.lowestAsk
                    ? `$${marketStats.lowestAsk}`
                    : "No Sell Order for now"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Currently Selling Volume:</span>
                <span className="font-semibold">
                  {marketStats.totalSellVolume}
                </span>
              </div>
            </CardContent>
          </Card>
          <Link to={`/order/form/${id}`}>
              <button className="w-full p-2 bg-green-700 text-white rounded-lg mt-6 hover:bg-green-800">
                Create Order
              </button>
          </Link>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {product.productDescription}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        {/* // In the ProductDetail component, update the chart sections: */}
        {/* Order Depth Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <BarChart3 className="mr-2 h-5 w-5" />
            <CardTitle className="text-lg">Order Book Depth</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={charts.orderDepth.data}
              config={charts.orderDepth.config}
              title=""
              height={250}
              chartType="orderDepth"
            />
          </CardContent>
        </Card>
        {/* Recent Trades Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <Activity className="mr-2 h-5 w-5" />
            <CardTitle className="text-lg">Recent Trades (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={charts.recentTrades.data}
              config={charts.recentTrades.config}
              title=""
              height={250}
              chartType="recentTrades"
            />
          </CardContent>
        </Card>
        {/* Price Trend Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <TrendingUp className="mr-2 h-5 w-5" />
            <CardTitle className="text-lg">Price Trend (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartComponent
              data={charts.priceTrend.data}
              config={charts.priceTrend.config}
              title=""
              height={250}
              chartType="priceTrend"
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
