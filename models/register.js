const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String, // Assuming the phone number can contain non-numeric characters
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number, // You can adjust the data type as needed
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  adhaarCardNumber: {
    type: String, // Assuming Aadhar numbers can contain non-numeric characters
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.generateAuthToken = async function(){
  try {
 //     console.log(this._id);

      const token = jwt.sign({_id:this._id.toString()},'grindtillyoufckit/reversethekey/asdsad');
      this.tokens = this.tokens.concat({token:token});

//     console.log(token);

      await this.save();
      return token;

  } catch (error) {
      //res.send("The Error part " + error);
      console.log("The Error part "+ error);
  }
}


userSchema.pre("save",async function(next){

     
  if(this.isModified("password"))
  {
     // console.log(`The current password ${this.password}`);
      this.password = await bcrypt.hash(this.password,10)
     // console.log(`The current password ${this.password}`);
  }
  next();
})




const User = mongoose.model("User", userSchema);

module.exports = User;