import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import DashboardIcon from '@mui/icons-material/Dashboard'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
// import Avatar from "@mui/material/Avatar";
// import AvatarGroup from "@mui/material/AvatarGroup";
import Tooltip from '@mui/material/Tooltip'
// import Button from "@mui/material/Button";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import BackgroundSelector from '~/components/BackgroundSelector'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { updateBoardDetailsAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cloneDeep } from 'lodash'
import { LayoutDashboard, Calendar as CalendarIcon, Users } from 'lucide-react'
import { useState } from 'react'
import FilterModal from './FilterModal'
import BoardUserManagement from './BoardUserManagement'

const MenuStyle = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  },
  fontSize: '16px',
  fontWeight: 500
}


function BoardBar({ board, viewMode, onChangeViewMode, onFilterChange, filterKeyword, filteredCardsCount = 0, onBoardUpdate }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [userManagementOpen, setUserManagementOpen] = useState(false)
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Kiểm tra user hiện tại có phải owner không
  const isOwner = board?.ownerIds?.some(
    ownerId => ownerId.toString() === currentUser?._id?.toString()
  )

  const handleClearFilter = () => {
    onFilterChange('')
  }

  const updateBoardTitle = async (newTitle) => {
    // console.log('New board title: ', newTitle)
    await updateBoardDetailsAPI(board._id, { title: newTitle })
    const updatedBoard = cloneDeep(board)
    updatedBoard.title = newTitle
    dispatch(updateCurrentActiveBoard(updatedBoard))
  }

  return (
    <>
      <Box
        px={2}
        sx={{
          height: (theme) => theme.TaskFlow.boardBarHeight,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          overflowX: 'auto',
          bgcolor: 'rgba(0, 0, 0, 0.32)',
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Tooltip title={board?.description}>
            <Box sx={{ display: 'flex', alignItems: 'center' }} data-tour="board-title">
              <DashboardIcon sx={{ color: 'white' }} />
              <ToggleFocusInput
                value={board?.title}
                onChangedValue={updateBoardTitle}
                color="white"
                sx= {MenuStyle}
                id={`toggle-focus-input-controlled-${board._id}`}
              />
            </Box>
            {/* <ToggleFocusInput
              value={board?.title}
              onChangedValue={updateBoardTitle}
              sx={MenuStyle}
              id={`toggle-focus-input-controlled-${board._id}`}
              data-tour="board-title"
            /> */}
          </Tooltip>

          {/* <Chip
            icon={<VpnLockIcon />}
            label={capitalizeFirstLetter(board?.type)}
            clickable
            sx={MenuStyle}
          /> */}
          {/* <Chip
            icon={<AddToDriveIcon />}
            label="Add to Google Drive"
            clickable
            sx={MenuStyle}
          /> */}

          <div className="flex gap-1 p-1 rounded-lg" style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <button
              onClick={() => onChangeViewMode && onChangeViewMode('board')}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: viewMode === 'board' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: viewMode === 'board' ? '600' : '400',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'board') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'board') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <LayoutDashboard className="w-4 h-4" />
              Board
            </button>
            <button
              onClick={() => onChangeViewMode && onChangeViewMode('calendar')}
              className="px-4 py-2 rounded-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: viewMode === 'calendar' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                fontWeight: viewMode === 'calendar' ? '600' : '400',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'calendar') {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'calendar') {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <CalendarIcon className="w-4 h-4" />
              Calendar
            </button>
          </div>

          <Chip
            data-tour="board-menu"
            icon={<BoltIcon />}
            label="Settings"
            clickable
            sx={MenuStyle}
            onClick={() => setModalOpen(true)}
          />
          <BackgroundSelector
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            // onSelect={handleBackgroundSelect}
            boardId={board?._id}
          />
          {!filterKeyword ? (
            <Chip
              icon={<FilterListIcon />}
              label="Filter"
              clickable
              sx={MenuStyle}
              onClick={() => setFilterModalOpen(true)}
            />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                px: 1.5,
                py: 0.5,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.3)'
                }
              }}
              onClick={() => setFilterModalOpen(true)}
            >
              <FilterListIcon sx={{ color: 'white', fontSize: '18px' }} />
              <Box
                sx={{
                  minWidth: '20px',
                  height: '20px',
                  borderRadius: '10px',
                  bgcolor: '#0c66e4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                  px: 0.5
                }}
              >
                {filteredCardsCount}
              </Box>
              <Typography
                sx={{ color: 'white', fontSize: '14px', fontWeight: 500 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearFilter()
                }}
              >
                Clear all
              </Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InviteBoardUser boardId={board._id} />
          <BoardUserGroup boardUsers={board.allUsers} />

          {/* Manage Users Button - Chỉ hiện cho owner */}
          {isOwner && (
            <Tooltip title="Manage board members">
              <Box
                onClick={() => setUserManagementOpen(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 0.8,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
              >
                <Users size={18} color="white" />
                <Typography
                  sx={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  Manage
                </Typography>
              </Box>
            </Tooltip>
          )}

        </Box>
      </Box>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onFilterChange={onFilterChange}
        initialKeyword={filterKeyword}
      />

      {/* User Management Modal */}
      <BoardUserManagement
        open={userManagementOpen}
        onClose={() => setUserManagementOpen(false)}
        board={board}
        currentUserId={currentUser?._id}
        onUserRemoved={onBoardUpdate}
      />

      {/* Clear Filter Overlay */}
      {filterKeyword && (
        <Box
          onClick={handleClearFilter}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            display: 'none'
          }}
        />
      )}
    </>
  )
}

export default BoardBar
