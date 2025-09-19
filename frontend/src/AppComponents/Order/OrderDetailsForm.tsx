import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BanknoteArrowDown, BanknoteArrowUp, DollarSign, Package, Loader2, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface OrderDetailsFormProps {
  orderType: "BUY" | "SELL";
  setOrderType: (v: "BUY" | "SELL") => void;
  price: string;
  setPrice: (v: string) => void;
  volume: string;
  setVolume: (v: string) => void;
  formError: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
}

const OrderDetailsForm: React.FC<OrderDetailsFormProps> = ({
  orderType,
  setOrderType,
  price,
  setPrice,
  volume,
  setVolume,
  formError,
  isSubmitting,
  onSubmit,
}) => {
  const calculateTotal = () => {
    const p = parseFloat(price) || 0;
    const v = parseFloat(volume) || 0;
    return (p * v).toFixed(2);
  };

  return (
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-4"
          >
            {/* Order Type */}
            <div className="space-y-2">
              <Label>Order Type</Label>
              <RadioGroup
                value={orderType}
                onValueChange={(v: "BUY" | "SELL") => setOrderType(v)}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="SELL" id="sell" className="sr-only" />
                  <Label
                    htmlFor="sell"
                    className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 cursor-pointer ${
                      orderType === "SELL"
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <BanknoteArrowDown className="mb-2 h-6 w-6 text-green-500" />
                    <span className="font-semibold text-green-600">SELL</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="BUY" id="buy" className="sr-only" />
                  <Label
                    htmlFor="buy"
                    className={`flex flex-col items-center justify-center rounded-md border-2 border-muted p-4 cursor-pointer ${
                      orderType === "BUY"
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <BanknoteArrowUp className="mb-2 h-6 w-6 text-blue-500" />
                    <span className="font-semibold text-blue-600">BUY</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Price */}
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

            {/* Volume */}
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

            {/* Total */}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
  );
};

export default OrderDetailsForm;
