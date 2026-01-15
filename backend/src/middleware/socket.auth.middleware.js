import jwt from "jsonwebtoken"
import User from "../models/User.js"
import {ENV} from "../lib/env.js"


export const socketAuthMiddleware = async(socket,next)=>{
    try{
        const token = socket.handshake.headers.cookie?.split("; ").find((row)=>row.startsWith("jwt="))?.split("=")[1]
        if(!token){
            console.log("socket connection rejected. no socket connected")
            return next(new Error("unauthorised - no token provided"))
        }

        const decoded =  jwt.verify(token,ENV.JWT_SECRET)
        if(!decoded){
            console.log("socket connection rejected, invalid token")
            return next(new Error("unauthorised - no token provided"))
        }
        
        const user  =await User.findById(decoded.userId).select("-password")
        if(!user){
            console.log("socket connection rejected, no user found")
            return next(new Error("user not found"))
        }

        socket.user = user
        socket.userId = user._id.toString()
        console.log(`socket authenticated for the user: ${user.fullName} (${user._id})`)

        next()
    }
    catch(error){
        console.log("error in socket authentication", error.message)
        next(new Error("unauthorised-authentication failed"))
    }
}