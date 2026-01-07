import mongoose from 'mongoose';
import {ENV} from './env.js';

export const connectDB = async () => {
    try{
        const {MONGO_URI} = ENV;
        if(!MONGO_URI) throw new Error("MONGOURI IS NOT SET");
        
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("mongodb conncected",conn.connection.host)
    }
    catch(error){
        console.error("error connection",error)
        process.exit(1)
    }
}