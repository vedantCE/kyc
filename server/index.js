const express=require("express");
const mongoose=require('mongoose');
const cors=require("cors");
const EmployeeModel=require('./models/Employee');

const MONGO_URI="mongodb+srv://vedantbhattce28:3yhEkDTd5S8fKFAs@cluster1.dbi1j2u.mongodb.net/kycDB?retryWrites=true&w=majority"

const app=express();
app.use(express.json());
app.use(cors());

mongoose.connect(MONGO_URI)
  .then(() => console.log('Atlas Connected Successfully'))
  .catch(err => console.error('Connection Error:', err.message));

  
app.post('/register',(req,res)=>{
   EmployeeModel.create(req.body)
   .then(user=>res.json({
      status: "Success",
      message: "User registered successfully",
      user: {
         id: user._id,
         email: user.email,
         username: user.username,
         firstName: user.firstName,
         lastName: user.lastName,
         panNumber: user.panNumber,
         aadhaarNumber: user.aadhaarNumber,
         phoneNumber: user.phoneNumber,
         creditScore: user.creditScore,
         riskLevel: user.riskLevel,
         role: user.role,
         status: user.status,
         signupTimestamp: user.signupTimestamp
      }
   }))
   .catch(err=>{
      if(err.code === 11000) {
         res.json({status: "Error", message: "Email already exists"})
      } else {
         res.json({status: "Error", message: "Registration failed"})
      }
   })
})

app.post('/login',(req,res)=>{
   const {email, password} = req.body;
   EmployeeModel.findOne({email: email})
   .then(user => {
      if(user) {
         if(user.password === password) {
            res.json({
               status: "Success",
               user: {
                  id: user._id,
                  email: user.email,
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  panNumber: user.panNumber,
                  aadhaarNumber: user.aadhaarNumber,
                  phoneNumber: user.phoneNumber,
                  creditScore: user.creditScore,
                  riskLevel: user.riskLevel,
                  role: user.role,
                  status: user.status
               }
            })
         } else {
            res.json({status: "Error", message: "Password is incorrect"})
         }
      } else {
         res.json({status: "Error", message: "No record existed"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Server error"}))
})

// Get all users (Admin only)
app.get('/users', (req, res) => {
   EmployeeModel.find({}, '-password')
   .then(users => {
      const formattedUsers = users.map(user => ({
         id: user._id,
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         phone: user.phoneNumber || 'N/A',
         aadhaar: user.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : 'N/A',
         pan: user.panNumber ? `${user.panNumber.slice(0,5)}XXXX${user.panNumber.slice(-1)}` : 'N/A',
         creditScore: user.creditScore,
         riskLevel: user.riskLevel,
         joinDate: user.signupTimestamp,
         status: user.status,
         role: user.role,
         city: user.address ? user.address.split(',').pop().trim() : 'N/A'
      }));
      res.json({status: "Success", users: formattedUsers})
   })
   .catch(err => res.json({status: "Error", message: "Failed to fetch users"}))
})

// Search users by name, aadhaar, or PAN (Bank access)
app.post('/search-users', (req, res) => {
   const { query } = req.body;
   const searchRegex = new RegExp(query, 'i');
   
   EmployeeModel.find({
      $or: [
         { firstName: searchRegex },
         { lastName: searchRegex },
         { aadhaarNumber: query },
         { panNumber: query.toUpperCase() }
      ]
   }, '-password')
   .then(users => {
      const formattedUsers = users.map(user => ({
         id: user._id,
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         phone: user.phoneNumber || 'N/A',
         aadhaar: user.aadhaarNumber ? `XXXX-XXXX-${user.aadhaarNumber.slice(-4)}` : 'N/A',
         pan: user.panNumber ? `${user.panNumber.slice(0,5)}XXXX${user.panNumber.slice(-1)}` : 'N/A',
         creditScore: user.creditScore,
         riskLevel: user.riskLevel,
         joinDate: user.signupTimestamp,
         status: user.status,
         role: user.role
      }));
      res.json({status: "Success", users: formattedUsers})
   })
   .catch(err => res.json({status: "Error", message: "Search failed"}))
})

// Update user (Admin only)
app.put('/users/:id', (req, res) => {
   const { id } = req.params;
   const updateData = req.body;
   
   EmployeeModel.findByIdAndUpdate(id, updateData, { new: true })
   .then(user => {
      if (user) {
         res.json({
            status: "Success",
            message: "User updated successfully",
            user: {
               id: user._id,
               name: `${user.firstName} ${user.lastName}`,
               email: user.email,
               phone: user.phoneNumber,
               creditScore: user.creditScore,
               riskLevel: user.riskLevel,
               status: user.status
            }
         })
      } else {
         res.json({status: "Error", message: "User not found"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Update failed"}))
})

// Delete user (Admin only)
app.delete('/users/:id', (req, res) => {
   const { id } = req.params;
   
   EmployeeModel.findByIdAndDelete(id)
   .then(user => {
      if (user) {
         res.json({status: "Success", message: "User deleted successfully"})
      } else {
         res.json({status: "Error", message: "User not found"})
      }
   })
   .catch(err => res.json({status: "Error", message: "Delete failed"}))
})

// Get signup logs (Admin only)
app.get('/signup-logs', (req, res) => {
   EmployeeModel.find({}, 'firstName lastName email role status signupTimestamp')
   .sort({ signupTimestamp: -1 })
   .limit(50)
   .then(logs => {
      const formattedLogs = logs.map(log => ({
         id: log._id,
         name: `${log.firstName} ${log.lastName}`,
         email: log.email,
         role: log.role,
         status: log.status,
         timestamp: log.signupTimestamp
      }));
      res.json({status: "Success", logs: formattedLogs})
   })
   .catch(err => res.json({status: "Error", message: "Failed to fetch logs"}))
})

app.listen(3001,()=>{
    console.log("server is running")
})
