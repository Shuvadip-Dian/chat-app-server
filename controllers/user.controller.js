import {ApiResponce} from "../utils/ApiResponce.js"
import {ApiError} from "../utils/ApiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"

const userRegister = asyncHandler( async(req,res)=>{
    const { fullName, username, password, confirmePassword, gender} = req.body;
    if(!fullName || !username || !password || !confirmePassword || !gender){
        throw new ApiError(400,"All fields are required");
    }
    if(password!=confirmePassword){
        throw new ApiError(400,"Password do not match");
    }
    const existuser = await User.findOne({username});
    if(existuser){
        throw new ApiError(400,"username already exist");
    }
    const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const user = await User.create({
        fullName,
        username,
        password,
        profilePhoto:gender==="male"?maleProfilePhoto:femaleProfilePhoto,
        gender
    }) 
    if(!user){
        throw new ApiError(500,"user registration failed");
    }
    return res.status(200)
    .json(
        new ApiResponce(200,user,"registration successfull")
    )
})

const userLogin = asyncHandler( async(req,res)=>{
    const {username,password} = req.body;
    if(!username || !password ){
        throw new ApiError(400,"All fields are required");
    }
    const existuser = await User.findOne({username});
    if(!existuser){
        throw new ApiError(404, "User does not exist")
    }
    const validPassword = await existuser.isPasswordCorrect(password);
    if(!validPassword){
        throw new ApiError(401,"Password not matched")
    }
    const token = await existuser.generateJwtToken();

    const options = {
        maxAge:1*24*60*60*1000,
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("token",token,options)
    .json(
        new ApiResponce(200,existuser,"Login successfully")
    )
})

const userLogout = asyncHandler( (req,res)=>{
    const options = {
        maxAge:0,
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("token","",options).json(
        new ApiResponce(200,"Logout successfully")
    )
})

const getOtherUser = asyncHandler( async(req,res)=>{
    const loggedInUserId = req.id;
    const otherUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
    return res.status(200).json(
        new ApiResponce(200,otherUsers)
    )
})

export { 
    userRegister,
    userLogin,
    userLogout,
    getOtherUser
}