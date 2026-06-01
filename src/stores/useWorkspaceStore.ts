import { create } from 'zustand'
import { workspaceApi } from '../api/workspaceApi'
import type { User } from '../types/user'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '../types/workspace'

const isValidWorkspace = (workspace: Workspace | null | undefined): workspace is Workspace =>
  Boolean(workspace?.id)

const isValidWorkspaceMember = (member: WorkspaceMember | null | undefined): member is WorkspaceMember =>
  Boolean(member?.id && member.user?.id)

interface WorkspaceState {
  workspaces: Workspace[]
  workspaceMembers: WorkspaceMember[]
  workspaceMembersByWorkspaceId: Record<string, WorkspaceMember[]>
  activeWorkspaceId?: string
  addWorkspace: (workspace: Workspace, members?: WorkspaceMember[]) => void
  deleteWorkspace: (workspaceId: string) => void
  updateCurrentUserProfile: (profile: { avatarUrl?: string; email: string; name: string; userId: string }) => void
  updateWorkspaceMemberRole: (memberId: string, role: WorkspaceRole) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setWorkspaceMembers: (members: WorkspaceMember[]) => void
  setActiveWorkspaceId: (workspaceId: string) => void
  fetchWorkspaces: () => Promise<void>
  fetchMembers: (workspaceId: string) => Promise<void>
  replaceWorkspaceState: (state: {
    activeWorkspaceId?: string
    workspaceMembers: WorkspaceMember[]
    workspaceMembersByWorkspaceId: Record<string, WorkspaceMember[]>
    workspaces: Workspace[]
  }) => void
}

