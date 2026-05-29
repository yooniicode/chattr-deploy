import { currentUserId } from './mockWorkspaceMembers'
import type { Message } from '../types/message'
import type { User } from '../types/user'

export const me: User = {
  id: currentUserId,
  email: 'kim.chattr@example.com',
  name: '김채트',
  status: 'online',
}

const hong: User = {
  id: 'user-2',
  email: 'hong@example.com',
  name: '홍길동',
  status: 'online',
}

const kim: User = {
  id: 'user-3',
  email: 'kim@example.com',
  name: '김철수',
  status: 'offline',
}

const younghee: User = {
  id: 'user-4',
  email: 'younghee@example.com',
  name: '이영희',
  status: 'online',
}

export const mockDmMessagesByRoomId: Record<string, Message[]> = {
  'dm-1': [
    {
      id: 'dm-1-message-1',
      roomId: 'dm-1',
      type: 'text',
      content: '안녕하세요! 지난번 말씀하신 API 명세서 초안 다 작성했습니다. 확인 부탁드려요.',
      displayTime: '오후 2:15',
      createdAt: '2026-05-26T14:15:00.000Z',
      author: hong,
    },
    {
      id: 'dm-1-message-2',
      roomId: 'dm-1',
      type: 'text',
      content: '확인 감사합니다! 지금 바로 검토해보고 피드백 드릴게요.',
      displayTime: '오후 2:18',
      createdAt: '2026-05-26T14:18:00.000Z',
      author: me,
    },
    {
      id: 'dm-1-message-3',
      roomId: 'dm-1',
      type: 'file',
      content: '',
      displayTime: '오후 2:19',
      createdAt: '2026-05-26T14:19:00.000Z',
      attachments: [
        {
          id: 'dm-1-file-1',
          name: 'v1_api_specification_draft.pdf',
          url: '#',
          size: 2_400_000,
          contentType: 'application/pdf',
        },
      ],
      author: hong,
    },
    {
      id: 'dm-1-message-5',
      roomId: 'dm-1',
      type: 'text',
      content: '알겠습니다! 해당 부분 수정해서 내일 오전 회의 전까지 공유해 드릴게요.',
      displayTime: '방금 전',
      createdAt: '2026-05-26T14:21:00.000Z',
      author: hong,
    },
  ],
  'dm-2': [
    {
      id: 'dm-2-message-1',
      roomId: 'dm-2',
      type: 'text',
      content: '넵, 확인했습니다. 인증 로직 쪽 변경 사항은 오늘 중으로 정리해둘게요.',
      displayTime: '오후 1:04',
      createdAt: '2026-05-26T13:04:00.000Z',
      author: kim,
    },
    {
      id: 'dm-2-message-2',
      roomId: 'dm-2',
      type: 'text',
      content: '좋아요. 완료되면 backend-core 채널에도 공유 부탁드려요.',
      displayTime: '오후 1:08',
      createdAt: '2026-05-26T13:08:00.000Z',
      author: me,
    },
    {
      id: 'dm-2-message-3',
      roomId: 'dm-2',
      type: 'text',
      content: '공유까지 완료했습니다. 추가 확인 필요한 부분 있으면 말씀해주세요.',
      displayTime: '오후 1:32',
      createdAt: '2026-05-26T13:32:00.000Z',
      author: kim,
    },
  ],
  'dm-3': [
    {
      id: 'dm-3-message-1',
      roomId: 'dm-3',
      type: 'text',
      content: '오늘 점심으로 김치찌개 어때요? 회의 끝나고 바로 나가면 될 것 같아요.',
      displayTime: '오전 11:20',
      createdAt: '2026-05-26T11:20:00.000Z',
      author: younghee,
    },
    {
      id: 'dm-3-message-2',
      roomId: 'dm-3',
      type: 'text',
      content: '좋아요. 12시 10분쯤 로비에서 볼게요.',
      displayTime: '오전 11:24',
      createdAt: '2026-05-26T11:24:00.000Z',
      author: me,
    },
    {
      id: 'dm-3-message-3',
      roomId: 'dm-3',
      type: 'text',
      content: '네, 그때 봐요!',
      displayTime: '오전 11:25',
      createdAt: '2026-05-26T11:25:00.000Z',
      author: younghee,
    },
  ],
}

export const createDefaultDmMessages = (): Message[] => []
