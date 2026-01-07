import { Plus, Star } from 'lucide-react'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import { boardTemplates } from '../Templates/templates'


export function TemplatesManagement() {
  const templates = boardTemplates

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Templates Management</h1>
          <p className="text-gray-600">Create and manage board templates for users</p>
        </div>
        <Button
          variant="contained"
          startIcon={<Plus />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          }}
        >
          Create Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg text-gray-900">{template.name}</h3>
                  {template.featured && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                  {template.popular && (
                    <Chip label="Popular" size="small" sx={{ bgcolor: '#ff9800', color: 'white', height: '20px', fontSize: '0.7rem' }} />
                  )}
                  {template.isNew && (
                    <Chip label="New" size="small" sx={{ bgcolor: '#4caf50', color: 'white', height: '20px', fontSize: '0.7rem' }} />
                  )}
                </div>
                <Chip
                  label={template.category}
                  size="small"
                  sx={{
                    bgcolor: `${template.color}20`,
                    color: template.color,
                    fontSize: '0.75rem'
                  }}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Columns:</p>
              <div className="flex flex-wrap gap-1">
                {template.columns.map((column, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {column}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>{template.columns.length} columns</span>
            </div>

            {template.createdDate && (
              <div className="pt-3 border-t border-gray-200 text-xs text-gray-500">
                Created: {template.createdDate}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
