import { z } from 'zod';
import { ServerContext } from '../types.js';
import { Project, zProject } from '../utils/project.js';
import { ApiFactory, InferSchema } from '@tigerdata/mcp-boilerplate';

const inputSchema = {
  keyword: z
    .string()
    .min(0)
    .nullable()
    .describe(
      'Keyword to use to find partial matches on project. Will return projects whose id (e.g. ab5d27fb-e6f5-417b-84a7-91f9aa2a5fc5), name, description, or content contain the given keyword. This is case insensitive.',
    ),
} as const;

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
  fn: async ({ keyword }): Promise<InferSchema<typeof outputSchema>> => {
    const allProjects = await projectStore.get();

    return {
      projects: keyword
        ? allProjects.filter((project: Project) => {
            const normalizedKeyword = keyword.toLowerCase();
            const { content, id, name, description } = project;

            return (
              content?.toLowerCase().includes(normalizedKeyword) ||
              id.toLowerCase().includes(normalizedKeyword) ||
              name.toLowerCase().includes(normalizedKeyword) ||
              description.toLowerCase().includes(normalizedKeyword)
            );
          })
        : allProjects,
    };
  },
});
