const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt =require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
    firstname : {
        type:String,
        required:true
    },
    lastname : {
        type:String,
        required:true 
    },
    email : {
        type:String,
        required:true ,
        unique:true
    },
    gender : {
        type:String,
        required:true 
    },
    phone : {
        type:Number,
        required:true, 
        unique :true
    },
    age : {
        type:Number,
        required:true 
    },
    password : {
        type:String,
        required:true 
    },
    confirmpassword : {
        type:String,
        required:true 
    },
    tokens:[{
        token:{
            type:String,
            required:true   
        }
    }]
    

})
//##method ko tabhi call karte jab hum instance ke sath work karte hai like employeeSchema.method
//## agar hum collection ke satgh work karte hai tab hum statics like Register.static


//for token generating
employeeSchema.methods.generateAuthToken = async function(){
try{
    console.log(this._id);
     const token = jwt.sign({_id:this._id.toString()},process.env.SECRETE_KEY);
     this.tokens=this.tokens.concat({token:token})
     await this.save();
     return token;
    }catch(error){
          res.send("the error part" + error);
          console.log("the error part" + error);
}
}



//for converting password into  hash password
employeeSchema.pre("save" , async function(next){
   
    if(this.isModified("password")){
        // const passwordHash = await bcrypt.hash(password , 10);
        this.password = await bcrypt.hash(this.password, 10);
        this .confirmpassword = await bcrypt.hash(this.password, 10);
    }
      next();

})



//now we need to create a collections

const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;