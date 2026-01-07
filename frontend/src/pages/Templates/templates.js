import { Layout, Code, Users, Megaphone, Palette, TrendingUp, GraduationCap, Briefcase } from 'lucide-react'

export const boardTemplates = [
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
    popular: true,
    createdDate: '2025-01-05'
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
    popular: true,
    createdDate: '2025-01-05'
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
    featured: true,
    createdDate: '2025-01-15'
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
    isNew: true,
    createdDate: '2025-01-15'
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
    popular: true,
    createdDate: '2025-01-20'
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
    featured: true,
    createdDate: '2025-01-10'
  },
  {
    id: '7',
    name: 'Content Calendar',
    description: 'Organize and schedule content creation and publication.',
    category: 'Marketing',
    useCase: 'Best for content teams',
    columns: ['Ideas', 'Writing', 'Review', 'Scheduled', 'Published'],
    icon: Megaphone,
    color: '#14b8a6',
    createdDate: '2025-02-01'
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
    isNew: true,
    createdDate: '2025-02-05'
  },
  {
    id: '9',
    name: 'Project Management',
    description: 'Complete project management workflow for complex initiatives.',
    category: 'Work',
    useCase: 'Best for project managers',
    columns: ['Planning', 'In Progress', 'Review', 'Completed'],
    icon: Briefcase,
    color: '#0ea5e9',
    createdDate: '2025-01-25'
  },
  {
    id: '10',
    name: 'Event Planning',
    description: 'Organize all aspects of event planning from concept to execution.',
    category: 'Work',
    useCase: 'Best for event planners',
    columns: ['Ideas', 'Planning', 'Confirmed', 'Completed'],
    icon: Users,
    color: '#a855f7',
    createdDate: '2025-02-10'
  },
  {
    id: '11',
    name: 'Bug Tracking',
    description: 'Track and manage software bugs and issues efficiently.',
    category: 'Software',
    useCase: 'Best for dev teams',
    columns: ['Reported', 'Triaged', 'In Progress', 'Fixed', 'Verified'],
    icon: Code,
    color: '#ef4444',
    createdDate: '2025-01-18'
  },
  {
    id: '12',
    name: 'Goal Setting',
    description: 'Set, track, and achieve your personal or team goals.',
    category: 'Personal',
    useCase: 'Personal use',
    columns: ['Goals', 'In Progress', 'Review', 'Achieved'],
    icon: TrendingUp,
    color: '#22c55e',
    createdDate: '2025-01-28'
  }
]

export const templateCategories = [
  { value: 'All', label: 'All Templates', icon: Layout },
  { value: 'Work', label: 'Work', icon: Briefcase },
  { value: 'Personal', label: 'Personal', icon: Users },
  { value: 'Education', label: 'Education', icon: GraduationCap },
  { value: 'Marketing', label: 'Marketing', icon: Megaphone },
  { value: 'Software', label: 'Software', icon: Code },
  { value: 'Design', label: 'Design', icon: Palette }
]
