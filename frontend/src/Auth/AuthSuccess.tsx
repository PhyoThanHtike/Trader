// AuthSuccess.tsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/UserSlice";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
}

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const processAuth = async () => {
      try {
        const userData: UserData = {
          id: searchParams.get("id") || "",
          name: searchParams.get("name") || "",
          email: searchParams.get("email") || "",
          profilePicture: searchParams.get("profilePicture") || "",
          role: searchParams.get("role") || "USER",
        };

        console.log("Google Auth Success:", userData);

        // Validate required fields
        if (!userData.id || !userData.email) {
          throw new Error("Invalid authentication data");
        }

        // Dispatch to Redux store
        dispatch(
          setUser({
            userId: userData.id,
            userName: userData.name,
            email: userData.email,
            role: userData.role,
            profilePicture: userData.profilePicture,
          })
        );

        toast.success("Welcome back! Google login successful");

        // Redirect to home after short delay
        setTimeout(() => navigate("/"), 1000);
      } catch (err) {
        setError("Authentication failed. Please try again.");
        toast.error("Google login failed");
        setTimeout(() => navigate("/auth"), 2000);
      } finally {
        setLoading(false);
      }
    };

    processAuth();
  }, [searchParams, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing login...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthSuccess;
