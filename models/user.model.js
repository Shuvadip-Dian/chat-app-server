import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import  jwt  from "jsonwebtoken";

const userScheama = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:true
    }
},{timestamps:true});

userScheama.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
})

userScheama.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userScheama.methods.generateJwtToken = function () {
    return jwt.sign(
        {
            _id:this._id,
            username:this.username
        },
        process.env.JWT_TOKEN_KEY,
        {
            expiresIn:process.env.JWT_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model("User",userScheama);