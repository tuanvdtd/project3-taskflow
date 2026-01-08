
import { env } from '~/config/environment'

/**
 * Danh sách các domain được phép truy cập API
 */

export const WHITELIST_DOMAINS = [env.WEBSITE_DOMAIN_DEV, env.WEBSITE_DOMAIN_PRODUCTION]

export const BOARD_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}
export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 8

export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEV)

export const INVITATION_TYPES = {
  BOARD_INVITATION: 'BOARD_INVITATION'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const CARD_MEMBER_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

export const BOARD_TEMPLATES = {
  'kanban-board': {
    id: 'kanban-board',
    name: 'Kanban Board',
    description: 'Classic Kanban workflow for visualizing and managing work in progress.',
    category: 'Work',
    columns: [
      { title: 'To Do' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Done' }
    ]
  },
  'sprint-planning': {
    id: 'sprint-planning',
    name: 'Sprint Planning',
    description: 'Agile sprint board to plan and track development sprints effectively.',
    category: 'Software',
    columns: [
      { title: 'Backlog' },
      { title: 'Sprint Backlog' },
      { title: 'In Progress' },
      { title: 'Done' }
    ]
  },
  'personal-task-manager': {
    id: 'personal-task-manager',
    name: 'Personal Task Manager',
    description: 'Simple and effective personal productivity system to organize your life.',
    category: 'Personal',
    columns: [
      { title: 'Today' },
      { title: 'This Week' },
      { title: 'Later' }
    ]
  },
  'marketing-campaign': {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    description: 'Plan, execute, and track marketing campaigns from idea to launch.',
    category: 'Marketing',
    columns: [
      { title: 'Ideas' },
      { title: 'Planned' },
      { title: 'In Progress' },
      { title: 'Launched' }
    ]
  },
  'design-workflow': {
    id: 'design-workflow',
    name: 'Design Workflow',
    description: 'Streamlined design process from brief to final delivery.',
    category: 'Design',
    columns: [
      { title: 'Brief' },
      { title: 'Design' },
      { title: 'Feedback' },
      { title: 'Final' }
    ]
  },
  'product-roadmap': {
    id: 'product-roadmap',
    name: 'Product Roadmap',
    description: 'Plan and visualize your product development roadmap and features.',
    category: 'Software',
    columns: [
      { title: 'Ideas' },
      { title: 'Next Up' },
      { title: 'In Development' },
      { title: 'Released' }
    ]
  },
  'content-calendar': {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: 'Organize and schedule content creation and publication.',
    category: 'Marketing',
    columns: [
      { title: 'Ideas' },
      { title: 'Writing' },
      { title: 'Review' },
      { title: 'Scheduled' },
      { title: 'Published' }
    ]
  },
  'homework-planner': {
    id: 'homework-planner',
    name: 'Homework Planner',
    description: 'Keep track of assignments, projects, and study schedules.',
    category: 'Education',
    columns: [
      { title: 'Assigned' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Submitted' }
    ]
  },
  'project-management': {
    id: 'project-management',
    name: 'Project Management',
    description: 'Complete project management workflow for complex initiatives.',
    category: 'Work',
    columns: [
      { title: 'Planning' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Completed' }
    ]
  },
  'event-planning': {
    id: 'event-planning',
    name: 'Event Planning',
    description: 'Organize all aspects of event planning from concept to execution.',
    category: 'Work',
    columns: [
      { title: 'Ideas' },
      { title: 'Planning' },
      { title: 'Confirmed' },
      { title: 'Completed' }
    ]
  },
  'bug-tracking': {
    id: 'bug-tracking',
    name: 'Bug Tracking',
    description: 'Track and manage software bugs and issues efficiently.',
    category: 'Software',
    columns: [
      { title: 'Reported' },
      { title: 'Triaged' },
      { title: 'In Progress' },
      { title: 'Fixed' },
      { title: 'Verified' }
    ]
  },
  'goal-setting': {
    id: 'goal-setting',
    name: 'Goal Setting',
    description: 'Set, track, and achieve your personal or team goals.',
    category: 'Personal',
    columns: [
      { title: 'Goals' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Achieved' }
    ]
  },
  'Kanban': {
    columns: [
      { title: 'Backlog' },
      { title: 'To Do' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Done' }
    ]
  },
  'Scrum': {
    columns: [
      { title: 'To Do' },
      { title: 'In Progress' },
      { title: 'Done' }
    ]
  },
  'Extreme': {
    columns: [
      { title: 'Planning' },
      { title: 'Design' },
      { title: 'Coding' },
      { title: 'Testing' },
      { title: 'Listening' }
    ]
  }
}