/* eslint-disable no-useless-catch */
import { attachmentModel } from '~/models/attachmentModel'
import { cloudinaryProvider } from '~/providers/cloudinaryProvider'
import _ from 'lodash'

const createNew = async (userInfo, body, file) => {
  try {
    if (!file) throw new Error('Attachment file is required')

    const { boardId, cardId } = body

    const uploadResult = await cloudinaryProvider.streamUploadAttachment(
      file.buffer,
      'card-attachments',
      `card_${cardId}_attachment_${Date.now()}`
    )

    // Sửa lỗi font tên file (mặc định nhiều trình duyệt/multer trả về theo latin1)
    const decodedName = Buffer.from(file.originalname, 'latin1').toString('utf8')

    const data = {
      boardId,
      cardId,
      userId: userInfo._id,
      name: decodedName,
      size: file.size,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id
    }

    const createdAttachment = await attachmentModel.createNew(data)
    const result = await attachmentModel.getAttachmentById(createdAttachment.insertedId.toString())

    return _.omit(result, ['_destroy', 'updatedAt', 'boardId'])
  } catch (error) {
    throw error
  }
}

const deleteAttachment = async (userInfo, attachmentId) => {
  try {
    const attachment = await attachmentModel.getAttachmentById(attachmentId)
    if (!attachment) throw new Error('Attachment not found')

    if (attachment.cloudinaryPublicId) {
      // Dùng cả cloudinaryUrl để đoán resource_type (raw/image) khi xóa
      await cloudinaryProvider.destroyAttachment(
        attachment.cloudinaryPublicId,
        attachment.cloudinaryUrl
      )
    }

    await attachmentModel.deleteAttachmentById(attachmentId)

    return { _id: attachmentId }
  } catch (error) {
    throw error
  }
}

export const attachmentService = {
  createNew,
  deleteAttachment
}
