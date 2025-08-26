import { z } from 'zod';
import { ApiFactory } from '../shared/boilerplate/src/types.js';
import { ServerContext } from '../types.js';
import { zUser } from '../utils/user.js';

const inputSchema = {} as const;

const outputSchema = {
  users: z.array(zUser),
} as const;

export const getUsersFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ userStore }) => ({
  name: 'getUsers',
  method: 'get',
  route: '/users',
  config: {
    title: 'Get Users',
    description: 'Fetches all users within the Linear organization.',
    inputSchema,
    outputSchema,
  },
  fn: async () => {
    const users = await userStore.get();

    return {
      users,
    };
  },
});
