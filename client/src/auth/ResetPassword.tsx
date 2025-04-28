import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LockKeyholeIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/axios";
import { toast } from "sonner";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing. Please use the link from your email.");
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error("Reset token is missing. Please use the link from your email.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        `/user/reset-password`,
        { token, password: newPassword }
      );

      toast.success("✅ Password has been reset successfully!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center gap-2">
              <span role="img" aria-label="error">⚠️</span> Invalid Reset Link
            </h1>
            <p className="text-sm text-gray-600 mt-4">
              {error}
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/forgot-password"
              className="text-sm hover:text-blue-500 hover:underline"
            >
              Request a new reset link
            </Link>
            <span className="mx-2">|</span>
            <Link
              to="/login"
              className="text-sm hover:text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleReset}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center gap-2">
            <span role="img" aria-label="key">🔑</span> Reset Password
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter your new password
          </p>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        <div className="mb-4">
          <div className="relative">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="pl-10 focus-visible:ring-1"
            />
            <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        <div className="mb-10">
          {loading ? (
            <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-orange hover:bg-hoverOrange"
              disabled={!newPassword.trim() || !confirmPassword.trim()}
            >
              Reset Password
            </Button>
          )}
        </div>
        
        <div className="text-center">
          <Link
            to="/login"
            className="text-sm hover:text-blue-500 hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
