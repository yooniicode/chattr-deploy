# Chattr — 실시간 팀 메시징 서비스

AWS Cognito 기반 인증과 WebSocket 실시간 통신을 갖춘 협업 메시징 플랫폼입니다.

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | React 19 + TypeScript |
| 빌드 | Vite 8 |
| 스타일 | TailwindCSS 4 |
| 상태 관리 | Zustand 5 |
| 서버 상태 | TanStack Query 5 |
| HTTP | Axios (인터셉터 기반 토큰 갱신) |
| 실시간 | STOMP over SockJS |
| 라우팅 | React Router v7 |

## 주요 기능

- **인증** — 회원가입 / 로그인 / 로그아웃 / 세션 복원 / 토큰 자동 갱신 (401 interceptor)
- **워크스페이스** — 생성 · 이름 수정 · 삭제 / 멤버 추가 · 권한 변경
- **채널** — 생성 · 수정 · 삭제 / 멤버 추가 / 날짜 구분선
- **DM** — 1:1 채팅방 생성 · 목록 조회 / 실시간 메시지
- **메시지** — 조회 · 수정 · 삭제 / 파일 첨부 (S3 Presigned URL) / 답글
- **프로필** — 닉네임 · 아바타 수정 / 카메라 촬영 / 로그인 기기 목록

## 프로젝트 구조

```
src/
├── api/                   # Axios 인스턴스 및 도메인별 API 모듈
│   ├── axiosInstance.ts   # 요청 인터셉터 (idToken 주입, 401 refresh)
│   ├── authApi.ts
│   ├── channelApi.ts
│   ├── dmApi.ts
│   ├── fileApi.ts
│   ├── messageApi.ts
│   ├── userApi.ts
│   └── workspaceApi.ts
├── components/
│   ├── chat/              # ChatInput, MessageList, ChatMessage 등
│   ├── channel/           # ChannelItem, ChannelMemberList, CreateChannelModal
│   ├── dm/                # DmMessage, DmRoomItem, CreateDmModal
│   ├── layout/            # MainLayout, ChannelSidebar, DmSidebar, WorkspaceSidebar
│   ├── workspace/         # WorkspaceCard, WorkspaceMemberItem 등
│   ├── common/            # Button, Input, Avatar, Modal 등
│   └── DataLoader.tsx     # 인증 후 전역 데이터 패칭 & WebSocket 구독 관리
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ChatPage.tsx
│   ├── DmPage.tsx
│   ├── ProfilePage.tsx
│   ├── WorkspaceManagePage.tsx
│   └── WorkspaceMemberPage.tsx
├── stores/                # Zustand 전역 상태
│   ├── useAuthStore.ts
│   ├── useWorkspaceStore.ts
│   ├── useChannelStore.ts
│   ├── useDmStore.ts
│   ├── useMessageStore.ts
│   └── useSocketStore.ts
├── types/                 # 도메인 타입 정의
├── utils/                 # formatDate, token, upload 등 유틸
├── websocket/             # STOMP 클라이언트 및 채널/DM 소켓 래퍼
│   ├── socketClient.ts    # StompSocketClient 싱글턴
│   ├── channelSocket.ts
│   └── dmSocket.ts
└── routes/
    └── router.tsx         # ProtectedRoute + BrowserRouter 설정
```

## 라우팅

| 경로 | 페이지 | 인증 필요 |
|------|--------|-----------|
| `/` | → `/chat` 리다이렉트 | — |
| `/login` | 로그인 | ✗ |
| `/signup` | 회원가입 | ✗ |
| `/chat` | 채널 채팅 | ✓ |
| `/dm` | 다이렉트 메시지 | ✓ |
| `/profile` | 프로필 설정 | ✓ |
| `/workspaces/manage` | 워크스페이스 관리 | ✓ |
| `/workspaces/members` | 워크스페이스 멤버 | ✓ |

## 시작하기

### 필수 조건

- Node.js 20+
- npm 10+

### 로컬 실행

```bash
# 패키지 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행
npm run dev
```

### 환경 변수

| 변수 | 설명 |
|------|------|
| `VITE_API_BASE_URL` | REST API 서버 base URL |
| `VITE_WS_URL` | WebSocket 서버 URL (SockJS endpoint) |

### 빌드

```bash
npm run build    # dist/ 폴더 생성
npm run preview  # 빌드 결과 로컬 확인
```

## 아키텍처

### 인증 흐름

```
로그인 → idToken / accessToken / refreshToken → sessionStorage 저장
              ↓
    모든 API 요청 헤더에 Bearer idToken 자동 주입
              ↓
    401 응답 → refreshToken으로 재발급 → 실패 시 /login 리다이렉트
```

### 실시간 메시지 흐름

```
DataLoader 마운트 → socketClient.connect(idToken)
                              ↓  STOMP over SockJS
채널/DM 진입 → socketClient.subscribe(/topic/rooms/{roomId})
                              ↓
수신 메시지 → useMessageStore 업데이트 → UI 반영

메시지 전송 → channelSocket.send / dmSocket.send → /app/messages
```

### 전역 상태 구조

```
useAuthStore        — 인증 유저, 세션 상태
useWorkspaceStore   — 워크스페이스 목록, 멤버, activeWorkspaceId
useChannelStore     — 채널 목록, 멤버 ID, unread 카운트, activeChannelId
useDmStore          — DM 방 목록, unread 카운트, activeRoomId
useMessageStore     — 채널/DM별 메시지 배열
useSocketStore      — WebSocket 연결 상태
```

## 배포

Vercel을 통해 배포합니다. `vercel.json`에 SPA 라우팅 rewrites가 설정되어 있습니다.

```bash
npm i -g vercel
vercel --prod
```

또는 GitHub 레포를 Vercel 대시보드에 연결 후 아래 환경 변수를 등록합니다.

```
VITE_API_BASE_URL = https://api.acc-chattr.cloud
VITE_WS_URL      = https://api.acc-chattr.cloud/ws
```

## API 명세

백엔드 Swagger: `https://api.acc-chattr.cloud/v3/api-docs`

| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/auth/login` | 로그인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/refresh` | 토큰 갱신 |
| POST | `/auth/logout` | 로그아웃 |
| GET | `/auth/devices` | 로그인 기기 목록 |
| GET | `/workspaces` | 워크스페이스 목록 |
| GET | `/workspaces/{id}/members` | 워크스페이스 멤버 조회 |
| GET | `/channels?workspaceId=` | 채널 목록 |
| GET | `/channels/{id}/members` | 채널 멤버 조회 |
| GET | `/messages?roomId=&roomType=` | 메시지 조회 |
| PATCH | `/messages/read-cursor` | 읽음 처리 |
| GET | `/dms` | DM 방 목록 |
| POST | `/dms` | DM 방 생성 |
| POST | `/files/presign` | S3 업로드용 Presigned URL 발급 |
