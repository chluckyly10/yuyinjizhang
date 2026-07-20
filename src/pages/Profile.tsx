import { useState } from 'react'
import { ChevronLeft, User, Settings, Bell, HelpCircle, Shield, ChevronRight, LogOut } from 'lucide-react'

interface ProfileProps {
  onNavigate: (page: string) => void
}

export default function Profile({ onNavigate }: ProfileProps) {
  const [userInfo] = useState({
    name: '用户',
    avatar: '',
    email: 'user@example.com'
  })

  const menuItems = [
    { icon: Bell, label: '消息通知', badge: '3' },
    { icon: Shield, label: '账号安全' },
    { icon: HelpCircle, label: '帮助中心' },
    { icon: Settings, label: '设置' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">个人中心</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-teal-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>
              <p className="text-gray-400 text-sm">{userInfo.email}</p>
            </div>
            <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium">
              编辑资料
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-teal-500" />
                <span className="text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-500" />
              <span className="text-red-500">退出登录</span>
            </div>
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          智能语音记账 v1.0.0
        </p>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-xs mt-1">首页</span>
          </button>
          <button 
            onClick={() => onNavigate('records')}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-xs mt-1">账目</span>
          </button>
          <button 
            onClick={() => onNavigate('voice')}
            className="w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-200 -mt-4"
          >
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <button 
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 0 1-9 9" />
              <path d="M21 3a9 9 0 0 0-9 9" />
              <path d="M3 3l3.6 3.6" />
              <path d="M21 21l-3.6-3.6" />
            </svg>
            <span className="text-xs mt-1">报表</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center p-2 text-teal-500"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-xs mt-1">我的</span>
          </button>
        </div>
      </nav>
    </div>
  )
}