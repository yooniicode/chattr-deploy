import { axiosInstance } from './axiosInstance'
import type { FileAttachment } from '../types/message'

export const fileApi = {
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axiosInstance.post<FileAttachment>('/files', formData)
    return data
  },
}
