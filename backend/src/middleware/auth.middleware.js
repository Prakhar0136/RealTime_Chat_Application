import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";



export const protectRoute = async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message:"unauthorized access"})
        
        const decoded = jwt.verify(token,ENV.JWT_SECRET);
        if(!decoded) return res.status(401).json({message:"unauthorized access"})
        
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({message:"unauthorized access"})
        req.user = user;
        next();
    }
    catch(error){
        console.error("error in protect route middleware",error)
        res.status(500).json({message:"internal server error"}) 
    }
}