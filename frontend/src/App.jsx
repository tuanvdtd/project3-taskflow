import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, fetchCurrentUserAPI } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards/index'
import Home from '~/pages/Home/Home'
import Auth0Callback from './pages/Auth/Auth0Callback'
import VNPayReturn from './pages/Payment/VNPayReturn'
import Templates from './pages/Templates/index'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { DashboardOverview } from './pages/admin/DashboardOverview'
import { UsersManagement } from './pages/admin/UsersManagement'
import { TemplatesManagement } from './pages/admin/TemplatesManagement'
import { PaymentsBilling } from './pages/admin/PaymentsBilling'
import { SystemSettings } from './pages/admin/SystemSettings'
import { roles } from '~/config/rbacConfig'
import { permissions } from './config/rbacConfig'
import { usePermission } from '~/customHooks/usePermission'
import AccessDenied from './pages/AccessDenied/AccessDenied'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/" replace={true} />
  }
  else return <Outlet /> // nếu có user trong storage thì chuyển xuống các route con trong route cha
}

const RoleRoute = ({ user, requiredPermission, redirectTo = '/access-denied' }) => {
  const userRole = user?.role || roles.USER
  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  return <Outlet />
}

const LoginedRedirect = ({ user }) => {
  const userRole = user?.role || roles.USER
  if (user && userRole === roles.USER) {
    return <Navigate to="/boards" replace={true} />
  }
  else if (user && userRole === roles.ADMIN) {
    return <Navigate to="/admin" replace={true} />
  }
  else return <Outlet />
}

const titleMap = {
  '/': 'Home | My App',
  '/boards': 'My Boards | My App',
  '/settings/account': 'Account Settings | My App',
  '/settings/security': 'Security Settings | My App',
  '/login': 'Login | My App',
  '/register': 'Sign Up | My App',
  '/callback': 'Login with Auth0 | My App',
  '/forgot-password': 'Forgot Password | My App',
  '/account/verification': 'Account Verification | My App',
  '/account/reset-password': 'Reset Password | My App',
  '/settings/billing': 'Pricing | My App',
  '/vnpay-return': 'Payment | My App',
  '/templates': 'Templates | My App',
  '/admin': 'Dashboard Overview | Admin',
  '/admin/overview': 'Dashboard Overview | Admin',
  '/admin/users': 'Users Management | Admin',
  '/admin/templates': 'Templates Management | Admin',
  '/admin/plans': 'Plans & Subscriptions | Admin',
  '/admin/payments': 'Payments & Billing | Admin'
}

export default function App() {
  const currUser = useSelector(selectCurrentUser)
  const location = useLocation()
  const dispatch = useDispatch()
  const hasSyncedMeRef = useRef(false)

  useEffect(() => {
    const path = location.pathname

    if (path.startsWith('/boards/') && path.split('/').length === 3) {
      document.title = 'Board Details | My App'
      return
    }

    document.title = titleMap[path] || 'Page Not Found | My App'
  }, [location.pathname])

  // Đồng bộ thông tin user từ BE sau khi đã có currUser (vd vừa login / load từ persist)
  // Chỉ gọi 1 lần mỗi session để cập nhật plan/giới hạn board mới nhất
  useEffect(() => {
    if (currUser && !hasSyncedMeRef.current) {
      hasSyncedMeRef.current = true
      dispatch(fetchCurrentUserAPI())
    }
  }, [currUser, dispatch])

  return (
    <Routes>
      {/* Chưa làm trang home => Tạm thời redirect về trang board đầu tiên */}
      {/* Khi dùng navigate và dùng replace thì sẽ không giữ lại '/' trong history, khi ta back lại bằng mũi tên trên trình duyệt sẽ quay lại trang trước đó, không phải trang '/' nữa */}
      {/* Nếu kh dùng replace thì khi back lại sẽ quay về trang '/' rồi nó lại tự navigate về trang board đầu tiên, nghĩa là luôn luôn ở trang board, không thể back lại */}
      <Route element= {<LoginedRedirect user={currUser} />} >
        <Route path='/'
          // element={<Navigate to='/boards' replace={true} />}
          element= {<Home />}
        />
      </Route>

      {/* Route này bảo vệ các route con, nếu chưa có user thì không thể vào các route con bên trong */}
      <Route element={<ProtectedRoute user={currUser} />}>
        {/* Nếu đã login thì mới có thể truy cập vào route con này */}
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_USER} />}>
          <Route path='/boards/:boardId' element={<Board />} />
          <Route path='/boards' element={<Boards />} />
          <Route path='/templates' element={<Templates />} />
          {/* Payment */}
          <Route path='/vnpay-return' element={<VNPayReturn />} />
        </Route>
        <Route element={<RoleRoute user={currUser} requiredPermission={permissions.VIEW_ADMIN} />}>
          <Route path='/admin' element={<AdminDashboard />}>
            <Route index element={<Navigate to='/admin/overview' replace />} />
            <Route path='overview' element={<DashboardOverview />} />
            <Route path='users' element={<UsersManagement />} />
            <Route path='templates' element={<TemplatesManagement />} />
            <Route path='plans' element={<SystemSettings />} />
            <Route path='payments' element={<PaymentsBilling />} />
          </Route>
        </Route>
        <Route path='/settings/account' element={<Settings />} />
        <Route path='/settings/security' element={<Settings />} />
        <Route path='/settings/billing' element={<Settings />} />
      </Route>

      {/* Authentication */}
      <Route path='/login' element= {<Auth />} />
      <Route path='/register' element= {<Auth />} />
      <Route path='/forgot-password' element= {<Auth />} />
      <Route path='/callback' element={<Auth0Callback />} />
      <Route path='/account/verification' element= {<AccountVerification />} />
      <Route path='/account/reset-password' element= {<Auth />} />

      <Route path='*' element= {<NotFound />} />
      <Route path="/access-denied" element={<AccessDenied />} />
    </Routes>
  )
}
