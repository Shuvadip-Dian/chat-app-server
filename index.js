import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRoute from "./routes/user.route.js"
import messageRoute from "./routes/message.route.js"
import {app,server} from './socket/socket.js'

dotenv.config()

//const app= express();
const port = process.env.PORT || 8000;

// middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions));

// routes
app.use("/api/v1/user",userRoute)
app.use("/api/v1/message",messageRoute)


connectDB()
.then(()=>{
    server.listen(port, ()=>{
        console.log(`Server listen at port ${port}`);
    })
})
.catch((error)=>{
    console.log('MongoDB connection failled!');
})
