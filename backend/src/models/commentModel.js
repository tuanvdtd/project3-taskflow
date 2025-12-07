import Joi from 'joi'
import { EMAIL_RULE_MESSAGE, EMAIL_RULE, OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const COMMENT_COLLECTION_NAME = 'comments'
const COMMENT_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  userId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  userEmail: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).required(),
  userAvatar: Joi.string(),
  userDisplayName: Joi.string().required(),
  content: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const validBeforeCreate = async (data) => {
  return await COMMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdComment = await DB_GET().collection(COMMENT_COLLECTION_NAME).insertOne({
      ...validData,
      cardId: new ObjectId(validData.cardId),
      boardId: new ObjectId(validData.boardId),
      userId: new ObjectId(validData.userId)
    })
    return createdComment
  } catch (error) {
    // Handle error
    throw new Error(error)
  }
}

export const commentModel = {
  COMMENT_COLLECTION_NAME,
  COMMENT_COLLECTION_SCHEMA,
  createNew
}