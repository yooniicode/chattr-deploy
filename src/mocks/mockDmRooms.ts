import type { DmRoom } from '../types/dm'

export const mockDmRooms: DmRoom[] = [
  {
    id: 'dm-1',
    participants: [
      {
        id: 'user-2',
        email: 'hong@example.com',
        name: '홍길동',
        status: 'online',
      },
    ],
    lastMessage: {
      id: 'dm-preview-1',
      roomId: 'dm-1',
      type: 'text',
      content: '알겠습니다! 해당 부분 수정해서...',
      createdAt: '2026-05-26T14:19:00.000Z',
      author: {
        id: 'user-2',
        email: 'hong@example.com',
        name: '홍길동',
        status: 'online',
      },
    },
    updatedAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'dm-2',
    participants: [
      {
        id: 'user-3',
        email: 'kim@example.com',
        name: '김철수',
        status: 'offline',
      },
    ],
    lastMessage: {
      id: 'dm-preview-2',
      roomId: 'dm-2',
      type: 'text',
      content: '넵, 확인했습니다.',
      createdAt: '2026-05-26T14:10:00.000Z',
      author: {
        id: 'user-3',
        email: 'kim@example.com',
        name: '김철수',
        status: 'offline',
      },
    },
    updatedAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'dm-3',
    participants: [
      {
        id: 'user-4',
        email: 'younghee@example.com',
        name: '이영희',
        status: 'online',
      },
    ],
    lastMessage: {
      id: 'dm-preview-3',
      roomId: 'dm-3',
      type: 'text',
      content: '오늘 점심으로 김치찌개?',
      createdAt: '2026-05-26T13:00:00.000Z',
      author: {
        id: 'user-4',
        email: 'younghee@example.com',
        name: '이영희',
        status: 'online',
      },
    },
    updatedAt: '2026-05-26T00:00:00.000Z',
  },
]
