import { GetUser, type GetUserResponse } from "@/apiEndpoints/Auth";
import TradesTable from "@/AppComponents/Dashboard/TradesTable";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const History = () => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!userData?.success) {
    return <div>Failed to load dashboard data</div>;
  }

  const { tradesAsBuyer, tradesAsSeller } = userData.user;
  return (
    <>
      <div className="container mx-auto p-6">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-3xl font-bold mb-4"
        >
          Trade History
        </motion.h1>

        <TradesTable trades={[...tradesAsBuyer, ...tradesAsSeller]} />
      </div>
    </>
  );
};

export default History;
