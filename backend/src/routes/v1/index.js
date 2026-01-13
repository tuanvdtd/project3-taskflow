import { boardRoute } from './boardRoute'
import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { columnRoute } from './columnRoute'
import { cardRoute } from './cardRoute'
import { userRoute } from './userRoute'
import { inviteUserRoute } from './inviteUserRoute'
import { commentRoute } from './commentRoute'
import { paymentRoute } from './paymentRoutes'
import { attachmentRoute } from './attachmentRoute'
import { adminRoute } from './adminRoute'
import { recentBoardRoute } from './recentBoardRoute'

const Router = express.Router()

Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: `${StatusCodes.OK}`,
    message: 'Server is running'
  })
})

Router.use('/boards', boardRoute)

Router.use('/columns', columnRoute)

Router.use('/cards', cardRoute)

Router.use('/users', userRoute)

Router.use('/invitations', inviteUserRoute)

Router.use('/comments', commentRoute)
Router.use('/payment', paymentRoute)

Router.use('/attachments', attachmentRoute)

Router.use('/admin', adminRoute)

Router.use('/recent-boards', recentBoardRoute)

export const Router_V1 = Router
