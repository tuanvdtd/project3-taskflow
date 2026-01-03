import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { DB_GET } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// Define Collection (name & schema)
const ATTACHMENT_COLLECTION_NAME = 'attachments'
const ATTACHMENT_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  cardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  userId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),

  name: Joi.string().required(),
  size: Joi.number().required(),
  cloudinaryUrl: Joi.string().uri().required(),
  cloudinaryPublicId: Joi.string().required(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
})

const validBeforeCreate = async (data) => {
  return await ATTACHMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validData = await validBeforeCreate(data)

    const createdAttachment = await DB_GET().collection(ATTACHMENT_COLLECTION_NAME).insertOne({
      ...validData,
      cardId: new ObjectId(validData.cardId),
      boardId: new ObjectId(validData.boardId),
      userId: new ObjectId(validData.userId)
    })
    return createdAttachment
  } catch (error) {
    throw new Error(error)
  }
}

const getAttachmentById = async (id) => {
  try {
    const attachment = await DB_GET().collection(ATTACHMENT_COLLECTION_NAME).findOne({ _id: new ObjectId(id) })
    return attachment
  } catch (error) {
    throw new Error(error)
  }
}

const deleteAttachmentById = async (id) => {
  try {
    const result = await DB_GET().collection(ATTACHMENT_COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const attachmentModel = {
  ATTACHMENT_COLLECTION_NAME,
  ATTACHMENT_COLLECTION_SCHEMA,
  createNew,
  getAttachmentById,
  deleteAttachmentById
}
