import { z } from 'zod';

export const roomSchema = z.object({
  roomId: z.string().min(1, 'RoomId must be given!')
});