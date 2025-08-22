vimport { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  CheckCircle, 
  Eye,
  Shield,
  Search,
  TrendingUp,
  Activity,
  Database,
  Server,
  Globe,
  BarChart3
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const [searchUser, setSearchUser] = useState("");
  const [searchScore, setSearchScore] = useState("");
  const adminEmail = "admin@demo.com";
  
  // Mock admin data
  const totalCustomers = 45267;
  const totalLoansApproved = 8934;
  const websiteVisits = 127543;

  const customers = [
    {
      id: "USR001",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      creditScore: 742,
      riskLevel: "Low",
      joinDate: "2024-01-15",
      status: "Active",
      totalLoans: 2,
      city: "Mumbai"
    },
    {
      id: "USR002",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      creditScore: 789,
      riskLevel: "Low",
      joinDate: "2024-02-20",
      status: "Active",
      totalLoans: 1,
      city: "Delhi"
    },
    {
      id: "USR003",
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 21098",
      creditScore: 658,
      riskLevel: "Medium",
      joinDate: "2024-03-10",
      status: "Active",
      totalLoans: 3,
      city: "Ahmedabad"
    },
    {
      id: "USR004",
      name: "Sunita Reddy",
      email: "sunita@example.com",
      phone: "+91 65432 10987",
      creditScore: 695,
      riskLevel: "Medium",
      joinDate: "2024-01-28",
      status: "Active",
      totalLoans: 1,
      city: "Hyderabad"
    },
    {
      id: "USR005",
      name: "Vikash Singh",
      email: "vikash@example.com",
      phone: "+91 54321 09876",
      creditScore: 591,
      riskLevel: "High",
      joinDate: "2024-04-05",
      status: "Suspended",
      totalLoans: 0,
      city: "Patna"
    },
    {
      id: "USR006",
      name: "Anita Gupta",
      email: "anita@example.com",
      phone: "+91 43210 98765",
      creditScore: 823,
      riskLevel: "Low",
      joinDate: "2024-02-14",
      status: "Active",
      totalLoans: 4,
      city: "Pune"
    }
  ];

  const banks = [
    {
      id: "BNK001",
      name: "HDFC Bank",
      email: "hdfc@bank.com",
      totalCustomers: 12450,
      totalApplications: 2847,
      approvalRate: 73.5,
      status: "Active",
      apiCalls: 15420,
      lastActive: "2 min ago"
    },
    {
      id: "BNK002",
      name: "State Bank of India",
      email: "sbi@bank.com",
      totalCustomers: 18920,
      totalApplications: 4235,
      approvalRate: 68.2,
      status: "Active",
      apiCalls: 22890,
      lastActive: "1 min ago"
    },
    {
      id: "BNK003",
      name: "ICICI Bank",
      email: "icici@bank.com",
      totalCustomers: 9870,
      totalApplications: 1892,
      approvalRate: 75.8,
      status: "Active",
      apiCalls: 11240,
      lastActive: "5 min ago"
    },
    {
      id: "BNK004",
      name: "Axis Bank",
      email: "axis@bank.com",
      totalCustomers: 7650,
      totalApplications: 1456,
      approvalRate: 71.3,
      status: "Active",
      apiCalls: 8970,
      lastActive: "3 min ago"
    }
  ];

  const websiteAnalytics = [
    { date: '2024-08-01', visits: 4200, newUsers: 320, bounceRate: 42 },
    { date: '2024-08-02', visits: 4800, newUsers: 380, bounceRate: 38 },
    { date: '2024-08-03', visits: 4100, newUsers: 290, bounceRate: 45 },
    { date: '2024-08-04', visits: 5200, newUsers: 420, bounceRate: 35 },
    { date: '2024-08-05', visits: 5800, newUsers: 480, bounceRate: 32 },
    { date: '2024-08-06', visits: 6200, newUsers: 520, bounceRate: 28 },
    { date: '2024-08-07', visits: 5900, newUsers: 450, bounceRate: 30 },
    { date: '2024-08-08', visits: 6400, newUsers: 580, bounceRate: 26 }
  ];

  const systemMetrics = [
    { metric: "Server Uptime", value: "99.95%", status: "success" },
    { metric: "API Response Time", value: "180ms", status: "success" },
    { metric: "Database Health", value: "Optimal", status: "success" },
    { metric: "Error Rate", value: "0.02%", status: "success" },
    { metric: "Memory Usage", value: "67%", status: "warning" },
    { metric: "CPU Usage", value: "45%", status: "success" }
  ];

  // Add this data after the existing mock data
const bankRecoveryData = [
  {
    bank: "SBI",
    recovered2020: 1245,
    recovered2021: 1356,
    recovered2022: 1520,
    recovered2023: 1680,
    recovered2024: 920
  },
  {
    bank: "HDFC",
    recovered2020: 980,
    recovered2021: 1120,
    recovered2022: 1250,
    recovered2023: 1420,
    recovered2024: 780
  },
  {
    bank: "ICICI",
    recovered2020: 845,
    recovered2021: 920,
    recovered2022: 1080,
    recovered2023: 1210,
    recovered2024: 650
  },
  {
    bank: "Axis",
    recovered2020: 720,
    recovered2021: 810,
    recovered2022: 890,
    recovered2023: 950,
    recovered2024: 520
  },
  {
    bank: "BoB",
    recovered2020: 620,
    recovered2021: 680,
    recovered2022: 750,
    recovered2023: 820,
    recovered2024: 450
  }
];

const bankRankings = [
  {
    id: "1",
    name: "State Bank of India",
    totalRecovered: 6721,
    npaRatio: 4.5,
    recoveryRate: 82.4,
    primarySource: "Corporate Loans"
  },
  {
    id: "2",
    name: "HDFC Bank",
    totalRecovered: 5550,
    npaRatio: 3.2,
    recoveryRate: 85.7,
    primarySource: "Retail Loans"
  },
  {
    id: "3",
    name: "ICICI Bank",
    totalRecovered: 4705,
    npaRatio: 4.8,
    recoveryRate: 79.6,
    primarySource: "Business Loans"
  },
  {
    id: "4",
    name: "Axis Bank",
    totalRecovered: 3890,
    npaRatio: 5.2,
    recoveryRate: 76.8,
    primarySource: "Personal Loans"
  },
  {
    id: "5",
    name: "Bank of Baroda",
    totalRecovered: 3320,
    npaRatio: 6.1,
    recoveryRate: 72.3,
    primarySource: "Agriculture Loans"
  },
  {
    id: "6",
    name: "Kotak Mahindra",
    totalRecovered: 2850,
    npaRatio: 4.2,
    recoveryRate: 81.5,
    primarySource: "MSME Loans"
  }
];

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchUser.toLowerCase()) ||
    customer.phone.includes(searchUser)
  );

  const filteredByScore = searchScore ? 
    filteredCustomers.filter(customer => 
      customer.creditScore.toString().includes(searchScore)
    ) : filteredCustomers;

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">🟢 Low Risk</Badge>;
      case "Medium":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">🟡 Medium Risk</Badge>;
      case "High":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">🔴 High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">✅ Active</Badge>;
      case "Suspended":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">⛔ Suspended</Badge>;
      case "Pending":
        return <Badge className="bg-sky-100 text-sky-700 border-sky-200">⏳ Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMetricBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">✅ Healthy</Badge>;
      case "warning":
        return <Badge className="bg-sky-100 text-sky-700 border-sky-200">⚠ Warning</Badge>;
      case "error":
        return <Badge className="bg-slate-100 text-slate-700 border-slate-200">🚨 Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-sky-100">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                  CreditScore Pro
                </h1>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 mt-1">Admin Portal</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">Super Admin</p>
                <p className="text-sm font-semibold text-slate-800">{adminEmail}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300"
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Customers</CardTitle>
              <Users className="h-6 w-6 text-blue-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalCustomers.toLocaleString()}</div>
              <p className="text-xs text-blue-100 mt-2">
                📊 +18% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Loans Approved</CardTitle>
              <CheckCircle className="h-6 w-6 text-emerald-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalLoansApproved.toLocaleString()}</div>
              <p className="text-xs text-emerald-100 mt-2">
                 +23% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-sky-600 to-sky-700 text-white border-0 shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sky-100">Website Visits</CardTitle>
              <Eye className="h-6 w-6 text-sky-200" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{websiteVisits.toLocaleString()}</div>
              <p className="text-xs text-sky-100 mt-2">
                📈 +31% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Tabs defaultValue="customers" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl p-1 rounded-xl">
            <TabsTrigger value="customers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Customer Management</TabsTrigger>
            <TabsTrigger value="banks" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Bank Performance</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Fund Analytics</TabsTrigger>
            <TabsTrigger value="lookup" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200">Credit Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-800">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      Customer Management
                    </CardTitle>
                    <CardDescription>Search and manage all platform users</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search customers..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="pl-10 w-64 bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 transition-all duration-200"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                      📥 Export Data
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Customer ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Name & Contact</TableHead>
                      <TableHead className="font-semibold text-slate-700">Credit Score</TableHead>
                      <TableHead className="font-semibold text-slate-700">Risk Level</TableHead>
                      <TableHead className="font-semibold text-slate-700">Total Loans</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Join Date</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredByScore.map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium text-blue-700">{customer.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {customer.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{customer.name}</div>
                              <div className="text-sm text-slate-500">📧 {customer.email}</div>
                              <div className="text-sm text-slate-500">📱 {customer.phone}</div>
                              <div className="text-sm text-blue-600">📍 {customer.city}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-bold ${
                            customer.creditScore >= 750 ? 'bg-emerald-100 text-emerald-700' : 
                            customer.creditScore >= 650 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {customer.creditScore}
                          </Badge>
                        </TableCell>
                        <TableCell>{getRiskBadge(customer.riskLevel)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-semibold border-blue-200 text-blue-700">
                            💳 {customer.totalLoans}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell className="text-slate-600">📅 {customer.joinDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                              👁 View
                            </Button>
                            <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100">
                              ✏ Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="banks">
            <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  Bank Performance Overview
                </CardTitle>
                <CardDescription>Monitor partner bank performance and statistics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Bank ID</TableHead>
                      <TableHead className="font-semibold text-slate-700">Bank Details</TableHead>
                      <TableHead className="font-semibold text-slate-700">Customers</TableHead>
                      <TableHead className="font-semibold text-slate-700">Applications</TableHead>
                      <TableHead className="font-semibold text-slate-700">Approval Rate</TableHead>
                      <TableHead className="font-semibold text-slate-700">API Calls</TableHead>
                      <TableHead className="font-semibold text-slate-700">Status</TableHead>
                      <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banks.map((bank) => (
                      <TableRow key={bank.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                        <TableCell className="font-medium text-blue-700">{bank.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {bank.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">🏦 {bank.name}</div>
                              <div className="text-sm text-slate-500">📧 {bank.email}</div>
                              <div className="text-sm text-emerald-600">🕐 Last active: {bank.lastActive}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-blue-100 text-blue-700 font-semibold">
                            {bank.totalCustomers.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-sky-100 text-sky-700 font-semibold">
                            {bank.totalApplications.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-bold ${
                            bank.approvalRate >= 70 ? 'bg-emerald-100 text-emerald-700' : 
                            bank.approvalRate >= 60 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {bank.approvalRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-slate-100 text-slate-700 font-semibold">
                            {bank.apiCalls.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(bank.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100">
                              Details
                            </Button>
                            <Button variant="outline" size="sm" className="bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100">
                              Manage
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

<TabsContent value="analytics">
  <div className="space-y-8">
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          Bank Fund Recovery Analysis
        </CardTitle>
        <CardDescription>Bank recovery performance and NPA management in India (2020-2024)</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bankRecoveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bank" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value} Cr`, 'Amount Recovered']} />
              <Legend />
              <Bar 
                dataKey="recovered2020" 
                name="2020 Recovery" 
                fill="hsl(214 95% 65%)" 
              />
              <Bar 
                dataKey="recovered2021" 
                name="2021 Recovery" 
                fill="hsl(214 95% 55%)" 
              />
              <Bar 
                dataKey="recovered2022" 
                name="2022 Recovery" 
                fill="hsl(214 95% 45%)" 
              />
              <Bar 
                dataKey="recovered2023" 
                name="2023 Recovery" 
                fill="hsl(214 95% 35%)" 
              />
              <Bar 
                dataKey="recovered2024" 
                name="2024 Recovery (YTD)" 
                fill="hsl(214 95% 25%)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            <span>🏆 Top Performing Banks</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bankRankings.slice(0, 5).map((bank, index) => (
              <div key={bank.id} className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-blue-100">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-blue-100 text-blue-700' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{bank.name}</div>
                    <div className="text-xs text-slate-500">NPA Ratio: {bank.npaRatio}%</div>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700">
                  ₹{bank.totalRecovered} Cr
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-800">
            <Activity className="h-5 w-5" />
            <span>📈 Recovery Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-slate-100">
              <span className="text-sm font-medium">💰 Total Recovered (2020-2024)</span>
              <Badge className="bg-blue-100 text-blue-700">₹8,742 Cr</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-slate-100">
              <span className="text-sm font-medium">📊 Average Recovery Rate</span>
              <Badge className="bg-emerald-100 text-emerald-700">78.3%</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-slate-100">
              <span className="text-sm font-medium">📉 Highest NPA Bank</span>
              <Badge className="bg-red-100 text-red-700">Yes Bank (12.8%)</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg border border-slate-100">
              <span className="text-sm font-medium">📈 Lowest NPA Bank</span>
              <Badge className="bg-green-100 text-green-700">HDFC (3.2%)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          Bank Recovery Performance Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Rank</TableHead>
              <TableHead className="font-semibold text-slate-700">Bank Name</TableHead>
              <TableHead className="font-semibold text-slate-700">Total Recovered (₹ Cr)</TableHead>
              <TableHead className="font-semibold text-slate-700">NPA Ratio</TableHead>
              <TableHead className="font-semibold text-slate-700">Recovery Rate</TableHead>
              <TableHead className="font-semibold text-slate-700">Primary Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bankRankings.map((bank, index) => (
              <TableRow key={bank.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                <TableCell>
                  <Badge className={`
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                    index === 1 ? 'bg-blue-100 text-blue-700' : 
                    index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'}
                  `}>
                    #{index + 1}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-slate-800">🏦 {bank.name}</TableCell>
                <TableCell className="font-semibold text-blue-700">₹{bank.totalRecovered} Cr</TableCell>
                <TableCell>
                  <Badge className={
                    bank.npaRatio < 5 ? 'bg-emerald-100 text-emerald-700' :
                    bank.npaRatio < 8 ? 'bg-blue-100 text-blue-700' :
                    bank.npaRatio < 10 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }>
                    {bank.npaRatio}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={
                    bank.recoveryRate >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    bank.recoveryRate >= 70 ? 'bg-blue-100 text-blue-700' :
                    bank.recoveryRate >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }>
                    {bank.recoveryRate}%
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600">{bank.primarySource}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</TabsContent>
<TabsContent value="lookup">
  <div className="space-y-8">
    <Card className="bg-white/90 backdrop-blur-sm border border-slate-200 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          Credit Score Lookup
        </CardTitle>
        <CardDescription>Search and verify user credit scores</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex space-x-4 mb-6">
          <Input
            placeholder="Enter User ID, Name or Email"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border-slate-200 focus:border-blue-400 transition-all duration-200"
          />
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
            🔍 Search
          </Button>
        </div>
        
        {searchUser && filteredByScore.length > 0 && (
          <div className="space-y-8">
            {/* Credit Score History Chart with 4 lines */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Credit Score History</h3>
              <p className="text-sm text-slate-600 mb-4">Track how your credit scores have changed across all bureaus</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { month: 'Jan', cibil: filteredByScore[0].creditScore - 50, experian: filteredByScore[0].creditScore - 67, equifax: filteredByScore[0].creditScore - 58, crif: filteredByScore[0].creditScore - 28 },
                    { month: 'Feb', cibil: filteredByScore[0].creditScore - 30, experian: filteredByScore[0].creditScore - 47, equifax: filteredByScore[0].creditScore - 38, crif: filteredByScore[0].creditScore - 8 },
                    { month: 'Mar', cibil: filteredByScore[0].creditScore - 20, experian: filteredByScore[0].creditScore - 37, equifax: filteredByScore[0].creditScore - 28, crif: filteredByScore[0].creditScore + 2 },
                    { month: 'Apr', cibil: filteredByScore[0].creditScore - 10, experian: filteredByScore[0].creditScore - 27, equifax: filteredByScore[0].creditScore - 18, crif: filteredByScore[0].creditScore + 12 },
                    { month: 'May', cibil: filteredByScore[0].creditScore, experian: filteredByScore[0].creditScore - 17, equifax: filteredByScore[0].creditScore - 8, crif: filteredByScore[0].creditScore + 22 },
                    { month: 'Jun', cibil: filteredByScore[0].creditScore + 5, experian: filteredByScore[0].creditScore - 12, equifax: filteredByScore[0].creditScore - 3, crif: filteredByScore[0].creditScore + 27 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[300, 900]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cibil" stroke="#3b82f6" name="CIBIL" strokeWidth={2} />
                    <Line type="monotone" dataKey="experian" stroke="#10b981" name="Experian" strokeWidth={2} />
                    <Line type="monotone" dataKey="equifax" stroke="#f59e0b" name="Equifax" strokeWidth={2} />
                    <Line type="monotone" dataKey="crif" stroke="#8b5cf6" name="CRIF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Bureau Scores - Speedometer Style */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Bureau Scores</h3>
              <p className="text-sm text-slate-600 mb-4">Current credit scores from all reporting bureaus</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CIBIL Score */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">CIBIL Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-slate-800">{filteredByScore[0].creditScore}</div>
                      <div className="text-sm text-slate-500 mt-1">Range: 300 - 900</div>
                    </div>
                    
                    {/* Speedometer */}
                    <div className="relative w-full h-32 mb-4">
                      {/* Speedometer background */}
                      <div className="absolute w-full h-16 bg-slate-200 rounded-t-full overflow-hidden"></div>
                      
                      {/* Speedometer fill */}
                      <div 
                        className="absolute w-full h-16 bg-blue-600 rounded-t-full transform origin-bottom"
                        style={{ transform: `rotate(${((filteredByScore[0].creditScore - 300) / 600) * 180 - 90}deg)` }}
                      ></div>
                      
                      {/* Needle */}
                      <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-600 transform -translate-x-1/2 origin-bottom"
                           style={{ transform: `rotate(${((filteredByScore[0].creditScore - 300) / 600) * 180 - 90}deg) translateX(-50%)` }}>
                        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-slate-700">{Math.round((filteredByScore[0].creditScore - 300) / 6)}%</span>
                      <span className="text-sm font-medium text-slate-700">900</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Experian Score */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">Experian Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-slate-800">{filteredByScore[0].creditScore - 17}</div>
                      <div className="text-sm text-slate-500 mt-1">Range: 300 - 900</div>
                    </div>
                    
                    {/* Speedometer */}
                    <div className="relative w-full h-32 mb-4">
                      {/* Speedometer background */}
                      <div className="absolute w-full h-16 bg-slate-200 rounded-t-full overflow-hidden"></div>
                      
                      {/* Speedometer fill */}
                      <div 
                        className="absolute w-full h-16 bg-emerald-600 rounded-t-full transform origin-bottom"
                        style={{ transform: `rotate(${((filteredByScore[0].creditScore - 317) / 600) * 180 - 90}deg)` }}
                      ></div>
                      
                      {/* Needle */}
                      <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-600 transform -translate-x-1/2 origin-bottom"
                           style={{ transform: `rotate(${((filteredByScore[0].creditScore - 317) / 600) * 180 - 90}deg) translateX(-50%)` }}>
                        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-slate-700">{Math.round((filteredByScore[0].creditScore - 317) / 6)}%</span>
                      <span className="text-sm font-medium text-slate-700">900</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Equifax Score */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">Equifax Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-slate-800">{filteredByScore[0].creditScore - 8}</div>
                      <div className="text-sm text-slate-500 mt-1">Range: 300 - 900</div>
                    </div>
                    
                    {/* Speedometer */}
                    <div className="relative w-full h-32 mb-4">
                      {/* Speedometer background */}
                      <div className="absolute w-full h-16 bg-slate-200 rounded-t-full overflow-hidden"></div>
                      
                      {/* Speedometer fill */}
                      <div 
                        className="absolute w-full h-16 bg-amber-600 rounded-t-full transform origin-bottom"
                        style={{ transform: `rotate(${((filteredByScore[0].creditScore - 308) / 600) * 180 - 90}deg)` }}
                      ></div>
                      
                      {/* Needle */}
                      <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-600 transform -translate-x-1/2 origin-bottom"
                           style={{ transform: `rotate(${((filteredByScore[0].creditScore - 308) / 600) * 180 - 90}deg) translateX(-50%)` }}>
                        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-slate-700">{Math.round((filteredByScore[0].creditScore - 308) / 6)}%</span>
                      <span className="text-sm font-medium text-slate-700">900</span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* CRIF Score */}
                <Card className="border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-800">CRIF Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-slate-800">{filteredByScore[0].creditScore + 22}</div>
                      <div className="text-sm text-slate-500 mt-1">Range: 1 - 999</div>
                    </div>
                    
                    {/* Speedometer */}
                    <div className="relative w-full h-32 mb-4">
                      {/* Speedometer background */}
                      <div className="absolute w-full h-16 bg-slate-200 rounded-t-full overflow-hidden"></div>
                      
                      {/* Speedometer fill */}
                      <div 
                        className="absolute w-full h-16 bg-purple-600 rounded-t-full transform origin-bottom"
                        style={{ transform: `rotate(${((filteredByScore[0].creditScore + 22) / 999) * 180 - 90}deg)` }}
                      ></div>
                      
                      {/* Needle */}
                      <div className="absolute bottom-0 left-1/2 w-1 h-16 bg-red-600 transform -translate-x-1/2 origin-bottom"
                           style={{ transform: `rotate(${((filteredByScore[0].creditScore + 22) / 999) * 180 - 90}deg) translateX(-50%)` }}>
                        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2"></div>
                      </div>
                      
                      {/* Center circle */}
                      <div className="absolute bottom-0 left-1/2 w-6 h-6 bg-white border-2 border-slate-300 rounded-full transform -translate-x-1/2 translate-y-1/2 z-10"></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-slate-600 mb-2">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-slate-700">{Math.round((filteredByScore[0].creditScore + 22) / 10)}%</span>
                      <span className="text-sm font-medium text-slate-700">999</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span className="font-medium">Average Score:</span>
                  <span className="ml-2 font-bold text-blue-700">
                    {Math.round((
                      filteredByScore[0].creditScore + 
                      (filteredByScore[0].creditScore - 17) + 
                      (filteredByScore[0].creditScore - 8) + 
                      (filteredByScore[0].creditScore + 22)
                    ) / 4)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  This matches the customer's main credit score of {filteredByScore[0].creditScore}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {searchUser && filteredByScore.length === 0 && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No user found with that search criteria</div>
            <div className="text-sm text-slate-500">Try searching by name, email, or user ID</div>
          </div>
        )}
        
        {!searchUser && (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">Enter a search term to look up credit information</div>
            <div className="text-sm text-slate-500">Try searching for one of the users from the customer list</div>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
