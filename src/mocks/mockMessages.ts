import type { Message } from '../types/message'
import dashboardPreview from '../assets/hero.png'

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
    author: {
      id: 'user-1',
      email: 'owner@chattr.app',
      name: '김철수',
      status: 'online',
    },
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
    author: {
      id: 'user-2',
      email: 'younghee@chattr.app',
      name: '이영희',
      status: 'offline',
    },
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
    author: {
      id: 'user-3',
      email: 'jiwon@chattr.app',
      name: '강지원',
      status: 'online',
    },
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
    author: {
      id: 'user-4',
      email: 'me@chattr.app',
      name: '나',
      status: 'offline',
    },
  },
]
