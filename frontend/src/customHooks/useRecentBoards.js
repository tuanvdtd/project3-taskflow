import { useState, useEffect, useCallback } from 'react'
import { getRecentBoardsAPI, trackBoardAccessAPI } from '~/apis/recentBoardAPI'

/**
 * Custom hook để quản lý Recent Boards
 * - Tự động fetch recent boards khi component mount
 * - Cung cấp function để track board access
 * - Cung cấp function để refresh danh sách
 */
export const useRecentBoards = () => {
  const [recentBoards, setRecentBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch recent boards từ server
  const fetchRecentBoards = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)

      const boards = await getRecentBoardsAPI()
      setRecentBoards(boards)
    } catch (err) {
      // console.error('Failed to fetch recent boards:', err)
      setError(err.message)
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  // Initial fetch khi component mount
  useEffect(() => {
    fetchRecentBoards()
  }, [fetchRecentBoards])

  // Track board access và refresh danh sách
  const trackAccess = useCallback(async (boardId) => {
    try {
      // Track trên server
      await trackBoardAccessAPI(boardId)

      // Refresh danh sách sau khi track
      // Không hiển thị loading để tránh flicker
      await fetchRecentBoards(false)
    } catch (error) {
      console.error('Failed to track board access:', error)
    }
  }, [fetchRecentBoards])

  // Refresh manually
  const refresh = useCallback(() => {
    return fetchRecentBoards()
  }, [fetchRecentBoards])

  return {
    recentBoards,
    loading,
    error,
    trackAccess,
    refresh
  }
}