export const useWorkspaceStore = create<WorkspaceState>()((set) => ({
  workspaces: [],
  workspaceMembers: [],
  workspaceMembersByWorkspaceId: {},
  activeWorkspaceId: undefined,
  addWorkspace: (workspace, members) =>
    set((state) => {
      if (!isValidWorkspace(workspace)) return {}

      return {
        workspaces: state.workspaces.some((item) => item.id === workspace.id)
          ? state.workspaces
          : [...state.workspaces.filter(isValidWorkspace), workspace],
        workspaceMembersByWorkspaceId: state.workspaceMembersByWorkspaceId[workspace.id]
          ? state.workspaceMembersByWorkspaceId
          : {
              ...state.workspaceMembersByWorkspaceId,
              [workspace.id]: (members ?? []).filter(isValidWorkspaceMember),
            },
      }
    }),
  deleteWorkspace: (workspaceId) =>
    set((state) => {
      const nextWorkspaces = state.workspaces.filter(isValidWorkspace).filter((workspace) => workspace.id !== workspaceId)
      const nextMembersByWorkspaceId = { ...state.workspaceMembersByWorkspaceId }
      delete nextMembersByWorkspaceId[workspaceId]
      const nextActiveWorkspaceId =
        state.activeWorkspaceId === workspaceId ? nextWorkspaces[0]?.id : state.activeWorkspaceId

      return {
        activeWorkspaceId: nextActiveWorkspaceId,
        workspaceMembers: nextActiveWorkspaceId ? (nextMembersByWorkspaceId[nextActiveWorkspaceId] ?? []) : [],
        workspaceMembersByWorkspaceId: nextMembersByWorkspaceId,
        workspaces: nextWorkspaces,
      }
    }),
  updateCurrentUserProfile: (profile) =>
    set((state) => {
      const updateMembers = (members: WorkspaceMember[]) =>
        members.map((member) =>
          member.user.id === profile.userId
            ? {
                ...member,
                user: {
                  ...member.user,
                  avatarUrl: profile.avatarUrl,
                  email: profile.email,
                  name: profile.name,
                } as User,
              }
            : member,
        )

      const workspaceMembersByWorkspaceId = Object.fromEntries(
        Object.entries(state.workspaceMembersByWorkspaceId).map(([workspaceId, members]) => [
          workspaceId,
          updateMembers(members),
        ]),
      )
      const workspaceId = state.activeWorkspaceId ?? ''

      return {
        workspaceMembers: workspaceId
          ? (workspaceMembersByWorkspaceId[workspaceId] ?? updateMembers(state.workspaceMembers))
          : updateMembers(state.workspaceMembers),
        workspaceMembersByWorkspaceId,
      }
    }),
  updateWorkspaceMemberRole: (memberId, role) =>
    set((state) => {
      const workspaceId = state.activeWorkspaceId ?? ''
      if (!workspaceId) return {}
      const nextMembers = (state.workspaceMembersByWorkspaceId[workspaceId] ?? state.workspaceMembers).map(
        (member) => (member.id === memberId ? { ...member, role } : member),
      )

      return {
        workspaceMembers: nextMembers,
        workspaceMembersByWorkspaceId: {
          ...state.workspaceMembersByWorkspaceId,
          [workspaceId]: nextMembers,
        },
      }
    }),
  setWorkspaces: (workspaces) =>
    set((state) => {
      const nextWorkspaces = workspaces.filter(isValidWorkspace)
      const activeWorkspaceExists = nextWorkspaces.some((workspace) => workspace.id === state.activeWorkspaceId)
      const activeWorkspaceId = activeWorkspaceExists ? state.activeWorkspaceId : nextWorkspaces[0]?.id

      return {
        activeWorkspaceId,
        workspaceMembers: activeWorkspaceId
          ? (state.workspaceMembersByWorkspaceId[activeWorkspaceId] ?? []).filter(isValidWorkspaceMember)
          : [],
        workspaces: nextWorkspaces,
      }
    }),
  setWorkspaceMembers: (workspaceMembers) =>
    set((state) => {
      const nextWorkspaceMembers = workspaceMembers.filter(isValidWorkspaceMember)
      const workspaceId = state.activeWorkspaceId ?? ''
      if (!workspaceId) return { workspaceMembers: nextWorkspaceMembers }
      return {
        workspaceMembers: nextWorkspaceMembers,
        workspaceMembersByWorkspaceId: {
          ...state.workspaceMembersByWorkspaceId,
          [workspaceId]: nextWorkspaceMembers,
        },
      }
    }),
  setActiveWorkspaceId: (activeWorkspaceId) =>
    set((state) => {
      const nextWorkspaces = state.workspaces.filter(isValidWorkspace)
      const nextActiveWorkspaceId = nextWorkspaces.some((workspace) => workspace.id === activeWorkspaceId)
        ? activeWorkspaceId
        : nextWorkspaces[0]?.id

      return {
        activeWorkspaceId: nextActiveWorkspaceId,
        workspaceMembers: nextActiveWorkspaceId
          ? (state.workspaceMembersByWorkspaceId[nextActiveWorkspaceId] ?? []).filter(isValidWorkspaceMember)
          : [],
      }
    }),
  fetchWorkspaces: async () => {
    const workspaces = (await workspaceApi.getWorkspaces()).filter(isValidWorkspace)
    set((state) => {
      const activeWorkspaceExists = workspaces.some((workspace) => workspace.id === state.activeWorkspaceId)
      const activeWorkspaceId = activeWorkspaceExists ? state.activeWorkspaceId : workspaces[0]?.id

      return {
        workspaces,
        activeWorkspaceId,
        workspaceMembers: activeWorkspaceId
          ? (state.workspaceMembersByWorkspaceId[activeWorkspaceId] ?? []).filter(isValidWorkspaceMember)
          : [],
      }
    })
  },
  fetchMembers: async (workspaceId) => {
    const members = (await workspaceApi.getMembers(workspaceId)).filter(isValidWorkspaceMember)
    set((state) => ({
      workspaceMembers: state.activeWorkspaceId === workspaceId ? members : state.workspaceMembers,
      workspaceMembersByWorkspaceId: {
        ...state.workspaceMembersByWorkspaceId,
        [workspaceId]: members,
      },
    }))
  },
  replaceWorkspaceState: (nextState) => set(nextState),
}))
