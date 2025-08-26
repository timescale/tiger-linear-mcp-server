import type { LinearClient } from '@linear/sdk';
import { Project, zProject } from './project.js';

const simplifyProject = (project: any): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  content: project.content,
  priority: project.priorityLabel,
  startDate: project.startDate,
  targetDate: project.targetDate,
});

export const getProjects = async (linear: LinearClient): Promise<Project[]> => {
  const projectsConnection = await linear.projects();
  const projects = projectsConnection.nodes
    .map(project => simplifyProject(project))
    .filter((project): project is Project => project !== null);

  return projects;
};