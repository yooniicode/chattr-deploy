import type { Message } from '../types/message'

export const mockMessages: Message[] = [
  {
    id: 'message-1',
    roomId: 'channel-1',
    type: 'text',
    content: 'CHATTR 프론트엔드 구조를 준비했습니다.',
    createdAt: '2026-05-26T00:00:00.000Z',
    author: {
      id: 'user-1',
      email: 'owner@chattr.app',
      name: 'Owner',
      status: 'online',
    },
  },
]
