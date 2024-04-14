import {z} from 'zod';

export const acceptingMessagesSchema = z.object({
    acceptingMessages: z.boolean(),
});