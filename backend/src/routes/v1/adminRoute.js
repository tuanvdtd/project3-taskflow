import express from 'express'
import { adminController } from '~/controllers/adminController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Tất cả routes admin đều cần authentication và admin role
Router.use(authMiddleware.isAuthorized)
Router.use(authMiddleware.isAdmin)

// Dashboard stats
Router.route('/stats')
  .get(adminController.getStats)

Router.route('/user-growth')
  .get(adminController.getUserGrowth)

Router.route('/subscription-distribution')
  .get(adminController.getSubscriptionDistribution)

Router.route('/revenue')
  .get(adminController.getRevenue)

// Users management
Router.route('/users')
  .get(adminController.getUsers)

Router.route('/users/:userId/status')
  .patch(adminController.updateUserStatus)

Router.route('/users/:userId')
  .delete(adminController.deleteUser)

// Payments
Router.route('/payments')
  .get(adminController.getPayments)

export const adminRoute = Router
