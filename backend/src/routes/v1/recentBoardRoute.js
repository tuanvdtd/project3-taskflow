import express from 'express'
import { recentBoardController } from '~/controllers/recentBoardController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

// Track board access
Router.route('/track')
  .post(authMiddleware.isAuthorized, recentBoardController.trackAccess)

// Get recent boards
Router.route('/')
  .get(authMiddleware.isAuthorized, recentBoardController.getRecent)

// Remove specific board from recents
Router.route('/:boardId')
  .delete(authMiddleware.isAuthorized, recentBoardController.removeBoard)

// Clear all recent boards
Router.route('/clear')
  .delete(authMiddleware.isAuthorized, recentBoardController.clearAll)

export const recentBoardRoute = Router
