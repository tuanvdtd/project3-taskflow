import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import { X, UserX, Crown } from 'lucide-react'
import { toast } from 'react-toastify'
import { removeUserFromBoardAPI } from '~/apis/boardAPI'

function BoardUserManagement({ open, onClose, board, currentUserId, onUserRemoved }) {
  const [removingUserId, setRemovingUserId] = useState(null)

  // Kiểm tra user hiện tại có phải owner không
  const isCurrentUserOwner = board?.ownerIds?.some(
    ownerId => ownerId.toString() === currentUserId?.toString()
  )

  // Lấy danh sách tất cả users (owners + members)
  const allUsers = [
    ...(board?.owners || []).map(owner => ({ ...owner, isOwner: true })),
    ...(board?.members || []).filter(member =>
      !board?.ownerIds?.some(ownerId => ownerId.toString() === member._id.toString())
    ).map(member => ({ ...member, isOwner: false }))
  ]

  const handleRemoveUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user from the board?')) {
      return
    }

    try {
      setRemovingUserId(userId)
      await removeUserFromBoardAPI(board._id, userId)

      toast.success('User removed from board successfully', { theme: 'colored' })

      // Gọi callback để refresh board
      if (onUserRemoved) {
        onUserRemoved()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove user', { theme: 'colored' })
    } finally {
      setRemovingUserId(null)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Board Members
          </Typography>
          <Chip
            label={allUsers.length}
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {!isCurrentUserOwner && (
          <Box sx={{
            mb: 3,
            p: 2,
            bgcolor: 'warning.lighter',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'warning.light'
          }}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ Only board owners can remove members
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1, mb: 2 }}>
          {allUsers.map((user) => (
            <Box
              key={user._id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'action.hover',
                  borderColor: 'primary.light'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <Avatar
                  src={user.avatar}
                  alt={user.displayName}
                  sx={{ width: 44, height: 44 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user.displayName}
                    </Typography>
                    {user.isOwner && (
                      <Tooltip title="Board Owner">
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: 'warning.main'
                        }}>
                          <Crown size={16} fill="currentColor" />
                        </Box>
                      </Tooltip>
                    )}
                    {user._id === currentUserId && (
                      <Chip
                        label="You"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              {/* Chỉ hiện nút remove nếu:
                  - Current user là owner
                  - User đang xem không phải là owner
                  - User đang xem không phải chính mình
              */}
              {isCurrentUserOwner && !user.isOwner && user._id !== currentUserId && (
                <Tooltip title="Remove from board">
                  <IconButton
                    onClick={() => handleRemoveUser(user._id)}
                    disabled={removingUserId === user._id}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.lighter'
                      }
                    }}
                  >
                    {removingUserId === user._id ? (
                      <Box className="animate-spin">
                        <UserX size={20} />
                      </Box>
                    ) : (
                      <UserX size={20} />
                    )}
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          ))}
        </Box>

        {allUsers.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary'
          }}>
            <Typography variant="body1">
              No members in this board
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BoardUserManagement
