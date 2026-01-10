import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment is required').max(2000, 'Too long'),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
