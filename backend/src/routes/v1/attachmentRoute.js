import express from 'express'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { attachmentController } from '~/controllers/attachmentController'

const Router = express.Router()

// POST /v1/attachments
// body: { boardId, cardId }, file: cardAttachment
Router.route('/')
  .post(
    authMiddleware.isAuthorized,
    multerUploadMiddleware.upload.single('cardAttachment'),
    attachmentController.createNew
  )

Router.route('/:id')
  .delete(
    authMiddleware.isAuthorized,
    attachmentController.deleteAttachment
  )

export const attachmentRoute = Router
