import {z} from 'zod';

export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string()
});

export type signInSchemaType = z.infer<typeof signInSchema>;