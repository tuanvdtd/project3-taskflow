import cron from 'node-cron'
import { DB_GET } from '~/config/mongodb'
import { subscriptionModel } from '~/models/subscriptionModel'
import { userModel } from '~/models/userModel'
import { BrevoProvider } from '~/providers/BrevoProdiver'
import { WEBSITE_DOMAIN } from '~/utils/constants'

export const startExpireSubscriptionJob = () => {
  // Chạy mỗi giờ vào phút 0
  cron.schedule('0 * * * *', async () => {
    const now = Date.now()

    try {
      // Tìm các subscription sắp hết hạn trước khi update
      const expiredSubscriptions = await DB_GET().collection(subscriptionModel.SUBSCRIPTION_COLLECTION_NAME)
        .find({
          endAt: { $lt: now },
          status: subscriptionModel.SUBSCRIPTION_STATUS.ACTIVE,
          _destroy: false
        })
        .toArray()

      if (expiredSubscriptions.length === 0) {
        console.log('[CRON] No subscriptions to expire')
        return
      }

      // Update status của các subscription
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

      // Gửi email thông báo cho từng user
      for (const subscription of expiredSubscriptions) {
        try {
          // Lấy thông tin user
          const user = await DB_GET().collection(userModel.USER_COLLECTION_NAME).findOne({
            _id: subscription.userId
          })

          if (user && user.email) {
            // Tạo nội dung email
            const emailSubject = 'Thông báo hết hạn gói dịch vụ TaskFlow'
            const emailContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Thông báo hết hạn gói dịch vụ</h2>
                <p>Xin chào <strong>${user.displayName || user.username}</strong>,</p>
                <p>Gói <strong>${subscription.planCode}</strong> của bạn đã hết hạn vào ngày <strong>${new Date(subscription.endAt).toLocaleDateString('vi-VN')}</strong>.</p>
                <p>Để tiếp tục sử dụng các tính năng cao cấp, vui lòng gia hạn gói dịch vụ của bạn.</p>
                <p style="margin-top: 20px;">
                  <a href="${WEBSITE_DOMAIN}/settings/billing" 
                     style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                    Gia hạn ngay
                  </a>
                </p>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                  Trân trọng,<br/>
                  Đội ngũ TaskFlow
                </p>
              </div>
            `

            // Gửi email
            await BrevoProvider.sendEmail(user.email, emailSubject, emailContent)
            console.log(`[CRON] Sent expiration email to ${user.email}`)
          }
        } catch (emailError) {
          console.error(`[CRON] Error sending email for subscription ${subscription._id}:`, emailError)
          // Tiếp tục với subscription tiếp theo nếu gửi email thất bại
        }
      }
    } catch (error) {
      console.error('[CRON] Error expiring subscriptions:', error)
    }
  })
}
