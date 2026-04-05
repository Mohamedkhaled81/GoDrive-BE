import mongoose from "mongoose";


export const connectDb = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
    } /*catch (err) {
        console.error(err);
        const conn = await mongoose.connect(process..env.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    }*/ catch(err) {
        console.error('❌ MongoDB Connection Failed:', err.message);
        process.exit(1);
    }
};
