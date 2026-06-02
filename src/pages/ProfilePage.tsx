import { Camera, Laptop, Monitor, ShieldCheck, Smartphone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { authApi } from '../api/authApi'
import { userApi } from '../api/userApi'
import { AppPageHeader } from '../components/common/AppPageHeader'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { MainLayout } from '../components/layout/MainLayout'
import { useAuthStore } from '../stores/useAuthStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { getOrCreateDeviceId } from '../utils/device'
import type { Device } from '../types/user'

function DeviceIcon({ type }: { type: 'laptop' | 'phone' | 'desktop' }) {
  const Icon = type === 'phone' ? Smartphone : type === 'desktop' ? Monitor : Laptop
  return (
    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
      <Icon size={19} />
    </span>
  )
}

export function ProfilePage() {
  const { updateCurrentUserProfile } = useWorkspaceStore()
  const authUser = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const currentUser = authUser ?? { id: '', email: '', name: '', status: 'online' as const }
  const [nickname, setNickname] = useState(currentUser.name)
  const [email, setEmail] = useState(currentUser.email)
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl)
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream
    }
  }, [cameraStream])

  useEffect(() => {
    userApi.getDevices().then(setDevices).catch(() => {})
  }, [])

  const saveAvatarUrl = (nextAvatarUrl: string) => {
    setAvatarUrl(nextAvatarUrl)
    void userApi.updateProfile({ avatarUrl: nextAvatarUrl }).then((updated) => {
      setUser({ ...currentUser, ...updated })
      updateCurrentUserProfile({
        avatarUrl: nextAvatarUrl,
        email: currentUser.email,
        name: currentUser.name,
        userId: currentUser.id,
      })
    })
  }

  const resizeImageToAvatar = (source: CanvasImageSource, width: number, height: number) => {
    const size = 160
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size
    if (!context) return ''
    const sourceSize = Math.min(width, height)
    const sourceX = (width - sourceSize) / 2
    const sourceY = (height - sourceSize) / 2
    context.drawImage(source, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size)
    return canvas.toDataURL('image/jpeg', 0.82)
  }

  const handleProfileImageChange = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const image = new Image()
    image.onload = () => {
      const nextAvatarUrl = resizeImageToAvatar(image, image.naturalWidth, image.naturalHeight)
      if (nextAvatarUrl) saveAvatarUrl(nextAvatarUrl)
      URL.revokeObjectURL(image.src)
      setAvatarMenuOpen(false)
    }
    image.src = URL.createObjectURL(file)
  }

  const closeCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop())
    setCameraStream(null)
    setCameraOpen(false)
  }

  const openCamera = async () => {
    setAvatarMenuOpen(false)
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'user' } })
      setCameraStream(stream)
      setCameraOpen(true)
    } catch {
      setCameraError('카메라를 사용할 수 없습니다. 브라우저 권한 또는 카메라 연결 상태를 확인해주세요.')
      setCameraOpen(true)
    }
  }

  const captureProfileImage = () => {
    const video = videoRef.current
    if (!video) return
    const nextAvatarUrl = resizeImageToAvatar(video, video.videoWidth, video.videoHeight)
    if (nextAvatarUrl) saveAvatarUrl(nextAvatarUrl)
    closeCamera()
  }

  const currentDeviceId = getOrCreateDeviceId()

  const handleDeviceLogout = (deviceId: string) => {
    void authApi.deleteDevice(deviceId).then(() => {
      setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId))
    })
  }

  const handleSave = () => {
    const nextName = nickname.trim()
    const nextEmail = email.trim()
    if (!nextName || !nextEmail) return

    void userApi.updateProfile({ name: nextName, avatarUrl }).then((updated) => {
      setUser({ ...currentUser, ...updated })
      updateCurrentUserProfile({
        avatarUrl,
        email: nextEmail,
        name: nextName,
        userId: currentUser.id,
      })
    })
  }

  return (
    <MainLayout header={<AppPageHeader />}>
      <div className="min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-5">
        <div className="flex w-full flex-col gap-4">
          <section className="mt-2">
            <h1 className="text-base font-extrabold text-slate-950">프로필 정보</h1>
            <p className="mt-2 text-sm font-medium text-slate-700">
              Chattr 서비스에 표시될 개인 정보를 관리하세요.
            </p>
          </section>

          <section className="rounded-lg border border-slate-300 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-[7rem_minmax(0,1fr)] gap-5 max-md:grid-cols-1">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <span className="grid size-24 place-items-center rounded-full border-4 border-[#dbe7ff] bg-[#dbe7ff] shadow-sm">
                    <Avatar name={currentUser.name} size={88} src={avatarUrl} />
                  </span>
                  <button
                    aria-label="프로필 이미지 변경"
                    className="absolute bottom-1 right-0 grid size-7 place-items-center rounded-full bg-[#0058BE] text-white shadow-md"
                    onClick={() => setAvatarMenuOpen((open) => !open)}
                    type="button"
                  >
                    <Camera size={15} />
                  </button>

                  {avatarMenuOpen ? (
                    <div className="absolute left-[5.75rem] top-[4.25rem] z-20 w-28 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-200 px-2 py-1">
                        <span className="text-[11px] font-bold text-slate-500">프로필</span>
                        <button
                          aria-label="프로필 이미지 메뉴 닫기"
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          onClick={() => setAvatarMenuOpen(false)}
                          type="button"
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <button
                        className="block h-9 w-full px-3 text-left text-xs font-bold text-slate-800 hover:bg-slate-100"
                        onClick={openCamera}
                        type="button"
                      >
                        카메라
                      </button>
                      <button
                        className="block h-9 w-full border-t border-slate-100 px-3 text-left text-xs font-bold text-slate-800 hover:bg-slate-100"
                        onClick={() => fileInputRef.current?.click()}
                        type="button"
                      >
                        내 파일
                      </button>
                    </div>
                  ) : null}

                  <input
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => handleProfileImageChange(event.currentTarget.files?.[0])}
                    ref={fileInputRef}
                    type="file"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                  <Input
                    className="font-medium text-slate-700"
                    id="nickname"
                    label="닉네임"
                    onChange={(event) => setNickname(event.currentTarget.value)}
                    value={nickname}
                  />
                  <Input
                    className="font-medium text-slate-700"
                    id="email"
                    label="이메일 주소"
                    onChange={(event) => setEmail(event.currentTarget.value)}
                    type="email"
                    value={email}
                  />
                </div>

                <div className="h-px bg-slate-200" />

                <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                  <ShieldCheck size={17} />
                  <span>안전하게 인증됨</span>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    className="min-h-8 min-w-28 px-3 py-1 text-xs font-semibold"
                    onClick={handleSave}
                    type="button"
                  >
                    변경 사항 저장
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {cameraOpen ? (
            <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/40 px-4">
              <section className="w-full max-w-sm overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
                <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-extrabold text-slate-950">프로필 사진 촬영</h2>
                  <button
                    aria-label="카메라 닫기"
                    className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    onClick={closeCamera}
                    type="button"
                  >
                    <X size={16} />
                  </button>
                </header>
                <div className="p-4">
                  {cameraStream ? (
                    <video autoPlay className="aspect-video w-full rounded-lg bg-slate-950 object-cover" muted playsInline ref={videoRef} />
                  ) : (
                    <div className="grid aspect-video w-full place-items-center rounded-lg bg-slate-100 px-6 text-center text-xs font-bold leading-5 text-slate-500">
                      {cameraError || '카메라를 준비하는 중입니다.'}
                    </div>
                  )}
                  <Button className="mt-4 min-h-9 w-full text-sm" disabled={!cameraStream} onClick={captureProfileImage} type="button">
                    촬영하기
                  </Button>
                </div>
              </section>
            </div>
          ) : null}

          <section className="flex items-center justify-between gap-5 rounded-lg border border-[#9dbdff] bg-[#dfeaff] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#1f6feb] text-white">
                <ShieldCheck size={18} />
              </span>
              <div>
                <h2 className="text-sm font-bold text-slate-950">계정 보안 상태</h2>
                <p className="mt-0.5 text-sm font-medium text-slate-700">
                  2단계 인증이 활성화되어 계정이 보호됩니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-base font-extrabold text-slate-950">로그인 기기 관리</h2>
              <p className="mt-1 text-sm font-medium text-slate-700">
                현재 계정에 로그인된 기기 목록입니다.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {devices.map((device) => {
                const isCurrentDevice = device.deviceId === currentDeviceId
                return (
                  <article
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-300 bg-white px-5 py-2.5"
                    key={device.deviceId}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <DeviceIcon type={device.platform === 'MOBILE' ? 'phone' : 'laptop'} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-medium text-slate-950">{device.deviceName}</h3>
                          {isCurrentDevice ? (
                            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                              현재 기기
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-500">{device.lastActiveAt}</p>
                      </div>
                    </div>
                    {!isCurrentDevice ? (
                      <button
                        className="shrink-0 text-sm font-bold text-[#BA1A1A] hover:text-[#9f1515]"
                        onClick={() => handleDeviceLogout(device.deviceId)}
                        type="button"
                      >
                        로그아웃
                      </button>
                    ) : null}
                  </article>
                )
              })}
              {devices.length === 0 ? (
                <p className="text-sm font-medium text-slate-500">등록된 기기가 없습니다.</p>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
