import { Schema, model } from "mongoose";

const carSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: String,
        pricePerDay: {
            type: Number,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        images: [String],

        availability: [
            {
                fromDate: Date,
                toDate: Date,
            },
        ],

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

export default model("Car", carSchema);
