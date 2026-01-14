import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

/**
 * API để remove user khỏi board (chỉ owner mới gọi được)
 */
export const removeUserFromBoardAPI = async (boardId, userId) => {
  try {
    const response = await authorizedAxiosInstance.delete(
      `${API_ROOT}/v1/boards/${boardId}/users/${userId}`
    )
    return response.data
  } catch (error) {
    throw error
  }
}
