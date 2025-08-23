const express=require("express");
const mongoose=require('mongoose');
const cors=require("cors");
const EmployeeModel=require('./models/Employee');

const app=express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/employee")

app.post('/register',(req,res)=>{
   EmployeeModel.create(req.body)
   .then(user=>res.json({
      status: "Success",
      message: "User registered successfully",
      user: {
         email: user.email,
         username: user.username,
         firstName: user.firstName,
         lastName: user.lastName,
         panNumber: user.panNumber,
         role: user.role
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
                  email: user.email,
                  username: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  panNumber: user.panNumber,
                  role: user.role
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

app.listen(3001,()=>{
    console.log("server is running")
})