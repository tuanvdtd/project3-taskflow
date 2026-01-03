import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

// đọc docs npm multer để hiểu cách sử dụng, nó dùng để xử lí res.file trong express

// Kiểm tra file

export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

// Cho attachment: pdf & word
export const ALLOW_ATTACHMENT_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

const cusFileFilter = (req, file, callback) => {
  // Nếu fieldname là cardCover thì chỉ cho phép ảnh
  if (file.fieldname === 'cardCover') {
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
      const errMessage = 'File type is invalid. Only accept jpg, jpeg and png'
      return callback(new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, errMessage), null)
    }
  }
  // Nếu fieldname là cardAttachment thì chỉ cho phép pdf/word
  else if (file.fieldname === 'cardAttachment') {
    if (!ALLOW_ATTACHMENT_FILE_TYPES.includes(file.mimetype)) {
      const errMessage = 'File type is invalid. Only accept PDF or Word documents.'
      return callback(new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, errMessage), null)
    }
  }

  // Tham số đầu tiên của callback là error, nếu không có lỗi thì để null, tham số thứ 2 là thành công(true) hay không(null)
  callback(null, true)
}

// Tạo func upload file (dùng chung cho cover & attachment)
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: cusFileFilter
})

export const multerUploadMiddleware = {
  upload
}