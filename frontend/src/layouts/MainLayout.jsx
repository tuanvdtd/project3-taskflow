import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import AppBar from '~/components/AppBar/AppBar'
import SidebarContent from '~/components/SidebarContent'

const DRAWER_WIDTH = 280

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    marginLeft: DRAWER_WIDTH,
    padding: theme.spacing(0, 0, 0, 2)
  }
}))

function MainLayout({ children, handleCreateBoardSuccess, isCreateModalOpen, onCloseCreateModal }) {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar />

      <Box sx={{ paddingX: 2, my: 4, display: 'flex', flexGrow: 1 }}>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              bgcolor: 'background.default',
              borderRight: '1px solid',
              borderColor: 'divider',
              top: 70,
              height: 'calc(100vh - 80px)'
            }
          }}
          open
        >
          <SidebarContent
            handleCreateBoardSuccess={handleCreateBoardSuccess}
            isCreateModalOpen={isCreateModalOpen}
            onCloseCreateModal={onCloseCreateModal}
          />
        </Drawer>

        {/* Main Content */}
        <MainContent component="main">
          {children}
        </MainContent>
      </Box>
    </Box>
  )
}

export default MainLayout
