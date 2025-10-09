import type { LinearClient } from '@linear/sdk';
import { User, simplifyUser } from './user.js';
import { fetchAll } from './linear.js';

export const getUsers = async (linear: LinearClient): Promise<User[]> => {
  const linearUsers = await fetchAll(() => linear.users({ first: 250 }));
  return linearUsers.map((user) => simplifyUser(user) as User);
};
