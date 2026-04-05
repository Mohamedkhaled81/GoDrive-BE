import { Schema, model } from "mongoose";

const chatbotMessageSchema = new Schema(
    {
        sender: {
            type: String,
            enum: ["user", "bot"],
            required: true,
        },
        text: String,
    },
    { timestamps: true },
);

const chatbotConversationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        context: {
            selectedCarId: {
                type: Schema.Types.ObjectId,
                ref: "Car",
                required: true,
            },
            fromDate: Date,
            toDate: Date,
            lastIntent: String,
        },

        messages: [chatbotMessageSchema],
    },
    { timestamps: true },
);

export default model(
    "ChatbotConversation",
    chatbotConversationSchema,
);
