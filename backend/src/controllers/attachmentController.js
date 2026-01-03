import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { attachmentService } from '~/services/attachmentService'

const createNew = async (req, res, next) => {
  try {
    const userInfo = req.jwtDecoded
    const attachmentFile = req.file
    const { boardId, cardId } = req.body

    const result = await attachmentService.createNew(userInfo, { boardId, cardId }, attachmentFile)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

const deleteAttachment = async (req, res, next) => {
  try {
    const userInfo = req.jwtDecoded
    const attachmentId = req.params.id

    const result = await attachmentService.deleteAttachment(userInfo, attachmentId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.BAD_REQUEST, new Error(error).message))
  }
}

export const attachmentController = {
  createNew,
  deleteAttachment
}
