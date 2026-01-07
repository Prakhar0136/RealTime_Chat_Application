import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const {MONGOURI} = process.env;
        if(!MONGOURI) throw new Error("MONGOURI IS NOT SET");
        
        const conn = await mongoose.connect(MONGOURI);
        console.log("mongodb conncected",conn.connection.host)
    }
    catch(error){
        console.error("error connection",error)
        process.exit(1)
    }
}