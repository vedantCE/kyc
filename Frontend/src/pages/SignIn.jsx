import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (email.includes("admin")) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userEmail", email);
        navigate("/admin-dashboard");
      } else if (email.includes("bank")) {
        localStorage.setItem("userRole", "bank");
        localStorage.setItem("userEmail", email);
        navigate("/bank-dashboard");
      } else {
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userEmail", email);
        navigate("/user-dashboard");
      }

      toast({
        title: "Welcome back!",
        description: "You have been successfully signed in.",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white-50 via-blue-50 to-blue-50 flex items-center justify-center p-6"
      style={{ backdropFilter: "#ffffff" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-700 hover:text-blue-500 transition-colors"
          >
            {/* <Shield className="bg-white-500 text-blue-700 border-blue-200 mt-1"/> */}
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  CreditScore
                </h1>
              </div>
            </div>
          </Link>
        </div>

        <Card className="bg-white border border-blue-200 shadow-lg rounded-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-semibold text-blue-600">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-blue-500 mt-1">
              Sign in to access your credit dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-blue-700 font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-blue-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-300 focus:border-blue-500 focus:ring-blue-300"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 focus-visible:ring-blue-800 text-white-600 "
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-7 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="mt-5 p-4 bg-sky-100 rounded-lg text-sm text-blue-800">
              <p className="font-semibold mb-2 text-blue-700">Demo Accounts:</p>
              <p>
                User: <span className="font-medium">user@demo.com</span>
              </p>
              <p>
                Bank: <span className="font-medium">bank@demo.com</span>
              </p>
              <p>
                Admin: <span className="font-medium">admin@demo.com</span>
              </p>
              <p className="mt-2 text-xs">Password: any password</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
