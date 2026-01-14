// import { StatusCodes } from 'http-status-codes'
import express from 'express'
import { boardValidation } from '../../validations/boardValidation'
import { boardController } from '../../controllers/boardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddleware } from '~/middlewares/multerUploadMiddleware'
import { canCreateBoard } from '~/middlewares/boardLimitMiddleware'
import { boardMiddleware } from '~/middlewares/boardMiddleware'

const Router = express.Router()

// eslint-disable-next-line quotes
//v1/boards
Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(authMiddleware.isAuthorized, canCreateBoard, boardValidation.createNew, boardController.createNew)

Router.route('/templates')
  .get(boardController.getTemplates)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, multerUploadMiddleware.upload.single('backgroundBoard'), boardValidation.update, boardController.update)

Router.route('/supports/move_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToDiffColumn, boardController.moveCardToDiffColumn)

Router.route('/:boardId/users/:userId')
  .delete(authMiddleware.isAuthorized, boardMiddleware.isBoardOwner, boardController.removeUser)

export const boardRoute = Router
