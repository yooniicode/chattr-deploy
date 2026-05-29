import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockWorkspaces } from '../mocks/mockWorkspace'
import { currentUserId, mockWorkspaceMembersByWorkspaceId } from '../mocks/mockWorkspaceMembers'
import type { User } from '../types/user'
import type { Workspace, WorkspaceMember } from '../types/workspace'

interface WorkspaceState {
  workspaces: Workspace[]
  workspaceMembers: WorkspaceMember[]
  workspaceMembersByWorkspaceId: Record<string, WorkspaceMember[]>
  activeWorkspaceId?: string
  addWorkspace: (workspace: Workspace, members?: WorkspaceMember[]) => void
  addWorkspaceMember: (nickname: string) => WorkspaceMember
  deleteWorkspace: (workspaceId: string) => void
  updateCurrentUserProfile: (profile: { avatarUrl?: string; email: string; name: string }) => void
  updateWorkspaceMemberRole: (memberId: string, role: WorkspaceMember['role']) => void
  setWorkspaces: (workspaces: Workspace[]) => void
  setWorkspaceMembers: (members: WorkspaceMember[]) => void
  setActiveWorkspaceId: (workspaceId: string) => void
}

const createDefaultWorkspaceMembers = (workspaceId: string, user?: User): WorkspaceMember[] => [
  {
    id: `${workspaceId}-member-current`,
    joinedAt: new Date().toISOString(),
    role: 'admin',
    user: {
      id: currentUserId,
      email: 'kim.chattr@example.com',
      name: '김채트',
      ...user,
      status: 'online',
    },
  },
]

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: mockWorkspaces,
      workspaceMembers: mockWorkspaceMembersByWorkspaceId.apollo,
      workspaceMembersByWorkspaceId: mockWorkspaceMembersByWorkspaceId,
      activeWorkspaceId: mockWorkspaces[0]?.id,
      addWorkspace: (workspace, members) =>
        set((state) => {
          const currentUser = Object.values(state.workspaceMembersByWorkspaceId)
            .flat()
            .find((member) => member.user.id === currentUserId)?.user
          const workspaceMembers = members ?? createDefaultWorkspaceMembers(workspace.id, currentUser)

          return {
            workspaces: state.workspaces.some((item) => item.id === workspace.id)
              ? state.workspaces
              : [...state.workspaces, workspace],
            workspaceMembersByWorkspaceId: state.workspaceMembersByWorkspaceId[workspace.id]
              ? state.workspaceMembersByWorkspaceId
              : {
                  ...state.workspaceMembersByWorkspaceId,
                  [workspace.id]: workspaceMembers,
                },
          }
        }),
      addWorkspaceMember: (nickname) => {
        const now = Date.now()
        const member: WorkspaceMember = {
          id: `workspace-member-${now}`,
          joinedAt: new Date(now).toISOString(),
          role: 'member',
          user: {
            id: `workspace-user-${now}`,
            email: `${now}@example.com`,
            name: nickname,
            status: 'offline',
          },
        }

        set((state) => {
          const workspaceId = state.activeWorkspaceId ?? mockWorkspaces[0]?.id ?? 'apollo'
          const nextMembers = [...(state.workspaceMembersByWorkspaceId[workspaceId] ?? []), member]

          return {
            workspaceMembers: nextMembers,
            workspaceMembersByWorkspaceId: {
              ...state.workspaceMembersByWorkspaceId,
              [workspaceId]: nextMembers,
            },
          }
        })
        return member
      },
      deleteWorkspace: (workspaceId) =>
        set((state) => {
          const nextWorkspaces = state.workspaces.filter((workspace) => workspace.id !== workspaceId)
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
              member.user.id === currentUserId
                ? {
                    ...member,
                    user: {
                      ...member.user,
                      avatarUrl: profile.avatarUrl,
                      email: profile.email,
                      name: profile.name,
                    },
                  }
                : member,
            )

          const workspaceMembersByWorkspaceId = Object.fromEntries(
            Object.entries(state.workspaceMembersByWorkspaceId).map(([workspaceId, members]) => [
              workspaceId,
              updateMembers(members),
            ]),
          )
          const workspaceId = state.activeWorkspaceId ?? mockWorkspaces[0]?.id ?? 'apollo'

          return {
            workspaceMembers: workspaceMembersByWorkspaceId[workspaceId] ?? updateMembers(state.workspaceMembers),
            workspaceMembersByWorkspaceId,
          }
        }),
      updateWorkspaceMemberRole: (memberId, role) =>
        set((state) => {
          const workspaceId = state.activeWorkspaceId ?? mockWorkspaces[0]?.id ?? 'apollo'
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
      setWorkspaces: (workspaces) => set({ workspaces }),
      setWorkspaceMembers: (workspaceMembers) =>
        set((state) => {
          const workspaceId = state.activeWorkspaceId ?? mockWorkspaces[0]?.id ?? 'apollo'

          return {
            workspaceMembers,
            workspaceMembersByWorkspaceId: {
              ...state.workspaceMembersByWorkspaceId,
              [workspaceId]: workspaceMembers,
            },
          }
        }),
      setActiveWorkspaceId: (activeWorkspaceId) =>
        set((state) => ({
          activeWorkspaceId,
          workspaceMembers: state.workspaceMembersByWorkspaceId[activeWorkspaceId] ?? [],
        })),
    }),
    {
      name: 'chattr-workspace-store',
      partialize: (state) => ({
        activeWorkspaceId: state.activeWorkspaceId,
        workspaceMembers: state.workspaceMembers,
        workspaceMembersByWorkspaceId: state.workspaceMembersByWorkspaceId,
        workspaces: state.workspaces,
      }),
    },
  ),
)
