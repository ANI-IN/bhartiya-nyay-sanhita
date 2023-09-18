const async = require("hbs/lib/async");
const mongoose = require("mongoose");
const bcrypt =require("bcrypt");
const jwt=require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobileNumber: {
        type: Number,
        required: true
    },
    adhaarCardNumber: {
        type: Number,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    userType: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    try {
  
        const token = jwt.sign({_id:this._id.toString()},'grindtillyoufckit/reversethekey/asdsad');
        this.tokens = this.tokens.concat({token:token});

        await this.save();
        return token;

    } catch (error) {
     
        console.log("The Error part "+ error);
    }
}

employeeSchema.pre("save",async function(next){

     
    if(this.isModified("password"))
    {
       // console.log(`The current password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10)
       // console.log(`The current password ${this.password}`);
    }
    next();
})

const Register = new mongoose.model("user",employeeSchema);
module.exports=Register;