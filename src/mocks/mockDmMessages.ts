import type { Message } from '../types/message'

const hong = {
  id: 'user-2',
  email: 'hong@example.com',
  name: '홍길동',
  status: 'online' as const,
}

const me = {
  id: 'me',
  email: 'me@chattr.app',
  name: '나',
  status: 'offline' as const,
}

export const mockDmMessages: Message[] = [
  {
    id: 'dm-message-1',
    roomId: 'dm-1',
    type: 'text',
    content: '안녕하세요! 지난번 말씀하신 API 명세서 초안 다 작성했습니다. 확인 부탁드려요.',
    displayTime: '오후 2:15',
    createdAt: '2026-05-26T14:15:00.000Z',
    author: hong,
  },
  {
    id: 'dm-message-2',
    roomId: 'dm-1',
    type: 'text',
    content: '확인 감사합니다! 지금 바로 검토해보고 피드백 드릴게요.',
    displayTime: '오후 2:18',
    createdAt: '2026-05-26T14:18:00.000Z',
    author: me,
  },
  {
    id: 'dm-message-3',
    roomId: 'dm-1',
    type: 'file',
    content: '',
    displayTime: '오후 2:19',
    createdAt: '2026-05-26T14:19:00.000Z',
    attachments: [
      {
        id: 'dm-file-1',
        name: 'v1_api_specification_draft.pdf',
        url: '#',
        size: 2_400_000,
        contentType: 'application/pdf',
      },
    ],
    author: hong,
  },
  {
    id: 'dm-message-4',
    roomId: 'dm-1',
    type: 'text',
    content: '여기까지 읽으셨습니다',
    displayTime: '',
    createdAt: '2026-05-26T14:20:00.000Z',
    author: me,
  },
  {
    id: 'dm-message-5',
    roomId: 'dm-1',
    type: 'text',
    content: '알겠습니다! 해당 부분 수정해서 내일 오전 회의 전까지 공유해 드릴게요.',
    displayTime: '방금 전',
    createdAt: '2026-05-26T14:21:00.000Z',
    author: hong,
  },
]
