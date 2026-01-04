import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { subscriptionModel } from '~/models/subscriptionModel'
import { boardService } from '~/services/boardService'

// Giới hạn số lượng board theo gói
const PLAN_LIMITS = {
  free: {
    maxBoards: 10
  },
  pro: {
    maxBoards: Infinity
  },
  team: {
    maxBoards: Infinity
  }
}

// Xác định gói hiện tại của user dựa trên subscription đang active
const resolveUserPlan = async (userId) => {
  const activeSubscription = await subscriptionModel.findActiveByUserId(userId)

  if (!activeSubscription) return 'free'

  switch (activeSubscription.planCode) {
  case subscriptionModel.PLAN_CODE.PRO:
    return 'pro'
  default:
    return 'free'
  }
}

export const canCreateBoard = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded?._id

    if (!userId) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized'))
    }

    const planKey = await resolveUserPlan(userId.toString())
    const limits = PLAN_LIMITS[planKey] || PLAN_LIMITS.free

    // Đếm số board mà user là owner
    const currentBoardCount = await boardService.countBoardsByOwner(userId.toString())

    if (currentBoardCount >= limits.maxBoards) {
      return res.status(StatusCodes.FORBIDDEN).json({
        code: 'BOARD_LIMIT_REACHED',
        message: 'Free plan allows up to 10 boards. Upgrade to create more.'
      })
    }

    return next()
  } catch (error) {
    return next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi kiểm tra giới hạn board'))
  }
}
