import { HumanMessage, AIMessage } from '@langchain/core/messages';

import { createOrchestrator } from '../ai-service/graph/workflow.js';
import {createChatSession, getChatSession, saveMessages} from "../services/chatbotService.service.js";




export const startChat = async (req, res,next) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        const result = await createChatSession(user_id)

        res.json({
            success: true,
            session_id: result.session_id,
            message: 'Chat session created successfully'
        });

    } catch (error) {
        next(error)
    }
};

export const sendMessage = async (req, res,next) => {
    const { message, session_id, user_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ error: 'session_id is required' });
    }
    if(!user_id) {
        return res.status(400).json({error: 'user_id is required'});
    }
    if (!message) {
        return res.status(400).json({ error: 'message is required' });
    }

    try {
        const existingSession = await getChatSession(session_id);

        if (!existingSession) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const previousMessages = existingSession.messages.map((msg) => {
            if (msg.type === 'human') return new HumanMessage(msg.content);
            if (msg.type === 'ai' || 'tool') return new AIMessage(msg.content);
            return msg;
        });


        const currentState = {
            messages: [...previousMessages, new HumanMessage(message)],
            session_id: session_id,
            user_id: user_id
        };
        const orchestrator = createOrchestrator();
        const finalState = await orchestrator.invoke(currentState);

        const messagesToSave = finalState.messages.map((msg) => ({
            type: msg._getType(),
            content: msg.content
        }));

        await saveMessages(session_id,messagesToSave)

        const lastMessage = finalState.messages[finalState.messages.length - 1];

        res.json({
            success: true,
            response: lastMessage?.content || 'Sorry, I had trouble processing that.',
            session_id: session_id,
        });

    } catch (error) {
        next(error)
    }
};