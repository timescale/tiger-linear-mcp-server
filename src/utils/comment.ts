import { z } from 'zod';
import type { Comment as LinearComment } from '@linear/sdk';

export const zComment = z.object({
  userId: z
    .string()
    .optional()
    .describe('The ID of the user who made the comment'),
  body: z.string().describe('The content of the comment'),
  createdAt: z.string().describe('The date the comment was created'),
  updatedAt: z.string().describe('The date the comment was last updated'),
});

export type Comment = z.infer<typeof zComment>;

export function simplifyComment(comment: LinearComment): Comment;
export function simplifyComment(comment: null | undefined): null;
export function simplifyComment(
  comment: LinearComment | null | undefined,
): Comment | null {
  return comment
    ? {
        userId: comment.userId,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString(),
      }
    : null;
}
