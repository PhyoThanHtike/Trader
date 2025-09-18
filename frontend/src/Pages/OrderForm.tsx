// components/OrderForm.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GetProductById, type productById } from "@/apiEndpoints/Products";
import { PlaceOrder, type orderData } from "@/apiEndpoints/Order";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  TrendingUp,
  TrendingDown,
  Info,
  DollarSign,
  Package,
  BanknoteArrowDown,
  BanknoteArrowUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const OrderForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [price, setPrice] = useState("");
  const [volume, setVolume] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

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

  const placeOrderMutation = useMutation({
    mutationFn: (payload: orderData) => PlaceOrder(payload),
    onSuccess: () => {
      navigate("/order");
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to place order";
      setFormError(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!id) return setFormError("Product id is missing");

    const priceNum = parseFloat(price);
    const volumeNum = parseFloat(volume);

    if (isNaN(priceNum) || priceNum <= 0)
      return setFormError("Please enter a valid price > 0");
    if (isNaN(volumeNum) || volumeNum <= 0)
      return setFormError("Please enter a valid volume > 0");

    const payload: orderData = {
      type: orderType,
      price: priceNum,
      volume: volumeNum,
      productId: id,
    };

    placeOrderMutation.mutate(payload);
  };

  const calculateTotal = () => {
    const p = parseFloat(price) || 0;
    const v = parseFloat(volume) || 0;
    return (p * v).toFixed(2);
  };

  const priceEstimates = (avg: number) => ({
    buy: Math.round(avg * 0.95 * 100) / 100,
    sell: Math.round(avg * 1.05 * 100) / 100,
  });

  if (productLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex items-center mb-8">
          <Skeleton className="h-10 w-10 rounded-md mr-4" />
          <Skeleton className="h-10 w-44" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Skeleton className="h-24 rounded-lg" />
                <Skeleton className="h-24 rounded-lg" />
              </div>
              <Skeleton className="h-48 w-full rounded-lg" />
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (productError) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {(productError as Error)?.message || "Failed to load product"}
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/order")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  if (!productData?.product) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Alert className="mb-6">
          <AlertTitle>Product not found</AlertTitle>
          <AlertDescription>
            The product you're trying to order doesn't exist.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/order")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  const { product, marketStats } = productData;
  const estimates = priceEstimates(product.avgPrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container p-6 w-full"
    >
      {/* Header */}
      <div className="mb-8 flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="mr-4"
          onClick={() => navigate("/order")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Place Order</h1>
          <p className="text-muted-foreground">
            Create a new buy or sell order
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="gap-8">
        {/* Product Card */}
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
                    <h2 className="text-2xl font-bold">
                      {product.productName}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {product.productDescription}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    ${product.avgPrice}
                  </Badge>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-muted/40 rounded-lg">
                    <div className="flex items-center mb-2">
                      <BanknoteArrowDown className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm font-medium">
                        Estimated Sell
                      </span>
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
      </div>

      {/* Right Column - Market Stats and Order Form */}
      <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        {/* Market Stats */}
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
                  ${marketStats?.currentPrice ?? product.avgPrice}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Highest Bid</span>
                <span className="font-semibold">
                  {marketStats?.highestBid
                    ? `$${marketStats.highestBid}`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lowest Ask</span>
                <span className="font-semibold">
                  {marketStats?.lowestAsk
                    ? `$${marketStats.lowestAsk}`
                    : "No Sell Orders"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Selling Volume</span>
                <span className="font-semibold">
                  {marketStats?.totalSellVolume ?? 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <RadioGroup
                    value={orderType}
                    onValueChange={(v: "BUY" | "SELL") => setOrderType(v)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="SELL"
                        id="sell"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="sell"
                        className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                          orderType === "SELL"
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : ""
                        }`}
                      >
                        <BanknoteArrowDown className="mb-2 h-6 w-6 text-green-500" />
                        <span className="font-semibold text-green-600">
                          SELL
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="BUY"
                        id="buy"
                        className="sr-only"
                      />
                      <Label
                        htmlFor="buy"
                        className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                          orderType === "BUY"
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                            : ""
                        }`}
                      >
                        <BanknoteArrowUp className="mb-2 h-6 w-6 text-blue-500" />
                        <span className="font-semibold text-blue-600">BUY</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Price per unit ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="volume" className="flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Volume (units)
                  </Label>
                  <Input
                    id="volume"
                    type="number"
                    step="1"
                    min="1"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                    required
                    placeholder="0"
                  />
                </div>

                {price && volume && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-muted/40 rounded-lg flex justify-between items-center"
                  >
                    <span className="font-medium">Total Value</span>
                    <span className="text-xl font-bold text-primary">
                      ${calculateTotal()}
                    </span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  disabled={placeOrderMutation.isPending}
                >
                  {placeOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Place {orderType} Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderForm;
