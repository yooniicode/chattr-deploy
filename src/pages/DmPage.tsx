import { ChatInput } from '../components/chat/ChatInput'
import { DmMessage } from '../components/dm/DmMessage'
import { DmSidebar } from '../components/layout/DmSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { mockDmMessages } from '../mocks/mockDmMessages'

function DmHeader() {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-slate-300 bg-[#fbfbff] px-6">
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-950">
        <span className="size-8 rounded-full bg-[radial-gradient(circle_at_65%_45%,#23d3bf_0,#0e7282_32%,#061827_70%)]" />
        <span className="absolute bottom-0.5 right-0.5 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
      </span>
      <div>
        <h1 className="text-sm font-extrabold text-slate-950">홍길동</h1>
        <p className="text-xs font-medium text-slate-600">소프트웨어 엔지니어 · 온라인</p>
      </div>
    </header>
  )
}

function DmMessageList() {
  return (
    <div className="flex flex-col gap-4 overflow-y-auto bg-[#fbfbff] px-6 py-5">
      <div className="mb-2 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <span className="px-4 text-xs font-bold text-slate-600">2023년 10월 24일 화요일</span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>
      {mockDmMessages.map((message) => (
        <DmMessage key={message.id} message={message} />
      ))}
    </div>
  )
}

export function DmPage() {
  return (
    <MainLayout header={<DmHeader />} sidebar={<DmSidebar />}>
      <DmMessageList />
      <ChatInput helperText="Enter를 눌러 메시지 전송, Shift + Enter로 줄바꿈" />
    </MainLayout>
  )
}
