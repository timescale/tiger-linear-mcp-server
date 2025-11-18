import { ApiFactory, InferSchema } from '@tigerdata/mcp-boilerplate';
import { z } from 'zod';
import { ServerContext } from '../types.js';
import { getUser, User, zUser } from '../utils/user.js';
import { simplifyIssue, zIssue } from '../utils/issue.js';

const inputSchema = {
  key: z.string().min(1).describe('The issue key, like ABC-123'),
} as const;

const outputSchema = {
  issue: zIssue,
  involvedUsers: z.array(zUser),
} as const;

export const getIssueFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ linear }) => ({
  name: 'get_issue',
  method: 'get',
  route: '/issue',
  config: {
    title: 'Get Issue',
    description: 'Fetches the details of a specific issue by its key.',
    inputSchema,
    outputSchema,
  },
  fn: async ({ key }): Promise<InferSchema<typeof outputSchema>> => {
    const rawIssue = await linear.issue(key);
    const involvedUserIds = new Set<string>();
    const issue = await simplifyIssue(linear, involvedUserIds, rawIssue);

    const involvedUsers = (
      await Promise.all(
        Array.from(involvedUserIds).map(async (id) => getUser(linear, id)),
      )
    ).filter((u): u is User => !!u);

    return {
      issue,
      involvedUsers,
    };
  },
});
