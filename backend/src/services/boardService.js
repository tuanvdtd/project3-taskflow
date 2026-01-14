import { slugify } from '~/utils/fomatter'
import { BoardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/columnModel'
import { cardModel } from '~/models/cardModel'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import { BOARD_TEMPLATES } from '~/utils/constants'

const createNew = async (userId, resBody) => {
  try {
    const newBoard = {
      title: resBody.title,
      description: resBody.description,
      type: resBody.type,
      slug: slugify(resBody.title)
    }
    const createNew = await BoardModel.createNew(userId, newBoard)
    const boardId = createNew.insertedId.toString()

    // Tạo các column từ template (nếu có templateId)
    if (resBody.templateId && BOARD_TEMPLATES[resBody.templateId]) {
      await createColumnsFromTemplate(boardId, BOARD_TEMPLATES[resBody.templateId])
    } else {
      // Tạo column mặc định "To Do" với card "Welcome to your new board!"
      const newColumn = await columnModel.createNew({
        boardId: boardId,
        title: 'To Do'
      })
      const columnId = newColumn.insertedId.toString()

      // Push column vào board
      await BoardModel.pushColumnIds({
        _id: columnId,
        boardId: boardId
      })

      // Tạo card mặc định
      const newCard = await cardModel.createNew({
        boardId: boardId,
        columnId: columnId,
        title: 'Welcome to your new board!'
      })
      const cardId = newCard.insertedId

      // Push card vào column
      await columnModel.pushCardIds({
        _id: cardId,
        columnId: columnId
      })
    }
    const result = await BoardModel.getBoardById(boardId)
    return result

  } catch (error) {
    throw new Error(error)
  }
}

const createColumnsFromTemplate = async (boardId, template) => {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!template) return

    const columnIds = []
    // Tạo từng column
    for (const columnData of template.columns) {
      const newColumn = await columnModel.createNew({
        boardId: boardId,
        title: columnData.title
      })
      columnIds.push(newColumn.insertedId)
    }

    // Update board với columnOrderIds
    await BoardModel.update(boardId, {
      columnOrderIds: columnIds,
      updatedAt: Date.now()
    })

  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await BoardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, `Board with id ${boardId} not found`)
    }
    const boardClone = cloneDeep(board)
    // Đầu tiên gắn comments và attachments vào đúng card
    boardClone.cards.forEach(card => {
      card.comments = boardClone.comments.filter(comment => comment.cardId.toString() === card._id.toString())
      if (boardClone.attachments) {
        card.attachments = boardClone.attachments.filter(attachment => attachment.cardId.toString() === card._id.toString())
      }
    })
    // Sau đó gắn card vào đúng column
    boardClone.columns.forEach(column => {
      column.cards = boardClone.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    delete boardClone.cards
    delete boardClone.comments
    delete boardClone.attachments

    return boardClone
  } catch (error) {
    throw error
  }
}

const update = async (boardId, resBody, backgroundFile) => {
  try {
    let result = {}
    if (backgroundFile) {
      const backgroundCover = await cloudinaryProvider.streamUploadWithOverwrite(
        backgroundFile.buffer,
        'background-covers',
        `board_${boardId}_background`
      )
      // Lưu lại url avatar vào database
      const background = {
        backgroundType: 'image',
        backgroundUrl: backgroundCover.secure_url
      }
      result = await BoardModel.update(boardId, { background })
    }
    else if (resBody.updateBackgroundBoard) {
      const background = {
        backgroundType: resBody.updateBackgroundBoard.backgroundType,
        backgroundUrl: resBody.updateBackgroundBoard.defaultImage
      }
      result = await BoardModel.update(boardId, { background })
    }
    else {
      const updatedData = {
        ...resBody,
        updatedAt: Date.now()
      }
      result = await BoardModel.update(boardId, updatedData)
    }
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const moveCardToDiffColumn = async (resBody) => {
  try {
    //Xóa card khỏi column cũ
    await columnModel.update(resBody.preColumnId, {
      cardOrderIds: resBody.preCardOrderIds,
      updatedAt: Date.now()
    })
    //Thêm card vào column mới
    await columnModel.update(resBody.nextColumnId, {
      cardOrderIds: resBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    //Thay đổi columnId của card sau khi move
    await cardModel.update(resBody.cardId, {
      columnId: resBody.nextColumnId
    })
    return {
      message: 'Card moved successfully'
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getBoards = async (userId, page, itemsPerPage, querySearchBoard) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE


    const boards = await BoardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10), querySearchBoard)
    return boards
  } catch (error) {
    throw new Error(error)
  }
}

const countBoardsByOwner = async (userId) => {
  try {
    const count = await BoardModel.countBoardsByOwner(userId)
    return count
  } catch (error) {
    throw new Error(error)
  }
}

const getTemplates = async () => {
  try {
    // Chuyển đổi object BOARD_TEMPLATES thành array để dễ sử dụng ở frontend
    const templatesArray = Object.keys(BOARD_TEMPLATES).map(key => ({
      id: key,
      ...BOARD_TEMPLATES[key]
    }))
    return templatesArray
  } catch (error) {
    throw new Error(error)
  }
}

const removeUserFromBoard = async (boardId, userIdToRemove, requestUserId) => {
  try {
    // Kiểm tra board tồn tại
    const board = await BoardModel.getBoardById(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Kiểm tra user yêu cầu có phải owner không
    const isOwner = board.ownerIds.some(ownerId => 
      ownerId.toString() === requestUserId.toString()
    )
    if (!isOwner) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Only board owners can remove users')
    }

    // Không cho phép remove owner
    const isRemovingOwner = board.ownerIds.some(ownerId => 
      ownerId.toString() === userIdToRemove.toString()
    )
    if (isRemovingOwner) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Cannot remove board owner')
    }

    // Kiểm tra user có trong board không
    const isMember = board.memberIds.some(memberId => 
      memberId.toString() === userIdToRemove.toString()
    )
    if (!isMember) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'User is not a member of this board')
    }

    // 1. Remove user khỏi board
    await BoardModel.removeUserFromBoard(boardId, userIdToRemove)

    // 2. Remove user khỏi tất cả cards trong board
    await cardModel.removeUserFromAllCardsInBoard(boardId, userIdToRemove)

    return { 
      success: true, 
      message: 'User removed from board successfully' 
    }
  } catch (error) {
    throw error
  }
}


export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDiffColumn,
  getBoards,
  countBoardsByOwner,
  getTemplates,
  removeUserFromBoard
}