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
    }
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
    const response = await axiosInstance.post("api/auth/logout", {
      withCredentials: true,
    });
    store.dispatch(setLogOutUser());
    window.location.href = "/auth";
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to sign out");
  }
};
