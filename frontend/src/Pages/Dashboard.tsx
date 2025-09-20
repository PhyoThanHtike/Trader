import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetUser, type GetUserResponse } from "@/apiEndpoints/Auth";
import OrdersTable from "@/AppComponents/Dashboard/OrdersTable";
import TradesTable from "@/AppComponents/Dashboard/TradesTable";
import { FinancialChart, OrderStatusChart } from "@/AppComponents/Dashboard/Financial.OrderStatusCharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteOrder } from "@/apiEndpoints/Order";
import { toast } from "sonner";

export default function Dashboard() {
  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await GetUser();
      if (response.success) {
        setUserData(response);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async(orderId:string)=>{
    try {
      console.log("deleting order:", orderId);
      const response = await deleteOrder(orderId);
      if(response.success){
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="w-8 h-8 bg-primary rounded-full"
        />
      </div>
    );
  }

  if (!userData?.success) {
    return <div>Failed to load dashboard data</div>;
  }

  const { orders, tradesAsBuyer, tradesAsSeller } = userData.user;

  return (
    <div className="container mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <CardHeader className="pb-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold mb-4"
          >
            Dashboard Overview
          </motion.h1>
          <p>
            Welcome back, {userData.user.name}! Here's your trading activity
            summary.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              { value: orders.length, label: "Total Orders" },
              { value: tradesAsSeller.length, label: "Trades as Seller" },
              { value: tradesAsBuyer.length, label: "Trades as Buyer" },
              {
                value: `$${orders
                  .filter((o) => o.status === "FILLED")
                  .reduce((sum, o) => sum + o.price * o.filled, 0)}`,
                label: "Total Volume",
              },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.1,
                  ease: "easeOut",
                }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold pb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <FinancialChart orders={orders} tradesAsSeller={tradesAsSeller} />
            <OrderStatusChart orders={orders} />
          </div>

          <div>
            <h1 className="text-2xl py-8 font-semibold">My Recent Orders</h1>
            <OrdersTable orders={orders} onRefresh={fetchUserData} onDelete={onDelete} />
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
