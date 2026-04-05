import ChatbotSession from '../models/chatbotSession.model.js';
import { v4 as uuidv4 } from 'uuid';
import CustomError from "../utils/customError.js";


 export const createChatSession = async (user_id)=> {
        try {
            const session_id = uuidv4();

            const session = await ChatbotSession.create({
                session_id: session_id,
                user_id: user_id,
                messages: []
            });

            console.log(` Created new chat session: ${session_id} for user: ${user_id}`);

            return {
                session_id: session.session_id,
                messages: session.messages,
                created_at: session.created_at
            };
        } catch (error) {
            throw new CustomError('Failed to create chat session',404);
        }

}

export const getChatSession = async (session_id) => {

        const session = await ChatbotSession.findOne({ session_id });

        if (!session) {
            throw new CustomError('No session found',404);
        }

        return session

};


export const saveMessages = async (session_id, messages) => {
    try {
        await ChatbotSession.updateOne(
            { session_id },
            {
                messages: messages,
                updated_at: new Date()
            }
        );
    } catch (error) {
        throw new CustomError('Failed to add messages to session',404);
    }
};