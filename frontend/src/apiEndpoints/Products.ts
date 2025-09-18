import axiosInstance from "@/Axios/axios";
import type { errorResponse } from "./Auth";

interface product {
  productId: string;
  productName: string;
  productImage: string;
  productDescription: string;
  avgPrice: number;
}

export interface allProducts {
  success: boolean;
  message: string;
  products: any;
}

export interface productById {
  success: boolean;
  message: string;
  product: product;
  marketStats: any;
  charts: any;
}

export const GetAllProducts = async (): Promise<allProducts> => {
  try {
    const response = await axiosInstance.get("/api/product/getAllProducts");
    return response.data;
  } catch (error: any) {
    const err: errorResponse = {
      message: error.response?.data?.message || "Failed getting all products",
      success: error.response?.data?.success || false,
    };

    throw new Error(err.message); // ✅ Throw instead of return
  }
};

export const GetProductById = async (productId: string): Promise<productById> => {
  try {
    const response = await axiosInstance.get(`/api/product/getProductById/${productId}`);
    return response.data;
  } catch (error: any) {
    const err: errorResponse = {
      message: error.response?.data?.message || "Failed getting product by id",
      success: error.response?.data?.success || false,
    };

    throw new Error(err.message); // ✅ Throw instead of return
  }
};
