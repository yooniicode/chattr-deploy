import { Camera, Laptop, MessageSquare, Monitor, ShieldCheck, Smartphone } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { MainLayout } from '../components/layout/MainLayout'
import defaultProfile from '../assets/default-profile.png'
import type { Device, User } from '../types/user'

const user: User = {
  id: 'user-1',
  email: 'kim.chattr@example.com',
  name: '김채트',
  avatarUrl: defaultProfile,
  status: 'online',
}

const devices: Array<Device & { location: string; current?: boolean; icon: 'laptop' | 'phone' | 'desktop' }> = [
  {
    id: 'device-1',
    name: 'MacBook Pro 14" (현재 기기)',
    location: 'Seoul, South Korea • 127.0.0.1',
    lastActiveAt: '2026-05-28T09:00:00.000Z',
    current: true,
    icon: 'laptop',
  },
  {
    id: 'device-2',
    name: 'iPhone 15 Pro',
    location: 'Busan, South Korea • 2시간 전 활동',
    lastActiveAt: '2026-05-28T07:00:00.000Z',
    icon: 'phone',
  },
  {
    id: 'device-3',
    name: 'Windows Workstation',
    location: 'Seoul, South Korea • 3일 전 활동',
    lastActiveAt: '2026-05-25T09:00:00.000Z',
    icon: 'desktop',
  },
]

function ProfileTopHeader() {
  return (
    <header className="flex h-10 items-center border-b border-slate-300 bg-[#fbfbff] px-6">
      <div className="flex items-center gap-2 text-[#0058BE]">
        <MessageSquare aria-hidden size={22} strokeWidth={2.5} />
        <span className="text-2xl font-extrabold">Chattr</span>
      </div>
    </header>
  )
}

function DeviceIcon({ type }: { type: 'laptop' | 'phone' | 'desktop' }) {
  const Icon = type === 'phone' ? Smartphone : type === 'desktop' ? Monitor : Laptop

  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
      <Icon size={19} />
    </span>
  )
}

export function ProfilePage() {
  return (
    <MainLayout header={<ProfileTopHeader />}>
      <div className="min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-5">
        <div className="flex w-full flex-col gap-4">
          <section>
            <h1 className="text-base font-extrabold text-slate-950">프로필 정보</h1>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Chattr 서비스에 표시될 개인 정보를 관리하세요.
            </p>
          </section>

          <section className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-5 max-md:grid-cols-1">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <img
                    alt={`${user.name} profile`}
                    className="size-24 rounded-full border-4 border-[#dbe7ff] object-cover shadow-sm"
                    src={user.avatarUrl}
                  />
                  <button
                    aria-label="프로필 이미지 변경"
                    className="absolute bottom-1 right-0 grid size-7 place-items-center rounded-full bg-[#0058BE] text-white shadow-md"
                    type="button"
                  >
                    <Camera size={15} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Input
                    id="nickname"
                    label="닉네임"
                    defaultValue={user.name}
                    className="font-medium text-slate-700"
                  />
                  <Input
                    id="email"
                    label="이메일 주소"
                    defaultValue={user.email}
                    type="email"
                    className="font-medium text-slate-700"
                  />
                </div>

                <div className="h-px bg-slate-200" />

                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <ShieldCheck size={17} />
                  <span>Cognito 기반 보안 인증됨</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button className="min-h-8 min-w-28 px-3 py-1 text-xs font-semibold" type="button">
                    변경 사항 저장
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-between gap-5 rounded-lg border border-[#9dbdff] bg-[#dfeaff] p-4">
            <div className="flex items-center gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#1f6feb] text-white">
                <ShieldCheck size={20} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-950">계정 보안 상태</h2>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  Cognito 2단계 인증이 활성화되어 보호 중입니다.
                </p>
              </div>
            </div>
            <button className="shrink-0 text-sm font-bold text-[#0058BE]" type="button">
              상태 확인
            </button>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">로그인 기기 관리</h2>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  현재 계정에 로그인된 기기 목록입니다. 최대 3개까지 등록 가능합니다.
                </p>
              </div>
              <button className="shrink-0 text-sm font-bold text-[#BA1A1A]" type="button">
                모든 기기에서 로그아웃
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {devices.map((device) => (
                <article
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-300 bg-white px-5 py-2.5"
                  key={device.id}
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <DeviceIcon type={device.icon} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-medium text-slate-950">{device.name}</h3>
                        {device.current ? (
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                            Active
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm font-medium text-slate-500">{device.location}</p>
                    </div>
                  </div>
                  <button
                    className={`shrink-0 text-sm font-bold ${
                      device.current ? 'text-slate-700' : 'text-[#BA1A1A]'
                    }`}
                    type="button"
                  >
                    {device.current ? '로그인 중' : '로그아웃'}
                  </button>
                </article>
              ))}
            </div>
          </section>

        </div>
      </div>
    </MainLayout>
  )
}
