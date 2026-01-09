/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator, singleAttachmentValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import { hideAndClearCurrentActiveCard, selectCurrentActiveCard, updateCurrentActiveCard, selectShowActiveCardModal } from '~/redux/activeCard/activeCardSlice'
import { updateCardDetailsAPI, uploadCardAttachmentAPI, deleteAttachmentAPI } from '~/apis'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { socketIoInstance } from '~/socketClient'
import { createNewCommentAPI, updateCommentAPI, deleteCommentAPI } from '~/apis'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Popover from '@mui/material/Popover'
import moment from 'moment'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { Paperclip, FileText, ExternalLink, Trash2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'

import { styled } from '@mui/material/styles'
import { cloneDeep } from 'lodash'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowActiveCardModal = useSelector(selectShowActiveCardModal)
  const userInfo = useSelector(selectCurrentUser)

  const [anchorElDatePicker, setAnchorElDatePicker] = useState(null)
  const [selectedDate, setSelectedDate] = useState(activeCard?.dueDate ? moment(activeCard.dueDate) : null)
  const openDatePicker = Boolean(anchorElDatePicker)

  useEffect(() => {
    if (!isShowActiveCardModal || !activeCard?._id) return
    // Join board room khi mở modal
    socketIoInstance.emit('Fe_JoinBoard', activeCard.boardId)

    // Lắng nghe event từ BE khi có update mới
    const handleReceiveCardUpdate = (updatedCardData) => {
      // Chỉ update nếu update đến đúng card hiện tại
      if (updatedCardData._id === activeCard._id) {
        // Update activeCard trong redux
        dispatch(updateCurrentActiveCard(updatedCardData))
        // Update card vào activeBoard trong redux
        dispatch(updateCardInBoard(updatedCardData))
      }
    }

    // Đăng ký lắng nghe event
    socketIoInstance.on('Be_UpdateCard', handleReceiveCardUpdate)

    // Cleanup khi component unmount hoặc modal đóng
    return () => {
      // Leave room khi đóng modal
      socketIoInstance.emit('Fe_LeaveBoard', activeCard.boardId)
      socketIoInstance.off('Be_UpdateCard', handleReceiveCardUpdate)
    }
  }, [isShowActiveCardModal, activeCard, dispatch])

  const handleCloseModal = () => {
    dispatch(hideAndClearCurrentActiveCard())
  }
  const callUpdateCardAPI = async (updatedData) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, updatedData)
    // update lại activeCard trong redux
    dispatch(updateCurrentActiveCard(updatedCard))
    // update lại card vào activeBoard trong redux
    dispatch(updateCardInBoard(updatedCard))
    socketIoInstance.emit('Fe_UpdateCard', updatedCard)
    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    // console.log(newTitle.trim())
    // Gọi API...
    callUpdateCardAPI({ title: newTitle.trim() })

  }
  const onUpdateCardDescription = (newDescription) => {
    // console.log(newDescription)
    // Gọi API...
    callUpdateCardAPI({ description: newDescription })

  }

  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callUpdateCardAPI(reqData).finally(() => {
        event.target.value = ''
      }),
      {
        pending: 'Updating...'
      }
    )
  }

  const onUploadCardAttachment = (event) => {
    const file = event.target?.files?.[0]
    const error = singleAttachmentValidator(file)
    if (error) {
      toast.error(error)
      return
    }

    const reqData = new FormData()
    reqData.append('cardAttachment', file)
    reqData.append('boardId', activeCard.boardId)
    reqData.append('cardId', activeCard._id)

    toast.promise(
      uploadCardAttachmentAPI(reqData).then((newAttachment) => {
        const updatedCard = cloneDeep(activeCard)
        if (!Array.isArray(updatedCard.attachments)) updatedCard.attachments = []
        updatedCard.attachments.push(newAttachment)
        dispatch(updateCurrentActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))
      }).finally(() => {
        event.target.value = ''
      }),
      {
        pending: 'Uploading attachment...',
        success: 'Attachment uploaded successfully!',
        error: 'Failed to upload attachment.'
      }
    )
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return ''
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const onDeleteAttachment = async (attachmentId) => {
    if (!attachmentId) return

    toast.promise(
      deleteAttachmentAPI(attachmentId).then(() => {
        const updatedCard = cloneDeep(activeCard)
        updatedCard.attachments = (updatedCard.attachments || []).filter(att => att._id !== attachmentId)
        dispatch(updateCurrentActiveCard(updatedCard))
        dispatch(updateCardInBoard(updatedCard))
      }),
      {
        pending: 'Removing attachment...',
        success: 'Attachment removed successfully!',
        error: 'Failed to remove attachment.'
      }
    )
  }

  const onAddCardComment = async (newComment) => {
    // call api
    createNewCommentAPI({ cardId: activeCard._id, ...newComment, boardId: activeCard.boardId }).then((createdComment) => {
      // console.log('createdComment: ', createdComment)
      // Cập nhật lại activeCard trong redux
      const updatedCard = cloneDeep(activeCard)
      updatedCard.comments.unshift(createdComment)
      // Thêm comment vào activeCard trong redux
      dispatch(updateCurrentActiveCard(updatedCard))
      // Cập nhật lại card vào activeBoard trong redux
      dispatch(updateCardInBoard(updatedCard))
      // // Phát sự kiện lên server để thông báo các client khác cùng cập nhật
      // // socketIoInstance.emit('Fe_UpdateCard', updatedCard)
    })
  }

  const onDeleteCardComment = async (commentId) => {
    // Cập nhật lại activeCard trong redux
    const updatedCard = cloneDeep(activeCard)
    deleteCommentAPI(commentId).then(() => {
      updatedCard.comments = updatedCard.comments.filter(comment => comment._id !== commentId)
      // Thêm comment vào activeCard trong redux
      dispatch(updateCurrentActiveCard(updatedCard))
      // Cập nhật lại card vào activeBoard trong redux
      dispatch(updateCardInBoard(updatedCard))
    })
  }

  const onUpdateCardComment = async (commentId, content) => {
    // Cập nhật lại activeCard trong redux
    const updatedCard = cloneDeep(activeCard)
    updateCommentAPI(commentId, content).then((updatedComment) => {
      const commentIndex = updatedCard.comments.findIndex(comment => comment._id === commentId)
      if (commentIndex !== -1) {
        updatedCard.comments[commentIndex] = updatedComment
        // Thêm comment vào activeCard trong redux
        dispatch(updateCurrentActiveCard(updatedCard))
        // Cập nhật lại card vào activeBoard trong redux
        dispatch(updateCardInBoard(updatedCard))
      }
    })
  }

  const onHandleUpdateCardMembers = async (updateMemberCardData) => {
    callUpdateCardAPI({ updateMemberCardData })
  }

  const handleClickDatePicker = (event) => {
    setAnchorElDatePicker(event.currentTarget)
  }

  const handleCloseDatePicker = () => {
    setAnchorElDatePicker(null)
  }

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    if (newDate) {
      callUpdateCardAPI({ dueDate: newDate.valueOf() })
    }
    // console.log({ dueDate: newDate.toISOString(), origin: newDate.valueOf() })
    handleCloseDatePicker()
  }

  const handleToggleCompleted = () => {
    callUpdateCardAPI({ completed: !activeCard?.completed })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowActiveCardModal}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: '90%',
        maxWidth: 900,
        // height: '95%',
        // overflowY: 'auto',
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '6px', // reduced from 8px
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '4px', objectFit: 'cover' }} // reduced from 6px
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }
        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            key={`card-title-${activeCard?._id}-${Date.now()}`}
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />

          {/* Completed Checkbox */}
          <Box
            onClick={handleToggleCompleted}
            sx={{
              ml: 'auto',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: activeCard?.completed ? '2px solid #000' : '2px solid #9e9e9e',
                backgroundColor: activeCard?.completed ? '#fff' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: activeCard?.completed ? '#000' : '#22c55e',
                  backgroundColor: activeCard?.completed ? '#fff' : '#f0fdf4'
                }
              }}
            >
              {activeCard?.completed && (
                <Check style={{ width: 18, height: 18, color: '#22c55e', strokeWidth: 3 }} />
              )}
            </Box>
          </Box>

          {activeCard?.completed && (
            <Chip
              label="Completed"
              size="small"
              sx={{
                bgcolor: '#dcfce7',
                color: '#166534',
                fontWeight: 600,
                fontSize: '13px'
              }}
            />
          )}
        </Box>

        {/* Hiển thị dueDate nếu có */}
        {activeCard?.dueDate && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            color: activeCard?.completed
              ? '#22c55e'
              : (moment(activeCard.dueDate).isBefore(moment()) ? 'error.main' : '#576574')
          }}>
            <WatchLaterOutlinedIcon fontSize="small" />
            <Typography sx={{ fontWeight: 600 }}>
              {moment(activeCard.dueDate).format('LLL')} ({moment(activeCard.dueDate).fromNow()})
              {activeCard?.completed && ' - Completed'}
            </Typography>
          </Box>
        )}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid size = {{ xs: 12, sm: 9 }}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup cardMemberIds={activeCard?.memberIds} onHandleUpdateCardMembers={onHandleUpdateCardMembers} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                key={`card-desc-${activeCard?._id}-${Date.now()}`}
                onUpdateCardDescription={onUpdateCardDescription}
                cardDescriptionProp={activeCard?.description} />
            </Box>

            {/*  Attachments List */}
            {activeCard?.attachments?.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Paperclip className="w-5 h-5" />
                  <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Attachments</Typography>
                </Box>
                <div className="space-y-2 mb-3">
                  <AnimatePresence>
                    {activeCard?.attachments?.map((attachment) => {
                      const uploader = attachment.userName
                      const isPdf = attachment.type === 'pdf' || attachment.name?.toLowerCase().endsWith('.pdf')
                      return (
                        <motion.div
                          key={attachment._id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={'p-4 rounded-lg flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition-colors group'}
                        >
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isPdf
                              ? 'bg-red-100 dark:bg-red-900/30'
                              : 'bg-blue-100 dark:bg-blue-900/30'
                          }`}>
                            <FileText className={`w-5 h-5 ${
                              isPdf ? 'text-red-600' : 'text-blue-600'
                            }`} />
                          </div>
                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate text-gray-900">
                              {attachment.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {attachment.size && formatFileSize(attachment.size)} •
                              Uploaded by {uploader} on {attachment.createdAt ? moment(attachment.createdAt).format('LL') : 'Unknown date'}
                            </p>
                          </div>
                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {attachment.cloudinaryUrl && attachment.cloudinaryUrl !== '#' && (
                              <IconButton
                                onClick={() => window.open(attachment.cloudinaryUrl, '_blank')}
                                size="small"
                                style={{ color: '#3b82f6' }}
                                title="View PDF"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </IconButton>
                            )}
                            <IconButton
                              size="small"
                              style={{ color: '#ef4444' }}
                              title="Remove"
                              onClick={() => onDeleteAttachment(attachment._id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </Box>
            )}


            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                onAddCardComment={onAddCardComment}
                onUpdateCardComment={onUpdateCardComment}
                comments={activeCard?.comments}
                onDeleteCardComment={onDeleteCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid size={{ xs: 12, sm: 3 }}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds?.includes(userInfo._id) &&
                <SidebarItem className="active" onClick={() => onHandleUpdateCardMembers({ userId: userInfo._id, action: CARD_MEMBER_ACTIONS.ADD })}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              }
              {activeCard?.memberIds?.includes(userInfo._id) &&
                <SidebarItem
                  className="active"
                  onClick={() => {
                    onHandleUpdateCardMembers({ userId: userInfo._id, action: CARD_MEMBER_ACTIONS.REMOVE })
                    dispatch(hideAndClearCurrentActiveCard())
                  }}>
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Leave
                </SidebarItem>
              }

              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem className="active" component="label">
                <AttachFileOutlinedIcon fontSize="small" />
                  Attachment
                <VisuallyHiddenInput
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={onUploadCardAttachment}
                />
              </SidebarItem>
              <SidebarItem><TaskAltOutlinedIcon fontSize="small" />Checklist</SidebarItem>
              <SidebarItem className="active" onClick={handleClickDatePicker}>
                <WatchLaterOutlinedIcon fontSize="small" />
                Dates
              </SidebarItem>

              <Popover
                open={openDatePicker}
                anchorEl={anchorElDatePicker}
                onClose={handleCloseDatePicker}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <Box sx={{ p: 2 }}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      label="Due Date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          fullWidth: true
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Popover>

              <SidebarItem><AutoFixHighOutlinedIcon fontSize="small" />Custom Fields</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><AddToDriveOutlinedIcon fontSize="small" />Google Drive</SidebarItem>
              <SidebarItem><AddOutlinedIcon fontSize="small" />Add Power-Ups</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem><ArrowForwardOutlinedIcon fontSize="small" />Move</SidebarItem>
              <SidebarItem><ContentCopyOutlinedIcon fontSize="small" />Copy</SidebarItem>
              <SidebarItem><AutoAwesomeOutlinedIcon fontSize="small" />Make Template</SidebarItem>
              <SidebarItem><ArchiveOutlinedIcon fontSize="small" />Archive</SidebarItem>
              <SidebarItem><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
