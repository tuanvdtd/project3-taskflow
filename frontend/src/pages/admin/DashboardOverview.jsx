import { Users, Trello, CreditCard, TrendingUp } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import ErrorBoundary from '~/components/Error/ErrorBoundary'
import { getDashboardStatsAPI, getUserGrowthAPI, getSubscriptionDistributionAPI, getRevenueAPI } from '~/apis'

// API functions
const getDashboardStats = async () => {
  const data = await getDashboardStatsAPI()
  return data
}

const getUserGrowth = async () => {
  const data = await getUserGrowthAPI()
  return data
}

const getSubscriptionDistribution = async () => {
  const data = await getSubscriptionDistributionAPI()
  return data
}

const getRevenue = async () => {
  const data = await getRevenueAPI()
  return data
}

function StatCard({ title, value, change, icon, trend }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl text-gray-900 mb-2">{value}</h3>
          {change && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  )
}

function DashboardOverviewContent() {
  const { data: stats } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => getDashboardStats()
  })

  const { data: userGrowth } = useQuery({
    queryKey: ['admin', 'dashboard', 'userGrowth'],
    queryFn: () => getUserGrowth()
  })

  const { data: subscriptionDistribution } = useQuery({
    queryKey: ['admin', 'dashboard', 'subscriptionDistribution'],
    queryFn: () => getSubscriptionDistribution()
  })

  const { data: revenue } = useQuery({
    queryKey: ['admin', 'dashboard', 'revenue'],
    queryFn: () => getRevenue()
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your platform's key metrics and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users className="w-6 h-6 text-blue-600" />}
        />
        <StatCard
          title="Total Boards"
          value={stats.totalBoards.toLocaleString()}
          icon={<Trello className="w-6 h-6 text-purple-600" />}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          icon={<CreditCard className="w-6 h-6 text-orange-600" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <h3 className="text-lg text-gray-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

// Skeleton Component
function DashboardOverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-[300px] bg-gray-100 rounded"></div>
        </div>

        {/* Subscription Distribution Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-[300px] bg-gray-100 rounded"></div>
        </div>

        {/* Revenue Chart Skeleton */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 lg:col-span-2">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="h-[300px] bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export { DashboardOverviewContent, DashboardOverviewSkeleton }

// Main exported component with Suspense wrapper
export function DashboardOverview() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardOverviewSkeleton />}>
        <DashboardOverviewContent />
      </Suspense>
    </ErrorBoundary>
  )
}
