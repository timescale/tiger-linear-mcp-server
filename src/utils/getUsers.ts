import type { LinearClient } from '@linear/sdk';
import { User, simplifyUser } from './user.js';

export const getUsers = async (linear: LinearClient): Promise<User[]> => {
  let response = await linear.users();
  while (response.pageInfo.hasNextPage) {
    response = await response.fetchNext();
  }
  return response.nodes.map((user) => simplifyUser(user) as User);
};
