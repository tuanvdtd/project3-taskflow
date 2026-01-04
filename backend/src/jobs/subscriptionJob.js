import cron from 'node-cron'
import { DB_GET } from '~/config/mongodb'
import { subscriptionModel } from '~/models/subscriptionModel'

export const startExpireSubscriptionJob = () => {
  // Chạy mỗi giờ vào phút 0
  cron.schedule('0 * * * *', async () => {
    const now = Date.now()

    try {
      const result = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME).updateMany(
        {
          endAt: { $lt: now },
          status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
          _destroy: false
        },
        {
          $set: {
            status: subscriptionModel.SUBSCRIPTION_STATUS.EXPIRED,
            updatedAt: now
          }
        }
      )

      console.log(`[CRON] Expired ${result.modifiedCount} subscriptions`)
    } catch (error) {
      console.error('[CRON] Error expiring subscriptions:', error)
    }
  })
}
