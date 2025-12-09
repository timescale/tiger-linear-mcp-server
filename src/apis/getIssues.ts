import { z } from 'zod';
import { ServerContext } from '../types.js';
import { zUser } from '../utils/user.js';
import { getIssues, zIssue } from '../utils/issue.js';
import { ApiFactory, InferSchema } from '@tigerdata/mcp-boilerplate';
import { getDateTimeFromDaysAgo } from '../utils/date.js';

const inputSchema = {
  userId: z
    .string()
    .nullable()
    .describe('Filter issues by assignee user ID. Use this or project_id.'),
  projectId: z
    .string()
    .nullable()
    .describe('Filter issues by project ID. Use this or user_id.'),
  timestampStart: z.coerce
    .date()
    .nullable()
    .describe(
      'Filter issues that have been updated at or after this date. Defaults to 7 days ago.',
    ),
  timestampEnd: z.coerce
    .date()
    .nullable()
    .describe(
      'Filter issues that have been updated at or before this date. Defaults to current time.',
    ),
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
  fn: async ({
    userId,
    projectId,
    timestampStart,
    timestampEnd,
  }): Promise<InferSchema<typeof outputSchema>> => {
    if (!userId && !projectId) {
      throw new Error('You must specify a user_id or a project_id.');
    }
    return getIssues(linear, {
      userId: userId,
      projectId: projectId,
      updatedAfter: timestampStart?.toISOString() || getDateTimeFromDaysAgo(7),
      updatedBefore: timestampEnd?.toISOString() || new Date().toISOString(),
    });
  },
});
