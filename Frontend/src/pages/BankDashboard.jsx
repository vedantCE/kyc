import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
  X,
  Check,
  Eye
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Credit Calculator Component
const CreditCalculator = () => {
  // Credit Calculator state
  const [calcLoanAmount, setCalcLoanAmount] = useState("");
  const [calcCreditScore, setCalcCreditScore] = useState("");
  const [calcIncome, setCalcIncome] = useState("");

  // Helper to parse numbers from comma-separated strings
  const parseNum = (v) => {
    const n = Number((v || "").toString().replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  // Multiplier logic based on credit score
  const getMultiplier = (score) => {
    if (score < 300) return 0;
    const s = Math.max(300, Math.min(850, score));
    const base = 0.1; // minimum 10% of yearly income
    const max = 0.6;  // maximum 60% of yearly income
    if (s < 600) return base;
    const scaled = (s - 600) / (850 - 600); // 0..1 between 600-850
    return base + Math.max(0, Math.min(1, scaled)) * (max - base);
  };

  // Estimate approved loan amount
  const estimateApproved = () => {
    const loan = parseNum(calcLoanAmount);
    const score = parseNum(calcCreditScore);
    const income = parseNum(calcIncome);
    const cap = income * getMultiplier(score);
    return Math.max(0, Math.min(loan || 0, Math.floor(cap)));
  };

  // Format number as INR currency
  const formatINR = (n) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(n);

  const approvedAmount = estimateApproved();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-8 border border-blue-200/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Loan Amount
            </label>
            <Input
              type="text"
              value={calcLoanAmount}
              onChange={(e) => setCalcLoanAmount(e.target.value)}
              placeholder="₹ Enter desired loan"
              className="bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 transition-all duration-200 text-lg font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Credit Score
            </label>
            <Input
              type="text"
              value={calcCreditScore}
              onChange={(e) => setCalcCreditScore(e.target.value)}
              placeholder="300 - 850"
              className="bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 transition-all duration-200 text-lg font-medium"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Yearly Income
            </label>
            <Input
              type="text"
              value={calcIncome}
              onChange={(e) => setCalcIncome(e.target.value)}
              placeholder="₹ Annual income"
              className="bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400 transition-all duration-200 text-lg font-medium"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 text-center">
          <h3 className="text-white text-sm font-medium mb-2 opacity-90">
            Estimated Loan Approval
          </h3>
          <div className="text-white text-3xl font-bold">
            {formatINR(approvedAmount)}
          </div>
        </div>
      </div>
    </div>
  );
};

// Rejection Form Component
const RejectionForm = ({ application, onClose, onConfirm }) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [showCustomReason, setShowCustomReason] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const rejectionReasons = [
    "Low credit score / poor credit history",
    "Insufficient income to cover EMI",
    "High existing debt (debt-to-income ratio)",
    "Unstable employment or business",
    "Incomplete or incorrect documents",
    "Poor banking habits (cheque bounces, overdrafts, etc.)",
    "Unverifiable or fake information",
    "Low collateral value (for secured loans)",
    "Age factor (too young / nearing retirement)",
    "High-risk or restricted location",
    "Other (please specify)"
  ];

  const handleReasonSelect = (reason) => {
    setRejectionReason(reason);
    setShowCustomReason(reason === "Other (please specify)");
    setShowDropdown(false);
    if (reason !== "Other (please specify)") {
      setCustomReason("");
    }
  };

  const handleSubmit = () => {
    const finalReason = rejectionReason === "Other (please specify)" ? customReason : rejectionReason;
    if (finalReason.trim()) {
      onConfirm(application.id, finalReason);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reject Application</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Application ID:</span> {application.id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Customer:</span> {application.customerName}
          </p>
        </div>
        
        <div className="space-y-4 mb-4">
          <div className="relative">
            <label className="text-sm font-medium block mb-1">Reason for Rejection</label>
            <div 
              className="flex items-center justify-between w-full p-2 border border-gray-300 rounded-md cursor-pointer bg-white"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className={rejectionReason ? "text-gray-800" : "text-gray-500"}>
                {rejectionReason || "Select a reason"}
              </span>
              <svg 
                className={`h-4 w-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {showDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {rejectionReasons.map((reason) => (
                  <div
                    key={reason}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleReasonSelect(reason)}
                  >
                    {reason}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {showCustomReason && (
            <div>
              <label className="text-sm font-medium block mb-1">Specify Reason</label>
              <Textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please provide the reason for rejection..."
                rows={3}
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-red-500 hover:bg-red-600"
            disabled={!rejectionReason || (rejectionReason === "Other (please specify)" && !customReason.trim())}
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ application, onClose, onConfirm }) => {
  const [reviewNotes, setReviewNotes] = useState("");

  const handleSubmit = () => {
    if (reviewNotes.trim()) {
      onConfirm(application.id, reviewNotes);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Review Application</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Application ID: <span className="font-medium">{application.id}</span>
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Customer: <span className="font-medium">{application.customerName}</span>
        </p>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Review Notes</label>
            <Textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add your review notes here..."
              className="mt-1"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!reviewNotes.trim()}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success Animation Component
const SuccessAnimation = ({ message, onClose, isRejection = false }) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg text-center max-w-md shadow-xl border border-gray-200">
        <div className={`w-16 h-16 ${isRejection ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {isRejection ? (
            <XCircle className="h-8 w-8 text-red-600" />
          ) : (
            <Check className="h-8 w-8 text-green-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{isRejection ? 'Rejected!' : 'Success!'}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600">
          Continue
        </Button>
      </div>
    </div>
  );
};

const BankDashboard = () => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState("");
  const [applications, setApplications] = useState([
    {
      id: "LA2024001",
      customerName: "Rajesh Kumar",
      loanType: "Personal Loan",
      amount: "₹5,00,000",
      creditScore: 742,
      riskLevel: "Low",
      status: "Pending",
      appliedDate: "2024-08-08",
      customerEmail: "rajesh@example.com"
    },
    {
      id: "LA2024002",
      customerName: "Priya Sharma",
      loanType: "Home Loan",
      amount: "₹25,00,000",
      creditScore: 789,
      riskLevel: "Low",
      status: "Approved",
      appliedDate: "2024-08-07",
      customerEmail: "priya@example.com"
    },
    {
      id: "LA2024003",
      customerName: "Amit Patel",
      loanType: "Car Loan",
      amount: "₹8,00,000",
      creditScore: 658,
      riskLevel: "Medium",
      status: "Under Review",
      appliedDate: "2024-08-08",
      customerEmail: "amit@example.com"
    },
    {
      id: "LA2024004",
      customerName: "Sunita Reddy",
      loanType: "Business Loan",
      amount: "₹12,00,000",
      creditScore: 695,
      riskLevel: "Medium",
      status: "Approved",
      appliedDate: "2024-08-06",
      customerEmail: "sunita@example.com"
    },
    {
      id: "LA2024005",
      customerName: "Vikash Singh",
      loanType: "Personal Loan",
      amount: "₹3,00,000",
      creditScore: 591,
      riskLevel: "High",
      status: "Rejected",
      appliedDate: "2024-08-05",
      customerEmail: "vikash@example.com"
    },
    {
      id: "LA2024006",
      customerName: "Neha Gupta",
      loanType: "Education Loan",
      amount: "₹7,50,000",
      creditScore: 710,
      riskLevel: "Low",
      status: "Pending",
      appliedDate: "2024-08-10",
      customerEmail: "neha@example.com"
    },
    {
      id: "LA2024007",
      customerName: "Rahul Malhotra",
      loanType: "Home Loan",
      amount: "₹35,00,000",
      creditScore: 625,
      riskLevel: "Medium",
      status: "Under Review",
      appliedDate: "2024-08-09",
      customerEmail: "rahul@example.com"
    },
    {
      id: "LA2024008",
      customerName: "Sanjay Verma",
      loanType: "Business Loan",
      amount: "₹18,00,000",
      creditScore: 680,
      riskLevel: "Medium",
      status: "Pending",
      appliedDate: "2024-08-11",
      customerEmail: "sanjay@example.com"
    },
    {
      id: "LA2024009",
      customerName: "Anjali Desai",
      loanType: "Personal Loan",
      amount: "₹4,50,000",
      creditScore: 580,
      riskLevel: "High",
      status: "Rejected",
      appliedDate: "2024-08-07",
      customerEmail: "anjali@example.com"
    },
    {
      id: "LA2024010",
      customerName: "Mohammed Khan",
      loanType: "Car Loan",
      amount: "₹9,00,000",
      creditScore: 730,
      riskLevel: "Low",
      status: "Approved",
      appliedDate: "2024-08-12",
      customerEmail: "mohammed@example.com"
    }
  ]);
  const [rejectingApplication, setRejectingApplication] = useState(null);
  const [reviewingApplication, setReviewingApplication] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRejectionSuccess, setIsRejectionSuccess] = useState(false);
  const bankEmail = "bank@demo.com";

  const handleLogout = () => {
    navigate("/signin");
  };
  
  // Mock bank data
  const totalUsers = 15420;
  const totalApplications = 2847;
  const approvalRate = 73.5;

  const riskDistribution = [
    { name: 'Low Risk', value: 65, color: 'hsl(142 76% 36%)' },
    { name: 'Medium Risk', value: 25, color: 'hsl(38 92% 50%)' },
    { name: 'High Risk', value: 10, color: 'hsl(0 84.2% 60.2%)' }
  ];

  const bureauStatus = [
    { name: "CIBIL", status: "Active", responseTime: "120ms", lastUpdate: "2 min ago", color: "success" },
    { name: "Experian", status: "Active", responseTime: "95ms", lastUpdate: "1 min ago", color: "success" },
    { name: "Equifax", status: "Warning", responseTime: "450ms", lastUpdate: "5 min ago", color: "warning" },
    { name: "CRIF", status: "Active", responseTime: "180ms", lastUpdate: "3 min ago", color: "success" }
  ];

  const monthlyData = [
    { month: 'Jan', applications: 180, approvals: 132 },
    { month: 'Feb', applications: 220, approvals: 165 },
    { month: 'Mar', applications: 195, approvals: 145 },
    { month: 'Apr', applications: 240, approvals: 180 },
    { month: 'May', applications: 285, approvals: 215 },
    { month: 'Jun', applications: 310, approvals: 225 },
    { month: 'Jul', applications: 275, approvals: 205 },
    { month: 'Aug', applications: 290, approvals: 218 }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200">Approved</Badge>;
      case "Rejected":
        return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Rejected</Badge>;
      case "Pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200">Pending</Badge>;
      case "Under Review":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Low</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      case "High":
        return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getBureauStatusIndicator = (status, color) => {
    const icons = {
      success: <CheckCircle className="h-4 w-4 text-green-600" />,
      warning: <AlertCircle className="h-4 w-4 text-yellow-600" />,
      error: <XCircle className="h-4 w-4 text-red-600" />
    };
    return icons[color] || <Clock className="h-4 w-4 text-gray-400" />;
  };

  const filteredApplications = applications.filter(app => 
    app.customerName.toLowerCase().includes(searchUser.toLowerCase()) ||
    app.customerEmail.toLowerCase().includes(searchUser.toLowerCase()) ||
    app.id.toLowerCase().includes(searchUser.toLowerCase())
  );

  const handleReview = (applicationId, reviewNotes) => {
    // Update application status to "Under Review" and add review notes
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? {...app, status: "Under Review", reviewNotes} : app
    ));
    
    setSuccessMessage("Application has been reviewed successfully");
    setShowSuccess(true);
    setIsRejectionSuccess(false);
  };

  const handleApprove = (applicationId) => {
    // Update application status to "Approved"
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? {...app, status: "Approved"} : app
    ));
    
    setSuccessMessage("Application approved successfully!");
    setShowSuccess(true);
    setIsRejectionSuccess(false);
  };

  const handleReject = (applicationId, reason) => {
    // Update application status to "Rejected" with reason
    setApplications(prev => prev.map(app => 
      app.id === applicationId ? {...app, status: "Rejected", rejectionReason: reason} : app
    ));
    
    setSuccessMessage("Application rejected successfully");
    setShowSuccess(true);
    setIsRejectionSuccess(true);
  };

  const openRejectionForm = (application) => {
    setRejectingApplication(application);
  };

  const closeRejectionForm = () => {
    setRejectingApplication(null);
  };

  const openReviewForm = (application) => {
    setReviewingApplication(application);
  };

  const closeReviewForm = () => {
    setReviewingApplication(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CreditScore Pro
                </h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">Bank Portal</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-semibold text-gray-800">{bankEmail}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all duration-300"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Users</CardTitle>
              <Users className="h-6 w-6 text-blue-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalUsers.toLocaleString()}</div>
              <p className="text-xs text-blue-100 mt-2">
                📈 +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Applications</CardTitle>
              <FileText className="h-6 w-6 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalApplications.toLocaleString()}</div>
              <p className="text-xs text-emerald-100 mt-2">
                📊 +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Approval Rate</CardTitle>
              <TrendingUp className="h-6 w-6 text-purple-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{approvalRate}%</div>
              <p className="text-xs text-purple-100 mt-2">
                ⬆️ +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg p-1 rounded-xl">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200">Overview</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200">Applications</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200">Analytics</TabsTrigger>
            <TabsTrigger value="bureau" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200">Bureau Status</TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white rounded-lg transition-all duration-200">Credit Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Risk Assessment Distribution
                  </CardTitle>
                  <CardDescription>Customer risk levels across portfolio</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-emerald-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    Monthly Applications vs Approvals
                  </CardTitle>
                  <CardDescription>Trend analysis of loan processing</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="applications" fill="hsl(214 95% 25%)" name="Applications" />
                        <Bar dataKey="approvals" fill="hsl(142 76% 36%)" name="Approvals" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      Loan Applications
                    </CardTitle>
                    <CardDescription>Manage and review loan applications</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700">Application ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                        <TableHead className="font-semibold text-gray-700">Loan Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-700">Credit Score</TableHead>
                        <TableHead className="font-semibold text-gray-700">Risk</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applied On</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredApplications.map((app) => (
                        <TableRow key={app.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                          <TableCell className="font-medium text-blue-600">{app.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {app.customerName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">{app.customerName}</div>
                                <div className="text-sm text-gray-500">{app.customerEmail}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{app.loanType}</TableCell>
                          <TableCell className="font-semibold text-green-600">{app.amount}</TableCell>
                          <TableCell>
                            <Badge className={`${app.creditScore >= 750 ? "bg-green-100 text-green-700" : app.creditScore >= 650 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"} font-bold`}>
                              {app.creditScore}
                            </Badge>
                          </TableCell>
                          <TableCell>{getRiskBadge(app.riskLevel)}</TableCell>
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-gray-600">{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                                onClick={() => openReviewForm(app)}
                              >
                                <Eye className="h-4 w-4 mr-1" /> Review
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleApprove(app.id)}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => openRejectionForm(app)}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Application Trends
                  </CardTitle>
                  <CardDescription>Monthly application and approval trends</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="applications" fill="hsl(214 95% 25%)" name="Applications" />
                        <Bar dataKey="approvals" fill="hsl(142 76% 36%)" name="Approvals" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50 border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Bureau Connectivity
                  </CardTitle>
                  <CardDescription>API response time and status</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {bureauStatus.map((bureau) => (
                      <div key={bureau.name} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                        <div className="flex items-center space-x-4">
                          {getBureauStatusIndicator(bureau.status, bureau.color)}
                          <div>
                            <div className="font-semibold text-gray-800">{bureau.name}</div>
                            <div className="text-sm text-gray-600">
                              {bureau.status} • ⚡ {bureau.responseTime} • 🕐 Updated {bureau.lastUpdate}
                            </div>
                          </div>
                        </div>
                        <Badge className={`${bureau.color === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} font-medium`}>
                          {bureau.color === 'success' ? '✅ Healthy' : '⚠️ Warning'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bureau">
            <Card className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-purple-50 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  Credit Bureau 
                  Status
                </CardTitle>
                <CardDescription>Monitor credit bureau connectivity</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4">
                  {bureauStatus.map((bureau) => (
                    <div key={bureau.name} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                      <div className="flex items-center space-x-4">
                        {getBureauStatusIndicator(bureau.status, bureau.color)}
                        <div>
                          <div className="font-semibold text-gray-800">{bureau.name}</div>
                          <div className="text-sm text-gray-600">
                            {bureau.status} • ⚡ {bureau.responseTime} • 🕐 Updated {bureau.lastUpdate}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${bureau.color === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} font-medium`}>
                        {bureau.color === 'success' ? '✅ Healthy' : '⚠️ Warning'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calculator">
            <CreditCalculator />
          </TabsContent>
        </Tabs>
      </div>

      {/* Rejection Form Modal */}
      {rejectingApplication && (
        <RejectionForm 
          application={rejectingApplication} 
          onClose={closeRejectionForm}
          onConfirm={handleReject}
        />
      )}

      {/* Review Form Modal */}
      {reviewingApplication && (
        <ReviewForm 
          application={reviewingApplication} 
          onClose={closeReviewForm}
          onConfirm={handleReview}
        />
      )}

      {/* Success Animation Modal */}
      {showSuccess && (
        <SuccessAnimation 
          message={successMessage}
          onClose={() => setShowSuccess(false)}
          isRejection={isRejectionSuccess}
        />
      )}
    </div>
  );
};
export default BankDashboard;
