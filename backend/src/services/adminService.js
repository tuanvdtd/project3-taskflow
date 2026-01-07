import { DB_GET } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import { BoardModel } from '~/models/boardModel'
import { subscriptionModel } from '~/models/subscriptionModel'
import { ObjectId } from 'mongodb'

const getStats = async () => {
  // Đếm tổng số users (không bao gồm user đã xóa)
  const totalUsers = await DB_GET().collection(userModel.USER_COLLECTION_NAME).countDocuments({
    _destroy: false
  })

  // Đếm tổng số boards (không bao gồm board đã xóa)
  const totalBoards = await DB_GET().collection(BoardModel.BOARD_COLLECTION_NAME).countDocuments({
    _destroy: false
  })

  // Đếm số subscription đang active
  const activeSubscriptions = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME).countDocuments({
    status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
    _destroy: false
  })

  return {
    totalUsers,
    totalBoards,
    activeSubscriptions
  }
}

const getUserGrowth = async () => {
  // Lấy dữ liệu user growth theo tháng trong 6 tháng gần nhất
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const userGrowth = await DB_GET().collection(userModel.USER_COLLECTION_NAME).aggregate([
    {
      $match: {
        createdAt: { $gte: sixMonthsAgo.getTime() },
        _destroy: false
      }
    },
    {
      $group: {
        _id: {
          year: { $year: { $toDate: '$createdAt' } },
          month: { $month: { $toDate: '$createdAt' } }
        },
        users: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        users: 1
      }
    }
  ]).toArray()

  // Tạo array 6 tháng gần nhất
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const now = new Date()
  const last6Months = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // Tìm data thực tế cho tháng này
    const found = userGrowth.find(u => u.year === year && u.month === month)

    last6Months.push({
      month: monthNames[month - 1],
      users: found ? found.users : 0
    })
  }

  return last6Months
}

const getSubscriptionDistribution = async () => {
  // Đếm số users theo plan (Free users là những users không có subscription active)
  const activeSubscriptions = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME).aggregate([
    {
      $match: {
        status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
        _destroy: false
      }
    },
    {
      $group: {
        _id: '$planCode',
        count: { $sum: 1 }
      }
    }
  ]).toArray()

  // Tổng số users
  const totalUsers = await DB_GET().collection(userModel.USER_COLLECTION_NAME).countDocuments({
    _destroy: false
  })

  // Số users có Pro subscription
  const proUsers = activeSubscriptions.find(s => s._id === subscriptionModel.PLAN_CODE.PRO)?.count || 0

  // Số users Free = tổng users - số users có subscription
  const freeUsers = totalUsers - proUsers

  return [
    { name: 'Free', value: freeUsers, color: '#94a3b8' },
    { name: 'Pro', value: proUsers, color: '#3b82f6' }
  ]
}

const getRevenue = async () => {
  // Lấy doanh thu theo tháng trong năm hiện tại
  const currentYear = new Date().getFullYear()
  const startOfYear = new Date(currentYear, 0, 1).getTime()

  const revenue = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME).aggregate([
    {
      $match: {
        createdAt: { $gte: startOfYear },
        status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
        _destroy: false
      }
    },
    {
      $group: {
        _id: { $month: { $toDate: '$createdAt' } },
        revenue: { $sum: '$amount' }
      }
    },
    {
      $sort: { '_id': 1 }
    },
    {
      $project: {
        _id: 0,
        month: {
          $let: {
            vars: {
              monthsInString: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            in: { $arrayElemAt: ['$$monthsInString', '$_id'] }
          }
        },
        revenue: 1
      }
    }
  ]).toArray()

  // Đảm bảo có đủ 12 tháng, tháng nào không có dữ liệu thì revenue = 0
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullYearRevenue = months.map(month => {
    const found = revenue.find(r => r.month === month)
    return {
      month,
      revenue: found ? found.revenue : 0
    }
  })

  return fullYearRevenue
}

const getUsers = async () => {
  const users = await DB_GET().collection(userModel.USER_COLLECTION_NAME).aggregate([
    {
      $match: { _destroy: false }
    },
    {
      $lookup: {
        from: subscriptionModel.SUBSCRIPTION_COLLECTION_NAME,
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$userId', '$$userId'] },
              status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
              _destroy: false
            }
          },
          { $sort: { createdAt: -1 } },
          { $limit: 1 }
        ],
        as: 'subscription'
      }
    },
    {
      $unwind: {
        path: '$subscription',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        email: 1,
        displayName: 1,
        username: 1,
        avatar: 1,
        role: {
          $cond: {
            if: {
              $or: [
                { $eq: ['$role', 'client'] },
                { $eq: ['$role', null] },
                { $not: ['$role'] }
              ]
            },
            then: 'User',
            else: '$role'
          }
        },
        plan: { $ifNull: ['$subscription.planCode', 'Free'] },
        status: { $cond: { if: '$isActive', then: 'Active', else: 'Suspended' } },
        createdAt: 1
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]).toArray()

  // Format createdDate
  const formattedUsers = users.map(user => ({
    id: user._id.toString(),
    email: user.email,
    name: user.displayName,
    role: user.role,
    plan: user.plan,
    status: user.status,
    createdDate: new Date(user.createdAt).toISOString().split('T')[0]
  }))

  return formattedUsers
}

const getPayments = async () => {
  const payments = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME).aggregate([
    {
      $match: { _destroy: false }
    },
    {
      $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 1,
        user: '$user.email',
        amount: 1,
        billingPeriod: {
          $cond: {
            if: { $eq: ['$billingCycle', 'yearly'] },
            then: 'Yearly',
            else: 'Monthly'
          }
        },
        status: {
          $switch: {
            branches: [
              { case: { $eq: ['$status', 'active'] }, then: 'Success' },
              { case: { $eq: ['$status', 'pending'] }, then: 'Pending' },
              { case: { $eq: ['$status', 'expired'] }, then: 'Failed' },
              { case: { $eq: ['$status', 'canceled'] }, then: 'Refunded' }
            ],
            default: 'Pending'
          }
        },
        provider: {
          $switch: {
            branches: [
              { case: { $eq: ['$paymentProvider', 'vnpay'] }, then: 'VNPay' },
              { case: { $eq: ['$paymentProvider', 'stripe'] }, then: 'Stripe' },
              { case: { $eq: ['$paymentProvider', 'momo'] }, then: 'PayOS' }
            ],
            default: 'Stripe'
          }
        },
        createdAt: 1
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]).toArray()

  // Format payments
  const formattedPayments = payments.map((payment, index) => ({
    id: payment._id.toString(),
    user: payment.user,
    amount: payment.amount,
    billingPeriod: payment.billingPeriod,
    status: payment.status,
    provider: payment.provider,
    date: new Date(payment.createdAt).toISOString().split('T')[0],
    invoiceId: `INV-${String(index + 1).padStart(3, '0')}`
  }))

  return formattedPayments
}

const updateUserStatus = async (userId, status) => {
  const isActive = status === 'Active'
  const result = await DB_GET().collection(userModel.USER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { isActive, updatedAt: Date.now() } },
    { returnDocument: 'after' }
  )
  return result
}

const deleteUser = async (userId) => {
  const result = await DB_GET().collection(userModel.USER_COLLECTION_NAME).findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $set: { _destroy: true, updatedAt: Date.now() } },
    { returnDocument: 'after' }
  )
  return result
}

export const adminService = {
  getStats,
  getUserGrowth,
  getSubscriptionDistribution,
  getRevenue,
  getUsers,
  getPayments,
  updateUserStatus,
  deleteUser
}
