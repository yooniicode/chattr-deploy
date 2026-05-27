import type { Channel } from '../types/channel'

export const mockChannels: Channel[] = [
  {
    id: 'channel-1',
    workspaceId: 'workspace-1',
    name: 'dev- 공통',
    type: 'public',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'channel-2',
    workspaceId: 'workspace-1',
    name: 'backend- core',
    type: 'public',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'channel-3',
    workspaceId: 'workspace-1',
    name: 'design- 시스템',
    type: 'public',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'channel-4',
    workspaceId: 'workspace-1',
    name: '5/30 중간 보고 준비',
    type: 'public',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
]
