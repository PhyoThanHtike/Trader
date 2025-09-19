import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GetUser, type GetUserResponse } from "@/apiEndpoints/Auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Save, X } from "lucide-react";

export default function UserProfile() {
  const [userData, setUserData] = useState<GetUserResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await GetUser();
      if (response.success) {
        setUserData(response);
        setFormData({
          name: response.user.name,
          email: response.user.email,
          password: "",
          profilePicture: response.user.profilePicture,
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving data:", formData);
      setIsEditing(false);
      await fetchUserData();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (userData?.success) {
      setFormData({
        name: userData.user.name,
        email: userData.user.email,
        password: "",
        profilePicture: userData.user.profilePicture,
      });
    }
    setIsEditing(false);
  };

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
    return <div>Failed to load user data</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="shadow-lg">
          <CardHeader className="flex justify-between items-center">
            <div>
              {/* Bigger title to match dashboard titles */}
              <CardTitle className="text-4xl font-bold">
                Profile Information
              </CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </div>
            {!isEditing ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="transition-all"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </motion.div>
            ) : (
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </motion.div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-col items-center space-y-4"
            >
              <Avatar className="w-24 h-24 shadow-md">
                <AvatarImage src={formData.profilePicture} />
                <AvatarFallback>
                  {userData.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="w-full max-w-sm">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={formData.profilePicture}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        profilePicture: e.target.value,
                      })
                    }
                    placeholder="Enter image URL"
                  />
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.1 },
                },
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { id: "name", label: "Name", type: "text", value: formData.name },
                { id: "email", label: "Email", type: "email", value: formData.email },
                {
                  id: "password",
                  label: "New Password",
                  type: "password",
                  value: formData.password,
                  placeholder: "Leave blank to keep current password",
                },
                {
                  id: "role",
                  label: "Role",
                  type: "text",
                  value: userData.user.role,
                  disabled: true,
                },
              ].map((field) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    type={field.type}
                    value={field.value}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    disabled={field.disabled || !isEditing}
                    placeholder={field.placeholder}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            >
              <Label htmlFor="createdAt">Member Since</Label>
              <Input
                id="createdAt"
                value={new Date(userData.user.createdAt).toLocaleDateString()}
                disabled
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
