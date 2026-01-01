import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { subscriptionModel } from '~/models/subscriptionModel'

const createPayment = async ({ userId, planCode, paymentProvider = 'vnpay', billingCycle = 'monthly', amount }) => {
  try {
    const newSubscription = {
      userId,
      planCode,
      paymentProvider,
      status: 'pending',
      startAt: Date.now(),
      billingCycle,
      amount,
      endAt: billingCycle === 'monthly'
        ? Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
        : Date.now() + 365 * 24 * 60 * 60 * 1000 // 365 days
    }
    const createdSubscription = await subscriptionModel.createNew(newSubscription)
    const result = await subscriptionModel.findOneById(createdSubscription.insertedId.toString())
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tạo đăng ký mới')
  }
}

const updatePaymentStatus = async ({ subscriptionId, status }) => {
  try {
    const updatedSubscription = await subscriptionModel.updateStatus(subscriptionId, status)
    return updatedSubscription
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi cập nhật trạng thái thanh toán')
  }
}

const findPaymentById = async (subscriptionId) => {
  try {
    const subscription = await subscriptionModel.findOneById(subscriptionId)
    return subscription
  } catch (error) {
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi khi tìm kiếm đăng ký thanh toán')
  }
}

export const paymentService = {
  createPayment,
  updatePaymentStatus,
  findPaymentById
}