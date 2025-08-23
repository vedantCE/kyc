const mongoose=require('mongoose')

const EmployeeSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    panNumber:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['user','bank','admin']
    }
})

const EmployeeModel=mongoose.model("employees",EmployeeSchema)
module.exports=EmployeeModel