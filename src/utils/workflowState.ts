import { LinearClient } from '@linear/sdk';

const stateCache = new Map<string, string | null>();

export const getWorkflowState = async (
  linear: LinearClient,
  id: string | null = null,
): Promise<string | null> => {
  if (!id) {
    return null;
  }
  const existing = stateCache.get(id);
  if (existing) {
    return existing;
  }
  const state = await linear.workflowState(id);
  stateCache.set(id, state.name);
  return state.name;
};
