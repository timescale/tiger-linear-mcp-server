import { z } from 'zod';
import { ApiFactory } from '../shared/boilerplate/src/types.js';
import { ServerContext } from '../types.js';
import { User, zUser } from '../utils/user.js';

const inputSchema = {
  keyword: z
    .string()
    .min(0)
    .nullable()
    .describe(
      'Keyword to use to find partial matches on users. Will return users whose id (e.g. ab5d27fb-e6f5-417b-84a7-91f9aa2a5fc5), name, displayName, or email contain the given keyword. This is case insensitive.',
    ),
} as const;

const outputSchema = {
  users: z.array(zUser),
} as const;

const getKeywordPredicate = (keyword: string): ((user: User) => boolean) => {
  const normalizedKeyword = keyword.toLowerCase();
  return (user) => user.displayName.toLowerCase();
};

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
  fn: async (keyword) => {
    const allUsers = await userStore.get();

    return {
      users: keyword ? allUsers.where((x) => x) : allUsers,
    };
  },
});
