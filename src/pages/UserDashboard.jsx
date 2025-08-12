import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  CreditCard, 
  AlertCircle,
  FileText,
  HelpCircle,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  FileCheck
} from "lucide-react";

/*
  This file extends the original UserDashboard by adding a full loan application flow.
  - Clicking "Apply Now" on a recommended loan opens a Loan Application Modal.
  - The modal allows Autofill (from localStorage/mock profile + selected loan) or Manual Fill.
  - After filling, user can Preview the application and Print a receipt.
  - The rest of the original dashboard code is preserved as-is.

  NOTE: This is a single-file React component that uses the same UI components as the
  original project (Card, Button, Badge, etc.). It is written to be drop-in replaceable
  for the original UserDashboard file.
*/

// Small utility: format INR
const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// Credit Calculator (unchanged logic, small refactor)
const CreditCalculator = ({}) => {
  const [calcLoanAmount, setCalcLoanAmount] = useState("");
  const [calcCreditScore, setCalcCreditScore] = useState("");
  const [calcIncome, setCalcIncome] = useState("");

  const parseNum = (v) => {
    const n = Number((v || "").toString().replace(/,/g, ""));
    return isNaN(n) ? 0 : n;
  };

  const getMultiplier = (score) => {
    if (score < 300) return 0;
    const s = Math.max(300, Math.min(850, score));
    const base = 0.1;
    const max = 0.6;
    if (s < 600) return base;
    const scaled = (s - 600) / (850 - 600);
    return base + Math.max(0, Math.min(1, scaled)) * (max - base);
  };

  const estimateApproved = () => {
    const loan = parseNum(calcLoanAmount);
    const score = parseNum(calcCreditScore);
    const income = parseNum(calcIncome);
    const cap = income * getMultiplier(score);
    return Math.max(0, Math.min(loan || 0, Math.floor(cap)));
  };

  const approvedAmount = estimateApproved();

  return (
    <div className="max-w-md mx-auto space-y-4 p-6 bg-white rounded-lg border border-blue-200">
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">Loan Amount:</label>
        <Input
          type="text"
          value={calcLoanAmount}
          onChange={(e) => setCalcLoanAmount(e.target.value)}
          placeholder="Enter desired loan"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">Credit Score:</label>
        <Input
          type="text"
          value={calcCreditScore}
          onChange={(e) => setCalcCreditScore(e.target.value)}
          placeholder="Enter credit score"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-800">Yearly Income:</label>
        <Input
          type="text"
          value={calcIncome}
          onChange={(e) => setCalcIncome(e.target.value)}
          placeholder="Enter annual income"
          className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="pt-4 border-t border-blue-300">
        <h3 className="text-lg font-semibold text-center text-blue-800 bg-white py-3 px-4 rounded-lg shadow-sm border border-blue-200">
          Estimated Approval: {formatINR(approvedAmount)}
        </h3>
      </div>
    </div>
  );
};

