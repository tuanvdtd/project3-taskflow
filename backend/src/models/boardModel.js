import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { BOARD_TYPE } from '~/utils/constants'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(250).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  columnOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  // Danh sách các thành viên trong board
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  // Danh sách các chủ sở hữu của board
  ownerIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),

  _destroy: Joi.boolean().default(false),
  background: Joi.object({
    backgroundType: Joi.string().valid('image', 'gradient', 'color').required(),
    backgroundUrl: Joi.string().required()
  }).optional(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required()
})


const validBeforeCreate = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
  try {
    const validData = await validBeforeCreate(data)
    const createdBoard = await DB_GET().collection(BOARD_COLLECTION_NAME).insertOne({
      ...validData,
      ownerIds: [new ObjectId(userId)]
    })
    return createdBoard
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

export const BoardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew
}

