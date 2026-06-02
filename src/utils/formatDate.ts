export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const

export const formatDateLabel = (value: string | Date): string => {
  const d = new Date(value)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`
}

export const getDateKey = (value: string | Date): string => {
  const d = new Date(value)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
