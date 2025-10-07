import { z } from 'zod';
import { ServerContext } from '../types.js';
import { zProject } from '../utils/project.js';
import { ApiFactory } from '@tigerdata/mcp-boilerplate';

const inputSchema = {} as const;

const outputSchema = {
  projects: z.array(zProject),
} as const;

export const getProjectsFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ projectStore }) => ({
  name: 'get_projects',
  method: 'get',
  route: '/projects',
  config: {
    title: 'Get Projects',
    description: 'Fetches all projects within the Linear organization.',
    inputSchema,
    outputSchema,
  },
  fn: async () => {
    const projects = await projectStore.get();

    return {
      projects,
    };
  },
});
