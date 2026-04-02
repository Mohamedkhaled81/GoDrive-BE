import { Schema, model } from "mongoose";

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const chatSchema = new Schema(
    {
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        messages: [messageSchema],
    },
    { timestamps: true },
);

export default model("Chat", chatSchema);
