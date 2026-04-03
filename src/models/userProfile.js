import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
        },

        phone: String,

        profileImage: String,

        address: String,

        dateOfBirth: Date,
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },

        license: {
            number: {
                type: String,
                required: true,
            },
            expiryDate: {
                type: Date,
                required: true,
            },
            image: String,
        },
    },
    { timestamps: true },
);

export default mongoose.model("UserProfile", userProfileSchema);
