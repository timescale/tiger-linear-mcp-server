import type { LinearClient } from '@linear/sdk';
import { Project, simplifyProject } from './project.js';

export const getProjects = async (linear: LinearClient): Promise<Project[]> => {
  const projectsConnection = await linear.projects();
  const projects = projectsConnection.nodes
    .map((project) => simplifyProject(project))
    .filter((project): project is Project => project !== null);

  return projects;
};
