import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BoardModel } from '~/models/boardModel'

/**
 * Middleware kiểm tra user có phải owner của board không
 * Yêu cầu: req.params.boardId và req.jwtDecoded._id
 */
const isBoardOwner = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { boardId } = req.params

    if (!boardId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Board ID is required')
    }

    // Lấy board từ database
    const board = await BoardModel.getBoardById(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Kiểm tra user có phải owner không
    const isOwner = board.ownerIds.some(ownerId =>
      ownerId.toString() === userId.toString()
    )

    if (!isOwner) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        'Forbidden: Only board owners can perform this action'
      )
    }

    // Lưu board vào req để controller có thể sử dụng
    req.board = board
    next()
  } catch (error) {
    next(error)
  }
}

export const boardMiddleware = {
  isBoardOwner
}
