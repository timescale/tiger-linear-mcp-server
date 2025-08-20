import { z } from 'zod';
import type { Attachment as LinearAttachment } from '@linear/sdk';

export const zAttachment = z.object({
  sourceType: z
    .string()
    .optional()
    .describe('The source type of the attachment'),
  title: z.string().describe('The title of the attachment'),
  subtitle: z.string().optional().describe('The subtitle of the attachment'),
  url: z.string().url().describe('The URL of the attachment'),
});

export type Attachment = z.infer<typeof zAttachment>;

export function simplifyAttachment(attachment: LinearAttachment): Attachment;
export function simplifyAttachment(attachment: null | undefined): null;
export function simplifyAttachment(
  attachment: LinearAttachment | null | undefined,
): Attachment | null {
  return attachment
    ? {
        sourceType: attachment.sourceType,
        title: attachment.title,
        subtitle: attachment.subtitle,
        url: attachment.url,
      }
    : null;
}
