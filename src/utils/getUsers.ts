import type { LinearClient } from '@linear/sdk';
import { User, simplifyUser } from './user.js';

export const getUsers = async (linear: LinearClient): Promise<User[]> => {
  const usersConnection = await linear.users();
  const users = usersConnection.nodes
    .map(user => simplifyUser(user))
    .filter((user): user is User => user !== null);

  return users;
};