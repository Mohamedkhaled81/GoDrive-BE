import { z } from 'zod';

export const sendMessageSchema = z.object({
  roomId: z.string().min(1, 'RoomId must be given!'),
  message: z.string().min(1, 'Message cannot be empty!').max(550, 'Max length of a message is 500 chars!'),
});