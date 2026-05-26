import { useQuery } from '@tanstack/react-query'
import { dmApi } from '../api/dmApi'

export const useDm = () =>
  useQuery({
    queryKey: ['dmRooms'],
    queryFn: dmApi.getRooms,
  })
