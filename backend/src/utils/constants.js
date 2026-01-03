
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
  Kanban: {
    columns: [
      { title: 'Backlog' },
      { title: 'To Do' },
      { title: 'In Progress' },
      { title: 'Review' },
      { title: 'Done' }
    ]
  },
  Scrum: {
    columns: [
      { title: 'To Do' },
      { title: 'In Progress' },
      { title: 'Done' }
    ]
  },
  Extreme: {
    columns: [
      { title: 'Planning' },
      { title: 'Design' },
      { title: 'Coding' },
      { title: 'Testing' },
      { title: 'Listening' }
    ]
  }
}