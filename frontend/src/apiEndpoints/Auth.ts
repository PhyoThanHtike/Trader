import axiosInstance from "@/Axios/axios";
import { setLogOutUser } from "@/store/slices/UserSlice";
import store from "@/store/Store";

interface loginData {
  email: String;
  password: String;
}

interface signupData {
  name: string;
  email: string;
  password: string;
}

export interface loginResponse {
  success: boolean;
  message: string;
  user: any;
}
export interface errorResponse {
  success: boolean;
  message: string;
}
export interface GetUserResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    googleId: string | null;
    profilePicture: string;
    createdAt: string;
    orders: Array<{
      id: string;
      type: "SELL" | "BUY";
      price: number;
      volume: number;
      filled: number;
      status: "FILLED" | "PENDING" | "CANCELLED" | "PARTIALLY_FILLED" | string;
      createdAt: string;
      userId: string;
      productId: string;
      product: any;
    }>;
    tradesAsBuyer: Array<{
      id: number;
      price: number;
      volume: number;
      createdAt: string;
      buyerId: string;
      sellerId: string;
      productId: string;
      product: any;
      seller: any;
      buyer: any;
    }>;
    tradesAsSeller: Array<{
      id: number;
      price: number;
      volume: number;
      createdAt: string;
      buyerId: string;
      sellerId: string;
      productId: string;
      product: any;
      seller: any;
      buyer: any;
    }>;
  };
}

export const Login = async (
  credentials: loginData
): Promise<loginResponse | errorResponse> => {
  try {
    console.log("Credentials: ", credentials);
    const response = await axiosInstance.post("/api/auth/login", credentials);
    return response.data;
  } catch (error: any) {
    return {
      message: error.response.data.message || "Login failed",
      success: error.response.data.success || false,
    };
  }
};

export const SignUp = async (
  credentials: signupData
): Promise<loginResponse | errorResponse> => {
  try {
    const response = await axiosInstance.post("/api/auth/signup", credentials);
    return response.data;
  } catch (error: any) {
    // The request was made and the server responded with a status code
    return {
      message: error.response.data.message || "Signup failed",
      success: error.response.data.status || false,
    };
  }
};

export const SignOut = async () => {
  try {
    const response = await axiosInstance.post("/api/auth/logout", {
      withCredentials: true,
    });
    store.dispatch(setLogOutUser());
    window.location.href = "/auth";
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to sign out");
  }
};

export const GetUser = async (): Promise<GetUserResponse> => {
  try {
    const response = await axiosInstance.get("/api/auth/getUser");
    return response.data;
  } catch (error: any) {
    const err: errorResponse = {
      message: error.response?.data?.message || "Failed getting all user info",
      success: error.response?.data?.success || false,
    };

    throw new Error(err.message); // ✅ Throw instead of return
  }
};
