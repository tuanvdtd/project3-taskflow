import { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, Edit, Ban, Trash2, Download } from 'lucide-react'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import ErrorBoundary from '~/components/Error/ErrorBoundary'
import { getAdminUsersAPI, updateUserStatusAPI, deleteUserAPI } from '~/apis'


// API functions
const getUsers = async () => {
  const data = await getAdminUsersAPI()
  return data
}

function UsersManagementContent() {
  const { data: fetchedUsers, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => getUsers()
  })

  const [users, setUsers] = useState(fetchedUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPlan, setFilterPlan] = useState('all')
  const [anchorEl, setAnchorEl] = useState({})

  const handleMenuOpen = (userId, event) => {
    setAnchorEl({ ...anchorEl, [userId]: event.currentTarget })
  }

  const handleMenuClose = (userId) => {
    setAnchorEl({ ...anchorEl, [userId]: null })
  }

  const handleAction = (userId, action) => {
    switch (action) {
    case 'view':
      alert(`View details for user ${userId}`)
      break
    case 'edit':
      alert(`Edit user ${userId}`)
      break
    case 'suspend':
      {
        const user = users.find(u => u.id === userId)
        const newStatus = user.status === 'Active' ? 'Suspended' : 'Active'
        updateUserStatusAPI(userId, newStatus)
          .then(() => {
            setUsers(users.map(u =>
              u.id === userId ? { ...u, status: newStatus } : u
            ))
            refetch()
          })
          .catch(error => {
            alert('Failed to update user status')
            console.error(error)
          })
      }
      break
    case 'delete':
      if (confirm('Are you sure you want to delete this user?')) {
        deleteUserAPI(userId)
          .then(() => {
            setUsers(users.filter(u => u.id !== userId))
            refetch()
          })
          .catch(error => {
            alert('Failed to delete user')
            console.error(error)
          })
      }
      break
    }
    handleMenuClose(userId)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPlan = filterPlan === 'all' || user.plan === filterPlan
    return matchesSearch && matchesPlan
  })

  const getPlanColor = (plan) => {
    switch (plan) {
    case 'Free': return 'default'
    case 'Pro': return 'primary'
    case 'Team': return 'secondary'
    default: return 'default'
    }
  }

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error'
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage and monitor all users on the platform</p>
        </div>
        {/* <Button
          variant="contained"
          startIcon={<Download />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
          }}
        >
          Export Users
        </Button> */}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Plan Filter */}
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Plans</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-6 py-3 text-right text-xs text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip
                      label={user.plan}
                      color={getPlanColor(user.plan)}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Chip
                      label={user.status}
                      color={getStatusColor(user.status)}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.createdDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(user.id, e)}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl[user.id]}
                      open={Boolean(anchorEl[user.id])}
                      onClose={() => handleMenuClose(user.id)}
                    >
                      <MenuItem onClick={() => handleAction(user.id, 'suspend')}>
                        <Ban className="w-4 h-4 mr-2" />
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </MenuItem>
                      <MenuItem onClick={() => handleAction(user.id, 'delete')} sx={{ color: 'error.main' }}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Skeleton Component
function UsersManagementSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Users Table Skeleton */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </th>
                <th className="px-6 py-3 text-left">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </th>
                <th className="px-6 py-3 text-right">
                  <div className="h-3 bg-gray-200 rounded w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-48"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-8 w-8 bg-gray-200 rounded ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export { UsersManagementContent, UsersManagementSkeleton }

// Main exported component with Suspense wrapper
export function UsersManagement() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<UsersManagementSkeleton />}>
        <UsersManagementContent />
      </Suspense>
    </ErrorBoundary>
  )
}
