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
