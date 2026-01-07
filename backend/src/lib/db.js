import mongoose from 'mongoose';

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGOURI);
        console.log("mongodb conncected",conn.connection.host)
    }
    catch(error){
        console.error("error connection",error)
        process.exit(1)
    }
}