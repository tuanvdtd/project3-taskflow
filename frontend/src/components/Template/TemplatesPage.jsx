import React, { useState } from 'react'
import { Search, ArrowLeft, Sparkles, TrendingUp, Users, Briefcase, GraduationCap, Megaphone, Code, Palette, Layout } from 'lucide-react'
import { Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'

const templates = [
  {
    id: '1',
    name: 'Kanban Board',
    description: 'Classic Kanban workflow for visualizing and managing work in progress.',
    category: 'Work',
    useCase: 'Best for teams',
    columns: ['To Do', 'In Progress', 'Review', 'Done'],
    icon: Layout,
    color: '#3b82f6',
    featured: true,
    popular: true
  },
  {
    id: '2',
    name: 'Sprint Planning',
    description: 'Agile sprint board to plan and track development sprints effectively.',
    category: 'Software',
    useCase: 'Best for dev teams',
    columns: ['Backlog', 'Sprint Backlog', 'In Progress', 'Done'],
    icon: Code,
    color: '#8b5cf6',
    popular: true
  },
  {
    id: '3',
    name: 'Personal Task Manager',
    description: 'Simple and effective personal productivity system to organize your life.',
    category: 'Personal',
    useCase: 'Personal use',
    columns: ['Today', 'This Week', 'Later'],
    icon: Users,
    color: '#10b981',
    featured: true
  },
  {
    id: '4',
    name: 'Marketing Campaign',
    description: 'Plan, execute, and track marketing campaigns from idea to launch.',
    category: 'Marketing',
    useCase: 'Best for marketing teams',
    columns: ['Ideas', 'Planned', 'In Progress', 'Launched'],
    icon: Megaphone,
    color: '#f59e0b',
    isNew: true
  },
  {
    id: '5',
    name: 'Design Workflow',
    description: 'Streamlined design process from brief to final delivery.',
    category: 'Design',
    useCase: 'Best for design teams',
    columns: ['Brief', 'Design', 'Feedback', 'Final'],
    icon: Palette,
    color: '#ec4899',
    popular: true
  },
  {
    id: '6',
    name: 'Product Roadmap',
    description: 'Plan and visualize your product development roadmap and features.',
    category: 'Software',
    useCase: 'Best for product teams',
    columns: ['Ideas', 'Next Up', 'In Development', 'Released'],
    icon: TrendingUp,
    color: '#6366f1',
    featured: true
  },
  {
    id: '7',
    name: 'Content Calendar',
    description: 'Organize and schedule content creation and publication.',
    category: 'Marketing',
    useCase: 'Best for content teams',
    columns: ['Ideas', 'Writing', 'Review', 'Scheduled', 'Published'],
    icon: Megaphone,
    color: '#14b8a6'
  },
  {
    id: '8',
    name: 'Homework Planner',
    description: 'Keep track of assignments, projects, and study schedules.',
    category: 'Education',
    useCase: 'Best for students',
    columns: ['Assigned', 'In Progress', 'Review', 'Submitted'],
    icon: GraduationCap,
    color: '#f97316',
    isNew: true
  },
  {
    id: '9',
    name: 'Project Management',
    description: 'Complete project management workflow for complex initiatives.',
    category: 'Work',
    useCase: 'Best for project managers',
    columns: ['Planning', 'In Progress', 'Review', 'Completed'],
    icon: Briefcase,
    color: '#0ea5e9'
  },
  {
    id: '10',
    name: 'Event Planning',
    description: 'Organize all aspects of event planning from concept to execution.',
    category: 'Work',
    useCase: 'Best for event planners',
    columns: ['Ideas', 'Planning', 'Confirmed', 'Completed'],
    icon: Users,
    color: '#a855f7'
  },
  {
    id: '11',
    name: 'Bug Tracking',
    description: 'Track and manage software bugs and issues efficiently.',
    category: 'Software',
    useCase: 'Best for dev teams',
    columns: ['Reported', 'Triaged', 'In Progress', 'Fixed', 'Verified'],
    icon: Code,
    color: '#ef4444'
  },
  {
    id: '12',
    name: 'Goal Setting',
    description: 'Set, track, and achieve your personal or team goals.',
    category: 'Personal',
    useCase: 'Personal use',
    columns: ['Goals', 'In Progress', 'Review', 'Achieved'],
    icon: TrendingUp,
    color: '#22c55e'
  }
]

const categories = [
  { value: 'All', label: 'All Templates', icon: Layout },
  { value: 'Work', label: 'Work', icon: Briefcase },
  { value: 'Personal', label: 'Personal', icon: Users },
  { value: 'Education', label: 'Education', icon: GraduationCap },
  { value: 'Marketing', label: 'Marketing', icon: Megaphone },
  { value: 'Software', label: 'Software', icon: Code },
  { value: 'Design', label: 'Design', icon: Palette }
]

export function TemplatesPage({ onBack, onCreateFromTemplate, darkMode = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [boardName, setBoardName] = useState('')
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredTemplates = templates.filter(t => t.featured)

  const handleUseTemplate = (template) => {
    setSelectedTemplate(template)
    setBoardName(template.name)
    setShowCreateDialog(true)
  }

  const handleCreateBoard = () => {
    if (selectedTemplate && boardName.trim() && onCreateFromTemplate) {
      onCreateFromTemplate(selectedTemplate, boardName)
      setShowCreateDialog(false)
      setBoardName('')
      setSelectedTemplate(null)
    }
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${
                darkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          <h1 className={`mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Board Templates
          </h1>
          <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            Start faster with ready-made boards for popular workflows.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-500' : 'text-slate-400'
              }`} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-colors ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-blue-500'
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.value

              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Featured Templates */}
        {selectedCategory === 'All' && !searchQuery && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h2 className={darkMode ? 'text-white' : 'text-slate-900'}>Featured Templates</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUseTemplate={handleUseTemplate}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Templates */}
        <div>
          <h2 className={`mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {selectedCategory === 'All' ? 'All Templates' : `${selectedCategory} Templates`}
          </h2>

          {filteredTemplates.length === 0 ? (
            <div className={`text-center py-16 px-4 rounded-2xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <Layout className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-slate-300'
              }`} />
              <h3 className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-slate-900'}`}>
                No templates found
              </h3>
              <p className={darkMode ? 'text-gray-500' : 'text-slate-600'}>
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUseTemplate={handleUseTemplate}
                  darkMode={darkMode}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Board Dialog */}
      <Dialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            bgcolor: darkMode ? '#1f2937' : '#ffffff'
          }
        }}
      >
        <DialogTitle sx={{ color: darkMode ? '#ffffff' : '#0f172a' }}>
          Create Board from Template
        </DialogTitle>
        <DialogContent>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            This will create a new board with the following columns:
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedTemplate?.columns.map((column, index) => (
              <Chip
                key={index}
                label={column}
                size="small"
                sx={{
                  bgcolor: darkMode ? '#374151' : '#f1f5f9',
                  color: darkMode ? '#d1d5db' : '#475569'
                }}
              />
            ))}
          </div>
          <TextField
            autoFocus
            fullWidth
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: darkMode ? '#ffffff' : '#0f172a',
                '& fieldset': {
                  borderColor: darkMode ? '#4b5563' : '#cbd5e1'
                },
                '&:hover fieldset': {
                  borderColor: darkMode ? '#6b7280' : '#94a3b8'
                }
              },
              '& .MuiInputLabel-root': {
                color: darkMode ? '#9ca3af' : '#64748b'
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setShowCreateDialog(false)}
            sx={{
              color: darkMode ? '#9ca3af' : '#64748b',
              textTransform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBoard}
            variant="contained"
            disabled={!boardName.trim()}
            sx={{
              textTransform: 'none',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)'
              },
              '&.Mui-disabled': {
                background: darkMode ? '#374151' : '#e2e8f0',
                color: darkMode ? '#6b7280' : '#94a3b8'
              }
            }}
          >
            Create Board
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}


