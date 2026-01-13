import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import ListAltIcon from '@mui/icons-material/ListAlt'
import HomeIcon from '@mui/icons-material/Home'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { styled } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import SidebarCreateBoardModal from '~/pages/Boards/create'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRecentBoards } from '~/customHooks/useRecentBoards'
import CircularProgress from '@mui/material/CircularProgress'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  padding: '12px 16px',
  borderRadius: '12px',
  margin: '4px 0',
  transition: 'all 0.2s ease',
  fontSize: '0.95rem',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2A3441' : '#f1f5f9',
    transform: 'translateX(4px)'
  },
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.mode === 'dark' ? '#1e293b' : '#e8f4fd',
    fontWeight: 600,
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    '& .MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  }
}))

const SidebarContent = ({
  handleCreateBoardSuccess,
  isCreateModalOpen,
  onCloseCreateModal
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useSelector(selectCurrentUser)
  const { recentBoards, loading: loadingRecent } = useRecentBoards()

  const plan = currentUser?.plan || 'free'
  const isPro = plan === 'pro'
  const boardLimit = currentUser?.boardLimit
  const currentBoardCount = currentUser?.currentBoardCount

  const checkBoardLimit = () => {
    if (!isPro && boardLimit && currentBoardCount >= boardLimit) {
      navigate('/settings/billing')
      return false
    }
    return true
  }

  const handleNavigateTemplates = () => {
    navigate('/templates')
  }

  const handleNavigateBoards = () => {
    navigate('/boards')
  }

  const handleNavigateHome = () => {
    navigate('/')
  }

  const handleRecentBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`)
  }

  return (
    <Box sx={{
      px: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none'
      }
    }}>
      {/* User Profile & Plan */}
      <Box
        sx={{
          mb: 3,
          p: 2.2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: '0 8px 18px rgba(15,23,42,0.08)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
          <Avatar
            sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}
            alt={currentUser?.displayName || 'JD'}
            src={currentUser?.avatar || ''}
          />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {currentUser?.displayName || 'John Doe'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentUser?.email || 'john.doe@example.com'}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1,
            p: 1.2,
            borderRadius: 2,
            background: isPro
              ? 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(129,140,248,0.12))'
              : 'linear-gradient(135deg, rgba(148,163,184,0.08), rgba(226,232,240,0.2))'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isPro && (
                <WorkspacePremiumIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              )}
              <Typography variant="body2" fontWeight={600}>
                {isPro ? 'Pro workspace' : 'Free workspace'}
              </Typography>
            </Box>
            <Chip
              label={isPro ? 'PRO' : 'FREE'}
              size="small"
              color={isPro ? 'primary' : 'default'}
              variant={isPro ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.7rem', height: 22 }}
            />
          </Box>

          {currentBoardCount != null && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                <Typography variant="caption" color="text.secondary">
                  Boards
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {isPro
                    ? `${currentBoardCount} / Unlimited`
                    : boardLimit
                      ? `${currentBoardCount} / ${boardLimit}`
                      : currentBoardCount}
                </Typography>
              </Box>
              {boardLimit && Number.isFinite(boardLimit) && (
                <LinearProgress
                  variant="determinate"
                  value={Math.min(100, Math.round((currentBoardCount / boardLimit) * 100))}
                  sx={{
                    height: 6,
                    borderRadius: 999,
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 999
                    }
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          Workspace
        </Typography>
        <Stack direction="column" spacing={0.5} sx={{ mt: 1 }}>
          <SidebarItem
            className={location.pathname === '/boards' || location.pathname.startsWith('/boards/') ? 'active' : ''}
            onClick={handleNavigateBoards}
          >
            <SpaceDashboardIcon fontSize="small" />
            Boards
          </SidebarItem>
          <SidebarItem
            className={location.pathname === '/templates' ? 'active' : ''}
            onClick={handleNavigateTemplates}
          >
            <ListAltIcon fontSize="small" />
            Templates
          </SidebarItem>
          <SidebarItem
            className={location.pathname === '/' ? 'active' : ''}
            onClick={handleNavigateHome}
          >
            <HomeIcon fontSize="small" />
            Home
          </SidebarItem>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          Quick Actions
        </Typography>
        <Box sx={{ mt: 1 }}>
          <SidebarCreateBoardModal
            handleCreateBoardSuccess={handleCreateBoardSuccess}
            handleOpen={isCreateModalOpen}
            onClose={onCloseCreateModal}
            checkBoardLimit={checkBoardLimit}
          />
        </Box>
      </Box>

      {/* Recent Boards */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: 1
          }}
        >
          Recent Boards
        </Typography>
        {loadingRecent ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : recentBoards.length === 0 ? (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="caption" color="text.secondary">
              No recent boards yet
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1} sx={{ mt: 1 }}>
            {recentBoards.map((board, index) => (
              <Box
                key={board._id}
                onClick={() => handleRecentBoardClick(board._id)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: 1,
                      bgcolor: ['#ff6b6b', '#4ecdc4', '#45b7d1'][index] || '#4ecdc4'
                    }}
                  />
                  <Typography variant="body2" fontWeight="medium" noWrap>
                    {board.title}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>

  )
}

export default SidebarContent