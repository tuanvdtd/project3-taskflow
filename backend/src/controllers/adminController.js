import { StatusCodes } from 'http-status-codes'
import { adminService } from '~/services/adminService'

const getStats = async (req, res, next) => {
  try {
    const stats = await adminService.getStats()
    res.status(StatusCodes.OK).json(stats)
  } catch (error) {
    next(error)
  }
}

const getUserGrowth = async (req, res, next) => {
  try {
    const userGrowth = await adminService.getUserGrowth()
    res.status(StatusCodes.OK).json(userGrowth)
  } catch (error) {
    next(error)
  }
}

const getSubscriptionDistribution = async (req, res, next) => {
  try {
    const distribution = await adminService.getSubscriptionDistribution()
    res.status(StatusCodes.OK).json(distribution)
  } catch (error) {
    next(error)
  }
}

const getRevenue = async (req, res, next) => {
  try {
    const revenue = await adminService.getRevenue()
    res.status(StatusCodes.OK).json(revenue)
  } catch (error) {
    next(error)
  }
}

const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    next(error)
  }
}

const getPayments = async (req, res, next) => {
  try {
    const payments = await adminService.getPayments()
    res.status(StatusCodes.OK).json(payments)
  } catch (error) {
    next(error)
  }
}

const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params
    const { status } = req.body
    const result = await adminService.updateUserStatus(userId, status)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    const result = await adminService.deleteUser(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const adminController = {
  getStats,
  getUserGrowth,
  getSubscriptionDistribution,
  getRevenue,
  getUsers,
  getPayments,
  updateUserStatus,
  deleteUser
}
