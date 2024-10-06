import { z } from 'zod';

export const postSchemaValidation = z.object({
  userId: z.string().nonempty('User ID is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().optional(),
  likes: z.array(z.string()).optional(),
  comments: z
    .array(
      z.object({
        userId: z.string().nonempty('User ID is required for comments'),
        content: z.string().min(1, 'Comment content is required'),
        createdAt: z.date().optional(),
      }),
    )
    .optional(),
  isReacted: z.boolean().optional(),
  shares: z
    .array(
      z.object({
        user: z.string().nonempty('User ID is required for shares').optional(),
        sharedPostId: z
          .string()
          .nonempty('Shared Post ID is required')
          .optional(),
        sharedAt: z.date().optional(),
        contents: z.string().optional(),
      }),
    )
    .optional(),
});

export const postValidationSchema = {
  postSchemaValidation,
};
