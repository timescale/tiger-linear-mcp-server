import { ApiFactory } from '@tigerdata/mcp-boilerplate';
import { z } from 'zod';
import { ServerContext } from '../types.js';
import { getUser, User, zUser } from '../utils/user.js';
import { getTeam } from '../utils/team.js';
import { getWorkflowState } from '../utils/workflowState.js';
import { getProject } from '../utils/project.js';
import { simplifyComment, Comment } from '../utils/comment.js';
import { getIssueLabel } from '../utils/issueLabel.js';
import { Attachment, simplifyAttachment } from '../utils/attachment.js';
import { zIssue } from '../utils/issue.js';

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
  fn: async ({ key }) => {
    const issue = await linear.issue(key);
    let involvedUserIds = new Set<string>();
    if (issue.assigneeId) {
      involvedUserIds.add(issue.assigneeId);
    }
    if (issue.creatorId) {
      involvedUserIds.add(issue.creatorId);
    }

    const commentsConnection = await issue.comments();
    const comments: Comment[] = [];
    for (const c of commentsConnection.nodes) {
      if (c.userId) {
        involvedUserIds.add(c.userId);
      }
      comments.push(simplifyComment(c));
    }

    const involvedUsers = (
      await Promise.all(
        Array.from(involvedUserIds).map(async (id) => getUser(linear, id)),
      )
    ).filter((u): u is User => !!u);

    const attachmentsConnection = await issue.attachments();
    const attachments =
      attachmentsConnection.nodes.map<Attachment>(simplifyAttachment);

    return {
      issue: {
        assignee: issue.assigneeId,
        comments,
        createdAt: issue.createdAt.toISOString(),
        creator: issue.creatorId,
        description: issue.description || '',
        dueDate: (issue.dueDate as string) || null,
        estimate: (issue.estimate as number) || null,
        id: issue.id,
        identifier: issue.identifier,
        labels: (
          await Promise.all(
            issue.labelIds.map((id) => getIssueLabel(linear, id)),
          )
        ).filter((label): label is string => !!label),
        parentId: issue.parentId,
        priority: issue.priorityLabel,
        project: await getProject(linear, issue.projectId),
        state: await getWorkflowState(linear, issue.stateId),
        team: await getTeam(linear, issue.teamId),
        title: issue.title,
        url: issue.url,
        attachments,
      },
      involvedUsers,
    };
  },
});
