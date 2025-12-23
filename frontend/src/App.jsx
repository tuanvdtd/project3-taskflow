import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Home from '~/pages/Home/Home'
import Auth0Callback from './pages/Auth/Auth0Callback'

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/" replace={true} />
  }
  else return <Outlet /> // nếu có user trong storage thì chuyển xuống các route con trong route cha
}

const LoginedRedirect = ({ user }) => {
  if (user) {
    return <Navigate to="/boards" replace={true} />
  }
  else return <Outlet />
}

export default function App() {
  const currUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Khi dùng navigate và dùng replace thì sẽ không giữ lại '/' trong history, khi ta back lại bằng mũi tên trên trình duyệt sẽ quay lại trang trước đó, không phải trang '/' nữa */}
      {/* Nếu kh dùng replace thì khi back lại sẽ quay về trang '/' rồi nó lại tự navigate về trang board đầu tiên, nghĩa là luôn luôn ở trang board, không thể back lại */}
      <Route element= {<LoginedRedirect user={currUser} />} >
        <Route path='/' element= {<Home />}
        />
      </Route>

      {/* Authentication */}
      <Route path='/login' element= {<Auth />} />
      <Route path='/register' element= {<Auth />} />
      <Route path='/forgot-password' element= {<Auth />} />
      <Route path='/callback' element={<Auth0Callback />} />
      <Route path='/account/verification' element= {<AccountVerification />} />
      <Route path='/account/reset-password' element= {<Auth />} />
      <Route path='*' element= {<NotFound />} />

    </Routes>
  )
}
