import Container from '@mui/material/Container'
import { useColorScheme } from '@mui/material/styles'
import MainLayout from '~/layouts/MainLayout'
import { TemplatesPage } from '~/components/Template/TemplatesPage'
import { useNavigate } from 'react-router-dom'

function Templates() {
  const { mode } = useColorScheme()
  const navigate = useNavigate()

  const handleCreateFromTemplate = () => {
    // api
    navigate('/boards')
  }


  return (
    <MainLayout>
      <Container disableGutters maxWidth={false}>
        <TemplatesPage
          onCreateFromTemplate={handleCreateFromTemplate}
          darkMode={mode === 'dark'}
        />
      </Container>
    </MainLayout>
  )
}

export default Templates
