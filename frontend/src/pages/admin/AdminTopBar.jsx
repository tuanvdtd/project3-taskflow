import { Menu } from 'lucide-react'
import Notifications from '~/components/AppBar/Notifications/Notifications'
import Profile from '~/components/AppBar/Menu/Profile'


export function AdminTopBar({ onMenuClick }) {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Notifications/>
        {/* Profile Menu */}
        <Profile />
      </div>
    </header>
  )
}
