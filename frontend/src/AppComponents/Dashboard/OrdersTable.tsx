import { useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrderAlert } from "../Order/OrderAlert";
import { Trash2, X, RotateCcw } from "lucide-react";

interface Order {
  id: string;
  type: "SELL" | "BUY";
  price: number;
  volume: number;
  filled: number;
  status: string;
  createdAt: string;
  userId: string;
  productId: string;
  product:any;
}

interface OrdersTableProps {
  orders: Order[];
  onRefresh: () => void;
  onDelete: (orderId: string) => void;
}

export default function OrdersTable({
  orders,
  onRefresh,
  onDelete,
}: OrdersTableProps) {
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<"delete" | "cancel" | "">("");

  const handleDelete = (order: Order) => {
    setSelectedOrder(order);
    setActionType("delete");
    setAlertOpen(true);
  };

  const handleCancel = (order: Order) => {
    setSelectedOrder(order);
    setActionType("cancel");
    setAlertOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedOrder) return;

    try {
      // Implement API calls for delete/cancel here
      onDelete(selectedOrder.id);
      onRefresh();
    } catch (error) {
      console.error(`Failed to ${actionType} order:`, error);
    } finally {
      setAlertOpen(false);
      setSelectedOrder(null);
      setActionType("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "FILLED":
        return "text-green-600";
      case "PENDING":
        return "text-yellow-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Filled</TableHead>
              <TableHead>Status</TableHead>

              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell
                  className={
                    order.type === "BUY" ? "text-green-600" : "text-red-600"
                  }
                >
                  {order.type}
                </TableCell>
                  <TableCell className="font-semibold text-yellow-600">{order.product.name}</TableCell>
                <TableCell>${order.price}</TableCell>
                <TableCell>{order.volume}</TableCell>
                <TableCell>{order.filled}</TableCell>
                <TableCell className={getStatusColor(order.status)}>
                  {order.status}
                </TableCell>
                
                <TableCell>
                  <div className="flex space-x-2">
                    {/* <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(order)}
                    >
                      {order.status === 'CANCELLED' ? (
                        <RotateCcw className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </Button> */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(order)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>

      <OrderAlert
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title={actionType === "delete" ? "Delete Order" : "Cancel Order"}
        description={
          actionType === "delete"
            ? "Are you sure you want to delete this order? This action cannot be undone."
            : "Are you sure you want to cancel this order?"
        }
        onConfirm={handleConfirm}
        confirmText={actionType === "delete" ? "Delete" : "Cancel"}
      />
    </>
  );
}
