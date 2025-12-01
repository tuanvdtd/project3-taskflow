import { Routes, Route } from 'react-router-dom'
import Auth from '~/pages/Auth/Auth'


export default function App() {
  return (
    <Routes>
      {/* Authentication */}
      <Route path='/login' element= {<Auth />} />
      <Route path='/register' element= {<Auth />} />
      <Route path='/forgot-password' element= {<Auth />} />
      <Route path='/account/reset-password' element= {<Auth />} />
    </Routes>
  )
}
