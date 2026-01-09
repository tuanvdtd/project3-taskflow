import { useState, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { useDebounceFn } from '~/customHooks/useDebounceFn'

const modalStyle = {
  position: 'absolute',
  top: '15%',
  left: '50%',
  transform: 'translate(-50%, 0)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0,
  outline: 'none'
}

function FilterModal({ open, onClose, onFilterChange, initialKeyword = '' }) {
  const [keyword, setKeyword] = useState(initialKeyword)

  // Wrap onFilterChange trong useCallback để có stable reference
  const stableOnFilterChange = useCallback((value) => {
    onFilterChange(value)
  }, [onFilterChange])

  // Sử dụng useDebounceFn ở top level
  const debouncedFilter = useDebounceFn(stableOnFilterChange, 500)

  useEffect(() => {
    if (open) {
      setKeyword(initialKeyword)
    }
  }, [open, initialKeyword])

  useEffect(() => {
    debouncedFilter(keyword)
  }, [keyword, debouncedFilter])

  const handleClose = () => {
    onClose()
  }

  const handleInputChange = (e) => {
    setKeyword(e.target.value)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="filter-modal-title"
    >
      <Box sx={modalStyle}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: 2,
            py: 1.5
          }}
        >
          <Typography
            id="filter-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 600, fontSize: '16px' }}
          >
            Filter
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              mb: 1.5,
              fontSize: '14px',
              color: 'text.primary'
            }}
          >
            Từ khóa
          </Typography>

          <TextField
            fullWidth
            placeholder="Nhập từ khóa..."
            value={keyword}
            onChange={handleInputChange}
            autoFocus
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
                '& fieldset': {
                  borderColor: 'primary.main'
                },
                '&:hover fieldset': {
                  borderColor: 'primary.main'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: 2
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ '&.MuiSvgIcon-root': { color: 'inherit' } }} />
                </InputAdornment>
              )
            }}
          />

          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 1.5,
              color: 'text.secondary',
              fontSize: '12px'
            }}
          >
            Search cards, members, labels and more.
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}

export default FilterModal
