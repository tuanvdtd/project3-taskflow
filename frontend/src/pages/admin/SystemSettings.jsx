import { useState } from 'react'
import { Save } from 'lucide-react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export function SystemSettings() {

  const [planLimits, setPlanLimits] = useState([
    { plan: 'Free', boards: '10', collaborators: '5', storage: '100MB', fileSize: '5MB' },
    { plan: 'Pro', boards: 'Unlimited', collaborators: 'Unlimited', storage: '10GB', fileSize: '250MB' }
  ])

  const handleSaveSettings = () => {
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Plan Settings</h1>
          <p className="text-gray-600">Configure platform features and limits</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSaveSettings}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          }}
        >
          Save Changes
        </Button>
      </div>

      {/* Plan Limits */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg text-gray-900 mb-4">Plan Limits</h3>
        <div className="space-y-6">
          {planLimits.map((limit, index) => (
            <div key={index} className="pb-6 border-b border-gray-200 last:border-0 last:pb-0">
              <h4 className="text-base text-gray-900 mb-4">{limit.plan} Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Max Boards"
                  value={limit.boards}
                  onChange={(e) => {
                    const newLimits = [...planLimits]
                    newLimits[index].boards = e.target.value
                    setPlanLimits(newLimits)
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField
                  label="Max Collaborators"
                  value={limit.collaborators}
                  onChange={(e) => {
                    const newLimits = [...planLimits]
                    newLimits[index].collaborators = e.target.value
                    setPlanLimits(newLimits)
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField
                  label="Storage Limit"
                  value={limit.storage}
                  onChange={(e) => {
                    const newLimits = [...planLimits]
                    newLimits[index].storage = e.target.value
                    setPlanLimits(newLimits)
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
                <TextField
                  label="Max File Size"
                  value={limit.fileSize}
                  onChange={(e) => {
                    const newLimits = [...planLimits]
                    newLimits[index].fileSize = e.target.value
                    setPlanLimits(newLimits)
                  }}
                  size="small"
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
