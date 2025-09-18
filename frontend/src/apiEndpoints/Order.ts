import axiosInstance from "@/Axios/axios";
import type { errorResponse } from "./Auth";

export interface orderData {
  type: "BUY" | "SELL";
  price: number;
  volume: number;
  productId: string;
}

export interface orderResponse {
  success: boolean;
  message: string;
  order: any;
  trades: any;
}

export interface order {
  id: string;
  type: string;
  price: number;
  volume: number;
  filled: number;
  status: "PENDING" | "FILLED" | "PARTIALLY_FILLED" | "CANCELLED";
  createdAt: string;
  userId: string;
  productId: string;
  product: product;
}

export interface product {
  name: string;
  image: string;
}

export interface userOrders {
  success: boolean;
  message: string;
  orders: order[];
}

export const GetUserOrders = async (): Promise<userOrders> => {
  try {
    const response = await axiosInstance.get("/api/order/getUserOrders");
    return response.data;
  } catch (error: any) {
    const err: errorResponse = {
      message: error.response?.data?.message || "Failed to place order",
      success: error.response?.data?.success || false,
    };

    throw new Error(err.message);
  }
};

export const PlaceOrder = async (
  orderData: orderData
): Promise<orderResponse> => {
  try {
    const response = await axiosInstance.post(
      "/api/order/placeOrder",
      orderData
    );
    return response.data;
  } catch (error: any) {
    const err: errorResponse = {
      message: error.response?.data?.message || "Failed to place order",
      success: error.response?.data?.success || false,
    };

    throw new Error(err.message);
  }
};