function TemplateCard({ template, onUseTemplate, darkMode = false }) {
  const Icon = template.icon

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        darkMode
          ? 'bg-gray-800 hover:bg-gray-750'
          : 'bg-white hover:shadow-xl'
      }`}
    >
      {/* Badges */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {template.isNew && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
            New
          </span>
        )}
        {template.popular && (
          <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
            Popular
          </span>
        )}
      </div>

      {/* Template Preview */}
      <div
        className="h-40 flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${template.color}15 0%, ${template.color}30 100%)` }}
      >
        <Icon
          className="w-16 h-16 opacity-20 absolute"
          style={{ color: template.color }}
        />
        <div className="relative z-10 flex gap-2 px-4 w-full justify-center">
          {template.columns.slice(0, 3).map((column, index) => (
            <div
              key={index}
              className={`flex-1 max-w-[80px] rounded-lg p-3 ${
                darkMode ? 'bg-gray-900/50' : 'bg-white/80'
              } backdrop-blur-sm`}
            >
              <div className={`h-1.5 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`} />
              <div className={`h-1 rounded mb-1.5 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`} />
              <div className={`h-1 rounded w-2/3 ${darkMode ? 'bg-gray-700' : 'bg-slate-200'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`${darkMode ? 'text-white' : 'text-slate-900'}`}>
            {template.name}
          </h3>
          <Chip
            label={template.category}
            size="small"
            sx={{
              bgcolor: `${template.color}20`,
              color: template.color,
              fontSize: '0.75rem',
              height: '24px'
            }}
          />
        </div>

        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          {template.description}
        </p>

        <div className={`text-xs mb-4 flex items-center gap-1.5 ${
          darkMode ? 'text-gray-500' : 'text-slate-500'
        }`}>
          <Users className="w-3.5 h-3.5" />
          {template.useCase}
        </div>

        {/* Columns Preview */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {template.columns.map((column, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded ${
                darkMode
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {column}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => onUseTemplate(template)}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            py: 1.25,
            background: `linear-gradient(135deg, ${template.color} 0%, ${template.color}dd 100%)`,
            '&:hover': {
              background: `linear-gradient(135deg, ${template.color}dd 0%, ${template.color}bb 100%)`
            }
          }}
        >
          Use Template
        </Button>
      </div>
    </div>
  )
}
