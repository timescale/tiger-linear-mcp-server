import { z } from 'zod';
import { ServerContext } from '../types.js';
import { zUser } from '../utils/user.js';
import { getIssues, zIssue } from '../utils/issue.js';
import { ApiFactory } from '@tigerdata/mcp-boilerplate';

const inputSchema = {
  user_id: z.string().optional().describe('Filter issues by assignee user ID'),
  project_id: z.string().optional().describe('Filter issues by project ID'),
} as const;

const outputSchema = {
  issues: z.array(zIssue),
  involvedUsers: z.array(zUser),
} as const;

export const getIssuesFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ linear }) => ({
  name: 'get_issues',
  method: 'get',
  route: '/issues',
  config: {
    title: 'Get Issues',
    description: 'Fetches issues filtered by user ID and/or project ID.',
    inputSchema,
    outputSchema,
  },
  fn: async ({ user_id, project_id }) => {
    const result = await getIssues(linear, {
      userId: user_id,
      projectId: project_id,
    });

    return result;
  },
});
