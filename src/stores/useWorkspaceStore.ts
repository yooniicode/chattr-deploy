import { create } from 'zustand'
import type { Workspace } from '../types/workspace'

interface WorkspaceState {
  workspaces: Workspace[]
  activeWorkspaceId?: string
  setWorkspaces: (workspaces: Workspace[]) => void
  setActiveWorkspaceId: (workspaceId: string) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspaceId: (activeWorkspaceId) => set({ activeWorkspaceId }),
}))
