/* eslint-disable no-console */
import { RedisDB } from '~/config/redis.init'
import { BoardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const RECENT_BOARDS_PREFIX = 'recent_boards:'
const MAX_RECENT_BOARDS = 3
const EXPIRE_TIME = 60 * 60 * 24 * 30 // 30 days

/**
 * Redis Key Structure:
 * Key: recent_boards:{userId}
 * Type: Sorted Set (ZSET)
 * Score: timestamp (để sort theo thời gian truy cập)
 * Member: {boardId}:{boardTitle}
 */

const getRecentBoardsKey = (userId) => `${RECENT_BOARDS_PREFIX}${userId}`

/**
 * Track board access - thêm/update board trong recent list
 * Score = timestamp hiện tại, càng cao = càng mới
 */
const trackBoardAccess = async (userId, boardId) => {
  try {
    const redis = RedisDB.getRedis().instanceConnect

    if (!redis) {
      console.error('Redis client not available')
      return { success: false, message: 'Redis not available' }
    }

    // Verify board exists và user có quyền
    const board = await BoardModel.getBoardById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    const isMember = board.ownerIds.some(id => id.toString() === userId.toString()) ||
                     board.memberIds.some(id => id.toString() === userId.toString())

    if (!isMember) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'You do not have permission to access this board')
    }

    const key = getRecentBoardsKey(userId)
    const score = Date.now() // Timestamp làm score - càng cao càng mới
    const member = `${boardId}:${board.title}` // Lưu cả boardId và title

    console.log(`Tracking board access:
      - User: ${userId}
      - Board: ${boardId}
      - Title: ${board.title}
      - Score (timestamp): ${score}
      - Date: ${new Date(score).toISOString()}
    `)

    // Add/Update board vào sorted set với score = timestamp
    await redis.zAdd(key, { score, value: member })

    // Giới hạn chỉ giữ MAX_RECENT_BOARDS boards mới nhất
    // Xóa các boards cũ (score thấp)
    await redis.zRemRangeByRank(key, 0, -(MAX_RECENT_BOARDS + 1))

    // Set expire cho key (refresh TTL)
    await redis.expire(key, EXPIRE_TIME)

    console.log(`✅ Board tracked successfully with score: ${score}`)

    return {
      success: true,
      score,
      timestamp: new Date(score).toISOString()
    }
  } catch (error) {
    console.error('Error tracking board access:', error)
    throw error
  }
}

/**
 * Lấy danh sách recent boards
 * Sort DESC (mới nhất trước)
 */
const getRecentBoards = async (userId) => {
  try {
    const redis = RedisDB.getRedis().instanceConnect

    if (!redis) {
      console.error('Redis client not available')
      return []
    }

    const key = getRecentBoardsKey(userId)

    // Lấy board members từ sorted set, sort DESC (mới nhất trước)
    // REV = true để reverse order (cao -> thấp)
    const members = await redis.zRange(key, 0, MAX_RECENT_BOARDS - 1, { REV: true })

    if (!members || members.length === 0) {
      return []
    }

    console.log(`📊 Getting recent boards for user ${userId}:`, members)

    // Parse members để lấy boardId và title
    const recentBoards = members.map(member => {
      const [boardId, ...titleParts] = member.split(':')
      const title = titleParts.join(':') // Handle title có dấu ":"

      return {
        _id: boardId,
        title: title || 'Untitled Board'
      }
    })

    return recentBoards
  } catch (error) {
    console.error('Error getting recent boards:', error)
    // Fallback: return empty nếu Redis fail
    return []
  }
}

/**
 * Xóa 1 board khỏi recent list (khi user xóa board)
 */
const removeBoardFromRecents = async (userId, boardId) => {
  try {
    const redis = RedisDB.getRedis().instanceConnect

    if (!redis) {
      return { success: false }
    }

    const key = getRecentBoardsKey(userId)

    // Lấy tất cả members để tìm member chứa boardId
    const allMembers = await redis.zRange(key, 0, -1)
    const memberToRemove = allMembers.find(m => m.startsWith(`${boardId}:`))

    if (memberToRemove) {
      await redis.zRem(key, memberToRemove)
      console.log(`Removed board ${boardId} from recent list`)
    }

    return { success: true }
  } catch (error) {
    console.error('Error removing board from recents:', error)
    throw error
  }
}

/**
 * Xóa toàn bộ recent boards của user
 */
const clearRecentBoards = async (userId) => {
  try {
    const redis = RedisDB.getRedis().instanceConnect

    if (!redis) {
      return { success: false }
    }

    const key = getRecentBoardsKey(userId)
    await redis.del(key)

    console.log(`Cleared all recent boards for user ${userId}`)

    return { success: true }
  } catch (error) {
    console.error('Error clearing recent boards:', error)
    throw error
  }
}

export const recentBoardService = {
  trackBoardAccess,
  getRecentBoards,
  removeBoardFromRecents,
  clearRecentBoards
}
