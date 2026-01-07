export const roles = {
  USER: 'client',
  ADMIN: 'admin'
}

export const permissions = {
  VIEW_ADMIN: 'view_admin_dashboard',
  VIEW_USER: 'view_user_dashboard'
}

export const rolePermissions = {
  [roles.USER]: [permissions.VIEW_USER],
  [roles.ADMIN]: [permissions.VIEW_ADMIN]
}