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
    .describe(
      'Filter issues by assignee user ID. Use this, userIds or projectId.',
    ),
  userIds: z
    .array(z.string())
    .nullable()
    .describe(
      'Filter issues assigned to any of these user IDs, e.g. every member of a team, in one call. Combined with userId if both are given. Null to skip.',
    ),
  projectId: z
    .string()
    .nullable()
    .describe('Filter issues by project ID. Use this, userId or userIds.'),
  completedOnly: z
    .boolean()
    .nullable()
    .transform((v) => v ?? false)
    .describe(
      'If true, only return issues completed within the time window instead of issues updated within it. Use this to answer "what shipped". Null means false.',
    ),
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
    description:
      'Fetches issues filtered by assignee user ID(s) and/or project ID, updated (or, with completedOnly, completed) within a time window.',
    inputSchema,
    outputSchema,
  },
  fn: async ({
    userId,
    userIds,
    projectId,
    completedOnly,
    timestampStart,
    timestampEnd,
  }): Promise<InferSchema<typeof outputSchema>> => {
    const assigneeIds = [
      ...new Set([...(userId ? [userId] : []), ...(userIds ?? [])]),
    ];
    if (!assigneeIds.length && !projectId) {
      throw new Error('You must specify userId, userIds or projectId.');
    }
    return getIssues(linear, {
      userIds: assigneeIds,
      projectId: projectId,
      completedOnly,
      updatedAfter: timestampStart?.toISOString() || getDateTimeFromDaysAgo(7),
      updatedBefore: timestampEnd?.toISOString() || new Date().toISOString(),
    });
  },
});
