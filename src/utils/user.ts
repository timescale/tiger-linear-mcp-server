import { z } from 'zod';
import type { LinearClient, User as LinearUser } from '@linear/sdk';

export const zUser = z.object({
  id: z.string().describe('The unique user ID'),
  email: z.string().describe('The email of the user'),
  name: z.string().describe('The name of the user'),
  displayName: z.string().describe('The display name of the user'),
});

export type User = z.infer<typeof zUser>;

export const simplifyUser = (user?: LinearUser | null): User | null =>
  user
    ? {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
      }
    : null;

const userCache = new Map<string, User | null>();
export const getUser = async (
  linear: LinearClient,
  id: string | null = null,
): Promise<User | null> => {
  if (!id) {
    return null;
  }
  const existing = userCache.get(id);
  if (existing) {
    return existing;
  }
  const user = simplifyUser(await linear.user(id));
  userCache.set(id, user);
  return user;
};
