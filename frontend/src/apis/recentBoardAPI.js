import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

/**
 * Track board access - gọi khi user vào xem board
 */
export const trackBoardAccessAPI = async (boardId) => {
  try {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/recent-boards/track`, {
      boardId
    })
    return response.data
  } catch (error) {
    console.error('Track board access failed:', error)
    throw error
  }
}

/**
 * Lấy danh sách recent boards (3 boards gần đây nhất)
 */
export const getRecentBoardsAPI = async () => {
  try {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/recent-boards`)
    return response.data
  } catch (error) {
    console.error('Get recent boards failed:', error)
    return []
  }
}

/**
 * Xóa board khỏi recent list
 */
export const removeBoardFromRecentsAPI = async (boardId) => {
  try {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/recent-boards/${boardId}`)
    return response.data
  } catch (error) {
    console.error('Remove board from recents failed:', error)
    throw error
  }
}

/**
 * Xóa toàn bộ recent boards
 */
export const clearRecentBoardsAPI = async () => {
  try {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/recent-boards/clear`)
    return response.data
  } catch (error) {
    console.error('Clear recent boards failed:', error)
    throw error
  }
}
