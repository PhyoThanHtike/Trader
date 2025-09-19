// components/order/OrderForm.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GetProductById, type productById } from "@/apiEndpoints/Products";
import { PlaceOrder, type orderData } from "@/apiEndpoints/Order";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import LoadingSkeleton from "@/AppComponents/Order/LoadingSkeleton";
import ErrorState from "@/AppComponents/Order/ErrorState";
import EmptyState from "@/AppComponents/Order/EmptyState";
import ProductCard from "@/AppComponents/Order/ProductCard";
import MarketStats from "@/AppComponents/Order/MarketStats";
import OrderDetailsForm from "@/AppComponents/Order/OrderDetailsForm";
import { OrderAlert } from "@/AppComponents/Order/OrderAlert";

const OrderForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [price, setPrice] = useState("");
  const [volume, setVolume] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    data: productData,
    isLoading,
    error,
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
    onSuccess: () => navigate("/order"),
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : "Failed to place order";
      setFormError(message);
    },
  });

  const handleConfirm = () => {
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

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onBack={() => navigate("/order")} />;
  if (!productData?.product) return <EmptyState onBack={() => navigate("/order")} />;

  const { product, marketStats } = productData;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="container mx-auto p-6"
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

      {/* Product */}
      <ProductCard product={product} />

      {/* Market + Order */}
      <div className="space-y-6 grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        <MarketStats stats={marketStats} avgPrice={product.avgPrice} />
        <OrderDetailsForm
          orderType={orderType}
          setOrderType={setOrderType}
          price={price}
          setPrice={setPrice}
          volume={volume}
          setVolume={setVolume}
          formError={formError}
          isSubmitting={placeOrderMutation.isPending}
          onSubmit={() => setConfirmOpen(true)}
        />
      </div>

      {/* Confirm Order Dialog */}
      <OrderAlert
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Confirm Order"
        description={`Are you sure you want to place a ${orderType} order for ${volume} units at $${price} each?`}
        confirmText="Place Order"
        onConfirm={handleConfirm}
      />
    </motion.div>
  );
};

export default OrderForm;
