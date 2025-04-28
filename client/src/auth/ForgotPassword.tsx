import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/axios";
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post(
        "/user/forgot-password",
        { email: email.trim() }
      );
      setSubmitted(true);
      toast.success("📬 Password reset link sent to your email.");
    } catch (err: any) {
      console.error("Forgot password error:", err?.response?.data || err.message);
      toast.error(err?.response?.data?.message || "Something went wrong. Check your email and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4 text-center">
          <div className="mb-6">
            <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center gap-2">
              <span role="img" aria-label="mail">📬</span> Check Your Email
            </h1>
            <p className="text-sm text-gray-600 mt-4">
              We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-sm hover:text-blue-500 hover:underline"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
      >
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-orange-500 tracking-wide flex items-center justify-center gap-2">
            <span role="img" aria-label="key">🔑</span> Reset Password
          </h1>
          <p className="text-sm text-gray-600 mt-2">Enter your email address to reset your password</p>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="pl-10 focus-visible:ring-1"
            />
            <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="mb-10">
          {loading ? (
            <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-orange hover:bg-hoverOrange"
              disabled={!email.trim()}
            >
              Send Reset Link
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

export default ForgotPassword;
