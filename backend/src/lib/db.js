import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
    try {
        const { MONGO_URI } = ENV;
        if (!MONGO_URI) throw new Error("MONGO_URI IS NOT SET");

        const conn = await mongoose.connect(MONGO_URI, {
            // Fixes connection drops and timeouts
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
        });

        console.log("MongoDB connected:", conn.connection.host);
    } 
    catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}