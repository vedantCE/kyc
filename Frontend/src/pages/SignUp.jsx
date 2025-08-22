import { useState, useEffect } from "react";
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
import { Shield, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    panNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    captcha: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 5, num2: 3, answer: 8 });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate a new captcha question
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({
      num1,
      num2,
      answer: num1 + num2
    });
    setFormData(prev => ({ ...prev, captcha: "" }));
  };

  // Check password strength
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.role) {
      toast({
        title: "Error",
        description: "Please select a role",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Validate CAPTCHA
    if (parseInt(formData.captcha) !== captchaQuestion.answer) {
      toast({
        title: "Error",
        description: "CAPTCHA answer is incorrect",
        variant: "destructive",
      });
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("userRole", formData.role);
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem(
        "userName",
        `${formData.firstName} ${formData.lastName}`
      );
      localStorage.setItem("userPAN", formData.panNumber);

      toast({
        title: "Account created!",
        description: "Your account has been successfully created.",
      });

      // Redirect based on role
      if (formData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (formData.role === "bank") {
        navigate("/bank-dashboard");
      } else {
        navigate("/user-onboarding");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Password strength indicator
  const renderPasswordStrength = () => {
    if (!formData.password) return null;
    
    const strengthLabels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Password strength:</span>
          <span className="text-xs font-medium">{strengthLabels[passwordStrength]}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className={`h-1.5 rounded-full ${strengthColors[passwordStrength]}`}
            style={{ width: `${(passwordStrength / 4) * 100}%` }}
          ></div>
        </div>
        {formData.password && (
          <div className="mt-2 text-xs">
            <div className="flex items-center gap-1">
              {formData.password.length >= 8 ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span>At least 8 characters</span>
            </div>
            <div className="flex items-center gap-1">
              {/[A-Z]/.test(formData.password) ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span>One uppercase letter</span>
            </div>
            <div className="flex items-center gap-1">
              {/[0-9]/.test(formData.password) ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
              <span>One number</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                CreditScore
              </h1>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200 mt-1">
                Sign Up Portal
              </span>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Join thousands who trust us with their credit decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="panNumber" className="text-gray-700 font-medium">PAN Number</Label>
                <Input
                  id="panNumber"
                  placeholder="e.g. ABCDE1234F"
                  value={formData.panNumber}
                  onChange={(e) =>
                    handleInputChange("panNumber", e.target.value.toUpperCase())
                  }
                  className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 uppercase"
                  maxLength={10}
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                  title="Please enter a valid PAN number (e.g. ABCDE1234F)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
                  required
                />
              </div>

              {/* Fixed Role Selection - Replaced Select with Radio Group */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Role</Label>
                <div className="grid gap-2 mt-2">
                  <div className="flex items-center space-x-2 p-2 border rounded-md hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      id="user-role"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="user-role" className="text-gray-700 cursor-pointer">Individual User</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-md hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      id="bank-role"
                      name="role"
                      value="bank"
                      checked={formData.role === "bank"}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="bank-role" className="text-gray-700 cursor-pointer">Financial Institution</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-md hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      id="admin-role"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="admin-role" className="text-gray-700 cursor-pointer">Administrator</Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {renderPasswordStrength()}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="captcha" className="text-gray-700 font-medium">
                    Captcha: What is {captchaQuestion.num1} + {captchaQuestion.num2}?
                  </Label>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                <Input
                  id="captcha"
                  placeholder="Enter answer"
                  value={formData.captcha}
                  onChange={(e) => handleInputChange("captcha", e.target.value.replace(/\D/g, ''))}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400"
                  type="number"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-colors" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;