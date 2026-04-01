import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
    } catch (err) {
        console.error(err);
    }
};
