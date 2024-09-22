import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const isAthenticated = asyncHandler((req,_,next)=>{
    try {
        const token = req.cookies.token;
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
        const decode = jwt.verify(token,process.env.JWT_TOKEN_KEY);
        if(!decode){
            throw new ApiError(401,"Invalid tocken");
        }
        req.id = decode._id;
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid Access Token")
    }
})

export default isAthenticated