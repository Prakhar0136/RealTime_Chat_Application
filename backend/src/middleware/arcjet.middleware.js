import aj from "../lib/arcjet.js";
import { ENV } from "../lib/env.js";
import{ isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
    if (ENV.NODE_ENV === "development") {
        return next();
    }
    try{
        const decision  = await aj.protect(req)
        if(decision.isDenied){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({message:"rate limit exceeded"});
        }
        else if(decision.reason.isBot){
            return res.status(403).json({message:"access denied"});
        }
        else{
            return res.status(403).json({message:"access denied by security policy"});
        }
    }
    if(decision.results.some(isSpoofedBot)){
        return res.status(403).json({message:"amalicious bot activity detected",error:"spoofed bot detected"});
    }
    next()
    }
    catch(error){
        console.log("arcjet protection error:",error)
    }
}