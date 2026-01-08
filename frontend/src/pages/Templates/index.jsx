import Container from '@mui/material/Container'
import { useColorScheme } from '@mui/material/styles'
import MainLayout from '~/layouts/MainLayout'
import { TemplatesPage } from '~/components/Template/TemplatesPage'

function Templates() {
  const { mode } = useColorScheme()

  return (
    <MainLayout>
      <Container disableGutters maxWidth={false}>
        <TemplatesPage
          darkMode={mode === 'dark'}
        />
      </Container>
    </MainLayout>
  )
}

export default Templates
