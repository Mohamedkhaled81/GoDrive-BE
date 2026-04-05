import mongoose from 'mongoose';

const chatBotSessionSchema = new mongoose.Schema({
    session_id: { type: String, required: true, unique: true },
    user_id: { type: String, required: true },
    messages: { type: Array, default: [] },
    created_at: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const ChatbotSession = mongoose.model('ChatbotSession', chatBotSessionSchema);
export default ChatbotSession;