// Loan Application Modal + Form + Preview
const LoanApplicationModal = ({
  isOpen,
  onClose,
  selectedLoan,
  onSubmitApplication,
  userEmail,
}) => {
  const initialForm = {
    applicantName: "",
    email: userEmail || "",
    phone: "",
    dob: "",
    pan: "",
    aadhaar: "",
    address: "",
    employmentType: "Salaried",
    employerName: "",
    designation: "",
    annualIncome: "",
    requestedAmount: selectedLoan ? selectedLoan.amount.replace(/[^0-9]/g, "") : "",
    tenureYears: selectedLoan ? selectedLoan.tenure.replace(/[^0-9]/g, "") : "",
    interestRate: selectedLoan ? selectedLoan.interest.replace(/[^0-9.]/g, "") : "",
    purpose: "",
    consent: false,
  };

  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState("manual"); // manual | autofill
  const [previewOpen, setPreviewOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // When the modal opens or selectedLoan changes, reset form defaults
    setForm((f) => ({ ...initialForm, requestedAmount: initialForm.requestedAmount, tenureYears: initialForm.tenureYears, interestRate: initialForm.interestRate }));
    setErrors({});
    setPreviewOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedLoan]);

  const validate = () => {
    const e = {};
    if (!form.applicantName) e.applicantName = "Required";
    if (!form.email) e.email = "Required";
    if (!form.phone || form.phone.toString().length < 10) e.phone = "Enter valid phone";
    if (!form.requestedAmount || Number(form.requestedAmount) <= 0) e.requestedAmount = "Enter amount";
    if (!form.annualIncome || Number(form.annualIncome) <= 0) e.annualIncome = "Enter annual income";
    if (!form.consent) e.consent = "You must agree to proceed";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAutofill = () => {
    // Autofill from localStorage or mock profile
    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    // Mock fallback
    const mock = {
      applicantName: "Vedant Bhatt",
      email: userEmail || "vedant@example.com",
      phone: "9876543210",
      dob: "1998-01-01",
      pan: "ABCDE1234F",
      aadhaar: "999900001111",
      address: "123, CSPIT Road, Charusat, Gujarat",
      employmentType: "Salaried",
      employerName: "Charusat Technologies",
      designation: "Student / Intern",
      annualIncome: "480000",
    };

    const auto = {
      ...mock,
      ...profile,
      requestedAmount: selectedLoan ? selectedLoan.amount.replace(/[^0-9]/g, "") : mock.requestedAmount,
      tenureYears: selectedLoan ? selectedLoan.tenure.replace(/[^0-9]/g, "") : "5",
      interestRate: selectedLoan ? selectedLoan.interest.replace(/[^0-9.]/g, "") : "10.5",
    };

    setForm((f) => ({ ...f, ...auto }));
    setMode("autofill");
  };

  const handleChange = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((err) => ({ ...err, [k]: undefined }));
  };

  const handlePreview = () => {
    if (!validate()) return;
    setPreviewOpen(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    // Construct application object
    const application = {
      id: "LA" + Math.floor(Math.random() * 900000 + 100000),
      bank: selectedLoan ? selectedLoan.bank : "Custom",
      type: selectedLoan ? selectedLoan.type : "Loan",
      amount: "₹" + Number(form.requestedAmount).toLocaleString("en-IN"),
      status: "Submitted",
      appliedDate: new Date().toISOString().split("T")[0],
      applicant: { ...form },
    };

    // call parent handler
    onSubmitApplication(application);
    setPreviewOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Apply for {selectedLoan ? `${selectedLoan.bank} - ${selectedLoan.type}` : "Loan"}</h3>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => { setPreviewOpen(false); onClose(); }}>Close</Button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Choose how you'd like to fill the form</div>
            <div className="space-x-2">
              <Button size="sm" variant={mode === "manual" ? "default" : "outline"} onClick={() => setMode("manual")}>Manual</Button>
              <Button size="sm" variant={mode === "autofill" ? "default" : "outline"} onClick={handleAutofill}>Autofill</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Applicant Name</label>
              <Input value={form.applicantName} onChange={(e) => handleChange("applicantName", e.target.value)} placeholder="Full name" />
              {errors.applicantName && <p className="text-xs text-destructive">{errors.applicantName}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Email</label>
              <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="Email" />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Phone</label>
              <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="10 digit mobile" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Date of Birth</label>
              <Input type="date" value={form.dob} onChange={(e) => handleChange("dob", e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">PAN</label>
              <Input value={form.pan} onChange={(e) => handleChange("pan", e.target.value.toUpperCase())} placeholder="ABCDE1234F" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Aadhaar</label>
              <Input value={form.aadhaar} onChange={(e) => handleChange("aadhaar", e.target.value)} placeholder="XXXX-XXXX-XXXX" />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-medium text-blue-800">Address</label>
              <Input value={form.address} onChange={(e) => handleChange("address", e.target.value)} placeholder="Residential address" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Employment Type</label>
              <select value={form.employmentType} onChange={(e) => handleChange("employmentType", e.target.value)} className="w-full rounded border p-2">
                <option>Salaried</option>
                <option>Self-Employed</option>
                <option>Student</option>
                <option>Retired</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Employer / Business Name</label>
              <Input value={form.employerName} onChange={(e) => handleChange("employerName", e.target.value)} placeholder="Employer" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Designation</label>
              <Input value={form.designation} onChange={(e) => handleChange("designation", e.target.value)} placeholder="Designation" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Annual Income (in ₹)</label>
              <Input value={form.annualIncome} onChange={(e) => handleChange("annualIncome", e.target.value.replace(/,/g, ""))} placeholder="480000" />
              {errors.annualIncome && <p className="text-xs text-destructive">{errors.annualIncome}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Requested Amount (in ₹)</label>
              <Input value={form.requestedAmount} onChange={(e) => handleChange("requestedAmount", e.target.value.replace(/,/g, ""))} placeholder="300000" />
              {errors.requestedAmount && <p className="text-xs text-destructive">{errors.requestedAmount}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Tenure (years)</label>
              <Input value={form.tenureYears} onChange={(e) => handleChange("tenureYears", e.target.value)} placeholder="5" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-blue-800">Interest Rate (%)</label>
              <Input value={form.interestRate} onChange={(e) => handleChange("interestRate", e.target.value)} placeholder="10.5" />
            </div>

            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-xs font-medium text-blue-800">Purpose</label>
              <Input value={form.purpose} onChange={(e) => handleChange("purpose", e.target.value)} placeholder="Loan purpose (eg: Home renovation)" />
            </div>

            <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
              <input type="checkbox" checked={form.consent} onChange={(e) => handleChange("consent", e.target.checked)} />
              <label className="text-sm text-blue-700">I consent to the bank checking my credit information and processing this application.</label>
            </div>
            {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button size="sm" variant="outline" onClick={() => { setForm(initialForm); setMode("manual"); }}>Reset</Button>
            <Button size="sm" onClick={handlePreview}>Preview</Button>
            <Button size="sm" className="bg-blue-600" onClick={handleSubmit}>Submit Application</Button>
          </div>

          {/* Preview pane */}
          {previewOpen && (
            <div className="mt-4 bg-gray-50 border p-4 rounded">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">Application Preview</h4>
                  <p className="text-sm text-muted-foreground">Review the details below before submitting</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setPreviewOpen(false)}>Close Preview</Button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-blue-600">Applicant</p>
                  <h5 className="font-medium text-blue-800">{form.applicantName}</h5>
                  <p className="text-sm text-blue-600">{form.email} • {form.phone}</p>
                  <p className="text-sm text-blue-600">PAN: {form.pan} • Aadhaar: {form.aadhaar}</p>
                  <p className="text-sm text-blue-600">Address: {form.address}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-600">Loan Details</p>
                  <h5 className="font-medium text-blue-800">{selectedLoan ? `${selectedLoan.bank} - ${selectedLoan.type}` : "Custom Loan"}</h5>
                  <p className="text-sm text-blue-600">Amount: ₹{Number(form.requestedAmount || 0).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-blue-600">Tenure: {form.tenureYears} years • Interest: {form.interestRate}%</p>
                  <p className="text-sm text-blue-600">Purpose: {form.purpose}</p>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Employment</p>
                    <p className="text-sm text-blue-800">{form.employmentType} • {form.employerName} • {form.designation}</p>
                    <p className="text-sm text-blue-600">Annual Income: ₹{Number(form.annualIncome || 0).toLocaleString("en-IN")}</p>
                  </div>

                  <div className="text-right space-y-2">
                    <p className="text-sm text-blue-600">Application ID (preview)</p>
                    <p className="font-semibold">Preview-{new Date().getTime().toString().slice(-6)}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button size="sm" variant="outline" onClick={() => window.print()}>
                        <Printer className="h-4 w-4 mr-1" /> Print Preview
                      </Button>
                      <Button size="sm" onClick={handleSubmit} className="bg-blue-600">Confirm & Submit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "user@demo.com";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    document.title = "User Dashboard | CreditScore Pro";
    // load saved applications from localStorage
    const saved = JSON.parse(localStorage.getItem("loanApplicationsSaved") || "[]");
    setApplications(saved);
  }, []);

  useEffect(() => {
    // persist applications
    localStorage.setItem("loanApplicationsSaved", JSON.stringify(applications));
  }, [applications]);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userType");
    localStorage.removeItem("isLoggedIn");
    navigate("/signin");
  };

  // Mock data (same as original)
  const creditScore = 742;
  const riskLevel = "Low";
  const lastUpdated = "2024-08-08";
  const pendingLoans = 2;
  const approvedLoans = 1;
  const rejectedLoans = 0;

  const recommendedLoans = [
    {
      bank: "HDFC Bank",
      type: "Personal Loan",
      amount: "₹5,00,000",
      interest: "10.5%",
      tenure: "5 years",
      eligibility: "High",
    },
    {
      bank: "SBI",
      type: "Home Loan",
      amount: "₹25,00,000",
      interest: "8.75%",
      tenure: "20 years",
      eligibility: "High",
    },
    {
      bank: "ICICI Bank",
      type: "Car Loan",
      amount: "₹8,00,000",
      interest: "9.25%",
      tenure: "7 years",
      eligibility: "Medium",
    },
    {
      bank: "Axis Bank",
      type: "Business Loan",
      amount: "₹10,00,000",
      interest: "12.5%",
      tenure: "5 years",
      eligibility: "Medium",
    },
  ];

  const loanApplicationsInitial = [
    {
      id: "LA001",
      bank: "HDFC Bank",
      type: "Personal Loan",
      amount: "₹3,00,000",
      status: "Pending",
      appliedDate: "2024-08-05",
      expectedDecision: "2024-08-12",
    },
    {
      id: "LA002",
      bank: "SBI",
      type: "Credit Card",
      amount: "₹2,00,000",
      status: "Approved",
      appliedDate: "2024-07-28",
      approvedDate: "2024-08-02",
    },
  ];

  const improvementActions = [
    { action: "Pay credit card bills on time", impact: "+15 points", timeframe: "3 months", priority: "High" },
    { action: "Reduce credit utilization below 30%", impact: "+25 points", timeframe: "2 months", priority: "High" },
    { action: "Maintain older credit accounts", impact: "+10 points", timeframe: "6 months", priority: "Medium" },
    { action: "Diversify credit portfolio", impact: "+8 points", timeframe: "12 months", priority: "Low" },
  ];

  const faqs = [
    { question: "Why did my credit score decrease?", answer: "Credit scores can decrease due to late payments, high credit utilization, new credit inquiries, or account closures." },
    { question: "How often is my credit score updated?", answer: "Credit scores are typically updated monthly when lenders report payment information to credit bureaus." },
    { question: "What is a good credit utilization ratio?", answer: "A credit utilization ratio below 30% is considered good, but below 10% is excellent for your credit score." },
    { question: "How long do negative marks stay on my credit report?", answer: "Most negative marks stay on your credit report for 7 years, while bankruptcy can stay for up to 10 years." },
  ];

  const getScoreColor = (score) => {
    if (score >= 750) return "text-success";
    if (score >= 650) return "text-warning";
    return "text-destructive";
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return <Badge variant="secondary" className="bg-success text-success-foreground">Low Risk</Badge>;
      case "Medium":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Medium Risk</Badge>;
      case "High":
        return <Badge variant="destructive">High Risk</Badge>;
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "Rejected":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "Pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const openApplicationModal = (loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleNewApplication = (application) => {
    // add to applications and save
    setApplications((prev) => [application, ...prev]);
    // also show a small toast or console
    console.log("Application submitted:", application);
  };

  const printableRef = useRef(null);

  const handlePrintReceipt = (application) => {
    // Create a printable window content using application data
    const html = `
      <html>
        <head>
          <title>Loan Receipt - ${application.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; padding: 24px; color: #0f172a }
            .card { border: 1px solid #e6eef8; padding: 18px; border-radius: 8px }
            h1 { color: #0b5ed7 }
            table { width: 100%; border-collapse: collapse; margin-top: 12px }
            td, th { padding: 8px; border: 1px solid #e6eef8; text-align: left }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Loan Application Receipt</h1>
            <p>Application ID: <strong>${application.id}</strong></p>
            <p>Bank: <strong>${application.bank}</strong></p>
            <p>Type: <strong>${application.type}</strong></p>
            <p>Amount: <strong>${application.amount}</strong></p>
            <p>Status: <strong>${application.status}</strong></p>
            <p>Applied on: <strong>${application.appliedDate}</strong></p>
            <hr />
            <h3>Applicant Details</h3>
            <table>
              <tr><th>Name</th><td>${application.applicant.applicantName}</td></tr>
              <tr><th>Email</th><td>${application.applicant.email}</td></tr>
              <tr><th>Phone</th><td>${application.applicant.phone}</td></tr>
              <tr><th>PAN</th><td>${application.applicant.pan || "-"}</td></tr>
              <tr><th>Aadhaar</th><td>${application.applicant.aadhaar || "-"}</td></tr>
              <tr><th>Address</th><td>${application.applicant.address || "-"}</td></tr>
              <tr><th>Annual Income</th><td>₹${Number(application.applicant.annualIncome || 0).toLocaleString("en-IN")}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) {
      alert('Please allow popups for printing');
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-gradient-primary">CreditScore Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {userEmail}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Credit Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(creditScore)}`}>{creditScore}</div>
              <p className="text-xs text-blue-600">Excellent (750-850)</p>
              <div className="mt-2">
                <Progress value={(creditScore / 850) * 100} className="h-2 bg-blue-100" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Risk Assessment</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{riskLevel}</div>
              <div className="mt-2">{getRiskBadge(riskLevel)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Loan Applications</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-sm text-blue-600">Pending</span><span className="text-sm font-medium text-blue-800">{applications.filter(a => a.status === 'Pending').length || pendingLoans}</span></div>
                <div className="flex justify-between"><span className="text-sm text-blue-600">Approved</span><span className="text-sm font-medium text-success">{applications.filter(a => a.status === 'Approved').length || approvedLoans}</span></div>
                <div className="flex justify-between"><span className="text-sm text-blue-600">Rejected</span><span className="text-sm font-medium text-destructive">{applications.filter(a => a.status === 'Rejected').length || rejectedLoans}</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card border-l-4 border-l-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Last Updated</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{lastUpdated}</div>
              <p className="text-xs text-blue-600">Next update in 25 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="loans" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 rounded-full bg-white p-1 border border-blue-200">
            <TabsTrigger value="loans" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">Recommended Loans</TabsTrigger>
            <TabsTrigger value="status" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">Loan Status</TabsTrigger>
            <TabsTrigger value="improve" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">Improve Score</TabsTrigger>
            <TabsTrigger value="calculator" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">Credit Calculator</TabsTrigger>
            <TabsTrigger value="faq" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-200">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Loans</CardTitle>
                <CardDescription>Based on your credit score of {creditScore}, here are the best loan options for you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedLoans.map((loan, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-blue-800">{loan.bank}</CardTitle>
                            <CardDescription className="text-blue-600">{loan.type}</CardDescription>
                          </div>
                          <Badge variant={loan.eligibility === "High" ? "default" : "secondary"} className="bg-blue-100 text-blue-800 border-blue-200">{loan.eligibility}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          <div className="flex justify-between"><span className="text-sm text-blue-600">Amount</span><span className="font-medium text-blue-800">{loan.amount}</span></div>
                          <div className="flex justify-between"><span className="text-sm text-blue-600">Interest Rate</span><span className="font-medium text-blue-800">{loan.interest}</span></div>
                          <div className="flex justify-between"><span className="text-sm text-blue-600">Tenure</span><span className="font-medium text-blue-800">{loan.tenure}</span></div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200" size="sm" onClick={() => openApplicationModal(loan)}>Apply Now</Button>
                          <Button className="w-full border border-blue-200" size="sm" onClick={() => alert('More details coming soon')}>Details</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Loan Status Tracker</CardTitle>
                <CardDescription>Track the progress of your loan applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.length === 0 && (
                    <Card className="p-4 border border-blue-100 text-blue-700">You have not submitted any loan applications yet.</Card>
                  )}

                  {applications.map((application) => (
                    <Card key={application.id} className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-blue-800">{application.bank}</h3>
                              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">{application.id}</Badge>
                            </div>
                            <p className="text-sm text-blue-600">{application.type}</p>
                            <p className="font-medium text-blue-800">{application.amount}</p>
                          </div>
                          <div className="text-right space-y-1">
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(application.status)}
                              <span className="text-sm font-medium text-blue-800">{application.status}</span>
                            </div>
                            <p className="text-xs text-blue-600">Applied: {application.appliedDate}</p>
                            {application.status === "Pending" && application.expectedDecision && (<p className="text-xs text-blue-600">Decision by: {application.expectedDecision}</p>)}
                            {application.status === "Approved" && application.approvedDate && (<p className="text-xs text-success">Approved: {application.approvedDate}</p>)}

                            <div className="flex items-center justify-end space-x-2 mt-3">
                              <Button size="sm" variant="outline" onClick={() => handlePrintReceipt(application)}>
                                <Printer className="h-4 w-4 mr-1" /> Print Receipt
                              </Button>
                              <Button size="sm" onClick={() => alert('View details - coming soon')}>
                                <FileCheck className="h-4 w-4 mr-1" /> View
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improve">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions to Improve Score</CardTitle>
                <CardDescription>Follow these recommendations to boost your credit score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {improvementActions.map((action, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500 bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2 flex-1">
                            <h3 className="font-semibold text-blue-800">{action.action}</h3>
                            <div className="flex items-center space-x-4">
                              <Badge variant={action.priority === "High" ? "default" : action.priority === "Medium" ? "secondary" : "outline"} className="bg-blue-100 text-blue-800 border-blue-200">{action.priority} Priority</Badge>
                              <span className="text-sm text-success font-medium">{action.impact}</span>
                              <span className="text-sm text-blue-600">in {action.timeframe}</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400">Learn More</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Credit Calculator</CardTitle>
                <CardDescription>Calculate estimated loan approval amounts based on your credit score and income</CardDescription>
              </CardHeader>
              <CardContent>
                <CreditCalculator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Common questions about credit scores and payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="bg-white hover:bg-blue-50 transition-all duration-300 shadow-md hover:shadow-lg border border-blue-200">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <h3 className="font-semibold text-blue-800">{faq.question}</h3>
                          </div>
                          <p className="text-sm text-blue-600 pl-7">{faq.answer}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Loan Modal */}
      <LoanApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLoan={selectedLoan}
        onSubmitApplication={handleNewApplication}
        userEmail={userEmail}
      />
    </div>
  );
};

export default UserDashboard;
