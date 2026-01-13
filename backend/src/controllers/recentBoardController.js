import { StatusCodes } from 'http-status-codes'
import { recentBoardService } from '~/services/recentBoardService'

const trackAccess = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { boardId } = req.body

    if (!boardId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'boardId is required'
      })
    }

    const result = await recentBoardService.trackBoardAccess(userId, boardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getRecent = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const recentBoards = await recentBoardService.getRecentBoards(userId)

    res.status(StatusCodes.OK).json(recentBoards)
  } catch (error) {
    next(error)
  }
}

const removeBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { boardId } = req.params

    const result = await recentBoardService.removeBoardFromRecents(userId, boardId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const clearAll = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const result = await recentBoardService.clearRecentBoards(userId)

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const recentBoardController = {
  trackAccess,
  getRecent,
  removeBoard,
  clearAll
}
