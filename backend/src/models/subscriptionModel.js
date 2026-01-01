import Joi from 'joi'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const SUBSCRIPTION_COLLECTION_NAME = 'subscriptions'

// Các trạng thái của subscription
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active', // Đang dùng
  EXPIRED: 'expired', // Hết hạn
  PENDING: 'pending', // Thanh toán thất bại
  CANCELED: 'canceled' // User hủy, phục vụ tính năng lưu lại thanh toán
}

// Các loại plan code
const PLAN_CODE = {
  PRO: 'Pro',
  FREE: 'Free'
}

// Các payment provider
const PAYMENT_PROVIDER = {
  VNPAY: 'vnpay',
  MOMO: 'momo',
  STRIPE: 'stripe'
}

const SUBSCRIPTION_COLLECTION_SCHEMA = Joi.object({
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  planCode: Joi.string().valid(...Object.values(PLAN_CODE)).required(),
  status: Joi.string().valid(...Object.values(SUBSCRIPTION_STATUS)).default(SUBSCRIPTION_STATUS.PENDING),
  startAt: Joi.date().timestamp('javascript').required(),
  endAt: Joi.date().timestamp('javascript').required(),
  paymentProvider: Joi.string().valid(...Object.values(PAYMENT_PROVIDER)).required(),
  billingCycle: Joi.string().valid('monthly', 'yearly').default('monthly'),
  amount: Joi.number().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const UNCHANGE_FIELDS = ['_id', 'userId', 'createdAt']

const validBeforeCreate = async (data) => {
  return await SUBSCRIPTION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)
    // Convert userId string to ObjectId
    const newData = {
      ...validData,
      userId: new ObjectId(validData.userId)
    }

    const result = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).insertOne(newData)
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const subscription = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return subscription
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByUserId = async (userId) => {
  try {
    const subscription = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOne({
      userId: new ObjectId(userId),
      _destroy: false
    })
    return subscription
  } catch (error) {
    throw new Error(error)
  }
}

const findActiveByUserId = async (userId) => {
  try {
    const subscription = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOne({
      userId: new ObjectId(userId),
      status: SUBSCRIPTION_STATUS.ACTIVE,
      _destroy: false
    })
    return subscription
  } catch (error) {
    throw new Error(error)
  }
}

const findAllByUserId = async (userId) => {
  try {
    const subscriptions = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME)
      .find({
        userId: new ObjectId(userId),
        _destroy: false
      })
      .sort({ createdAt: -1 })
      .toArray()
    return subscriptions
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (subscriptionId, updateData) => {
  try {
    Object.keys(updateData).forEach((key) => {
      if (UNCHANGE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    const updateResult = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(subscriptionId) },
      {
        $set: {
          ...updateData,
          updatedAt: Date.now()
        }
      },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const updateStatus = async (subscriptionId, status) => {
  try {
    const updateResult = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(subscriptionId) },
      {
        $set: {
          status: status,
          updatedAt: Date.now()
        }
      },
      { returnDocument: 'after' }
    )
    return updateResult
  } catch (error) {
    throw new Error(error)
  }
}

const deleteById = async (subscriptionId) => {
  try {
    const deleteResult = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(subscriptionId) },
      {
        $set: {
          _destroy: true,
          updatedAt: Date.now()
        }
      },
      { returnDocument: 'after' }
    )
    return deleteResult
  } catch (error) {
    throw new Error(error)
  }
}

// Tìm các subscription đã hết hạn để cập nhật status
const findExpiredSubscriptions = async () => {
  try {
    const now = Date.now()
    const expiredSubscriptions = await DB_GET().collection(SUBSCRIPTION_COLLECTION_NAME)
      .find({
        status: SUBSCRIPTION_STATUS.ACTIVE,
        endAt: { $lt: now },
        _destroy: false
      })
      .toArray()
    return expiredSubscriptions
  } catch (error) {
    throw new Error(error)
  }
}

export const subscriptionModel = {
  SUBSCRIPTION_COLLECTION_NAME,
  SUBSCRIPTION_COLLECTION_SCHEMA,
  SUBSCRIPTION_STATUS,
  PLAN_CODE,
  PAYMENT_PROVIDER,
  createNew,
  findOneById,
  findOneByUserId,
  findActiveByUserId,
  findAllByUserId,
  update,
  updateStatus,
  deleteById,
  findExpiredSubscriptions
}
