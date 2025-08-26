import { z } from 'zod';
import { ApiFactory } from '../shared/boilerplate/src/types.js';
import { ServerContext } from '../types.js';
import { zProject } from '../utils/project.js';

const inputSchema = {} as const;

const outputSchema = {
  projects: z.array(zProject),
} as const;

export const getProjectsFactory: ApiFactory<
  ServerContext,
  typeof inputSchema,
  typeof outputSchema
> = ({ projectStore }) => ({
  name: 'getProjects',
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