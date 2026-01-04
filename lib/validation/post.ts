import { z } from 'zod';

export const createPostSchema = z.object({
  text: z.string().min(1, 'Text is required').max(5000, 'Text is too long'),
  imageUrl: z.string().url('Invalid image url').optional().nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const updatePostSchema = z.object({
  text: z.string().min(1).max(5000).optional(),
  imageUrl: z.string().url().nullable().optional(),
});

export type UpdatePostInput = z.infer<typeof updatePostSchema>;
