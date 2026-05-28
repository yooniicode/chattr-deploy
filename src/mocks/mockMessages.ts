import dashboardPreview from '../assets/hero.png'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { currentUserId } from './mockWorkspaceMembers'

const currentUser: User = {
  id: currentUserId,
  email: 'kim.chattr@example.com',
  name: '김채트',
  status: 'online',
}

const kimCheolsu: User = {
  id: 'user-1',
  email: 'cheolsu@chattr.app',
  name: '김철수',
  status: 'online',
}

const leeYounghee: User = {
  id: 'user-2',
  email: 'younghee@chattr.app',
  name: '이영희',
  status: 'offline',
}

const kangJiwon: User = {
  id: 'user-3',
  email: 'jiwon@chattr.app',
  name: '강지원',
  status: 'online',
}

export const mockMessages: Message[] = [
  {
    id: 'message-1',
    roomId: 'channel-1',
    type: 'text',
    content: '백엔드 API 명세서 초안 공유드립니다. 확인 후 피드백 부탁드립니다.',
    displayTime: '오후 2:15',
    createdAt: '2026-05-26T14:15:00.000Z',
    attachments: [
      {
        id: 'file-1',
        name: 'api_spec_v1.0.pdf',
        url: '#',
        size: 1_200_000,
        contentType: 'application/pdf',
      },
    ],
    author: kimCheolsu,
  },
  {
    id: 'message-2',
    roomId: 'channel-1',
    type: 'text',
    content: '철수님 공유 감사합니다! 인증 로직 부분에서 제가 수정한 코드 스니펫인데, 확인해보시면 좋을 것 같습니다.',
    displayTime: '오후 2:30',
    createdAt: '2026-05-26T14:30:00.000Z',
    codeBlock:
      "const verifyToken = (req, res, next) => {\n  const bearerHeader = req.headers['authorization'];\n  if (typeof bearerHeader !== 'undefined') {\n    const bearer = bearerHeader.split(' ');\n    const bearerToken = bearer[1];\n    req.token = bearerToken;\n    next();\n  } else {\n    res.sendStatus(403);\n  }\n};",
    author: leeYounghee,
  },
  {
    id: 'message-3',
    roomId: 'channel-1',
    type: 'text',
    content: '확인 완료했습니다. 저는 이대로 진행해도 될 것 같습니다. 추가적인 논의는 이따 회의시간에 마무리하시죠!',
    displayTime: '오후 2:20',
    createdAt: '2026-05-26T14:45:00.000Z',
    parentMessageId: 'message-1',
    replyPreview: {
      authorName: '김철수',
      content: '안녕하세요 팀의 개발파트, 백엔드 API 명세서 초안 공유드립니다...',
    },
    author: kangJiwon,
  },
  {
    id: 'message-4',
    roomId: 'channel-1',
    type: 'text',
    content: '데이터베이스 스키마 관련해서 몇 가지 디자인 레퍼런스를 가져왔습니다.',
    displayTime: '오후 3:00',
    createdAt: '2026-05-26T15:00:00.000Z',
    imagePreviewUrl: dashboardPreview,
    attachments: [
      {
        id: 'file-2',
        name: 'dashboard_reference.png',
        url: '#',
        size: 1_200_000,
        contentType: 'image/png',
      },
    ],
    author: currentUser,
  },
]

const createChannelMessages = (roomId: string, channelLabel: string, firstAuthorName: string, secondAuthorName: string): Message[] => [
  {
    id: `${roomId}-message-1`,
    roomId,
    type: 'text',
    content: `${channelLabel} 채널 공지와 오늘 작업 내용을 공유드립니다.`,
    displayTime: '오후 1:10',
    createdAt: '2026-05-26T13:10:00.000Z',
    author: {
      id: `${roomId}-author-1`,
      email: `${roomId}@chattr.app`,
      name: firstAuthorName,
      status: 'online',
    },
  },
  {
    id: `${roomId}-message-2`,
    roomId,
    type: 'text',
    content: '확인했습니다. 필요한 내용은 이 채널에서 이어서 정리하겠습니다.',
    displayTime: '오후 1:24',
    createdAt: '2026-05-26T13:24:00.000Z',
    author: {
      ...currentUser,
      status: 'online',
    },
  },
  {
    id: `${roomId}-message-3`,
    roomId,
    type: 'text',
    content: '추가로 확인할 항목이 있으면 내일까지 코멘트 남기겠습니다.',
    displayTime: '오후 1:40',
    createdAt: '2026-05-26T13:40:00.000Z',
    author: {
      id: `${roomId}-author-2`,
      email: `${roomId}-member@chattr.app`,
      name: secondAuthorName,
      status: 'offline',
    },
  },
]

export const mockMessagesByRoomId: Record<string, Message[]> = {
  'channel-1': mockMessages,
  'channel-2': createChannelMessages('channel-2', 'backend-core', '박준영', '김민재'),
  'channel-3': createChannelMessages('channel-3', 'design-system', '이서윤', '최수진'),
  'channel-4': createChannelMessages('channel-4', '5/30 중간 보고 준비', '윤도현', '한가인'),
  'channel-0602-1': createChannelMessages('channel-0602-1', '0602 공지', '브랜드 리드', '가이드 관리자'),
  'channel-0602-2': createChannelMessages('channel-0602-2', 'brand-guide', '디자인 이영', '콘텐츠 리더'),
  'channel-0602-3': createChannelMessages('channel-0602-3', 'design-review', '시스템 매니저', '프론트 담당'),
  'channel-pj5-1': createChannelMessages('channel-pj5-1', 'project5 공통', '캠페인 리더', '성과 분석가'),
  'channel-pj5-2': createChannelMessages('channel-pj5-2', 'marketing-campaign', '콘텐츠 플래너', '광고 운영자'),
  'channel-pj5-3': createChannelMessages('channel-pj5-3', '성과 분석', '데이터 분석가', 'CRM 담당'),
}
