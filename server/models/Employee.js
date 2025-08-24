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
    aadhaarNumber:{
        type:String,
        required:false
    },
    phoneNumber:{
        type:String,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    dateOfBirth:{
        type:Date,
        required:false
    },
    occupation:{
        type:String,
        required:false
    },
    annualIncome:{
        type:String,
        required:false
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
    },
    creditScore:{
        type:Number,
        default: function() {
            return Math.floor(Math.random() * 300) + 600; // Random score between 600-900
        }
    },
    riskLevel:{
        type:String,
        default: function() {
            const score = this.creditScore || 700;
            if (score >= 750) return 'Low';
            if (score >= 650) return 'Medium';
            return 'High';
        }
    },
    status:{
        type:String,
        default:'Active',
        enum:['Active','Suspended','Pending']
    },
    signupTimestamp:{
        type:Date,
        default:Date.now
    }
}, {
    timestamps: true
})

// Pre-save middleware to set risk level based on credit score
EmployeeSchema.pre('save', function(next) {
    if (this.creditScore) {
        if (this.creditScore >= 750) {
            this.riskLevel = 'Low';
        } else if (this.creditScore >= 650) {
            this.riskLevel = 'Medium';
        } else {
            this.riskLevel = 'High';
        }
    }
    next();
});

const EmployeeModel=mongoose.model("employees",EmployeeSchema)
module.exports=EmployeeModel
