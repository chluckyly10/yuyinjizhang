import { Mic, TrendingUp, TrendingDown, Wallet, PieChart, Settings, Bell } from 'lucide-react'

interface HomeProps {
  onNavigate: (page: string) => void
}

export default function Home({ onNavigate }: HomeProps) {
  const mockRecords = [
    { id: 1, category: '餐饮', description: '午餐', amount: -45, time: '12:30' },
    { id: 2, category: '交通', description: '打车', amount: -32, time: '14:00' },
    { id: 3, category: '购物', description: '日用品', amount: -88, time: '16:45' },
    { id: 4, category: '收入', description: '工资', amount: 15000, time: '09:00' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">智能语音记账</h1>
            <p className="text-teal-100 text-sm">今天是 2024年6月20日</p>
          </div>
          <div className="flex gap-3">
            <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-gray-600 text-sm">本月收入</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">¥15,000</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-gray-600 text-sm">本月支出</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">¥8,500</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="text-center">
            <p className="text-teal-100 text-sm mb-1">本月结余</p>
            <p className="text-3xl font-bold text-white mb-4">¥6,500</p>
            <button
              onClick={() => onNavigate('voice')}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-105 hover:shadow-xl transition-all"
            >
              <Mic className="w-10 h-10 text-teal-500" />
            </button>
            <p className="mt-4 text-sm text-teal-100">点击开始语音记账</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => onNavigate('reports')}
            className="flex-1 bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
          >
            <PieChart className="w-6 h-6 text-teal-500 mb-2" />
            <span className="text-gray-700 font-medium">报表中心</span>
          </button>
          <button 
            onClick={() => onNavigate('budget')}
            className="flex-1 bg-white rounded-xl p-4 shadow hover:shadow-lg transition-shadow"
          >
            <Wallet className="w-6 h-6 text-orange-500 mb-2" />
            <span className="text-gray-700 font-medium">预算管理</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">最近记录</h2>
            <button 
              onClick={() => onNavigate('records')}
              className="text-teal-500 text-sm hover:text-teal-600"
            >
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {mockRecords.map(record => (
              <div 
                key={record.id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.category === '收入' 
                      ? 'bg-green-100' 
                      : record.category === '餐饮' 
                        ? 'bg-orange-100' 
                        : record.category === '交通'
                          ? 'bg-blue-100'
                          : 'bg-purple-100'
                  }`}>
                    <span className="text-sm font-medium text-gray-700">
                      {record.category === '餐饮' && '🍜'}
                      {record.category === '交通' && '🚕'}
                      {record.category === '购物' && '🛍️'}
                      {record.category === '收入' && '💰'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{record.description}</p>
                    <p className="text-sm text-gray-400">{record.time}</p>
                  </div>
                </div>
                <p className={`font-semibold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center p-2 text-teal-500"
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
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => onNavigate('reports')}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-500"
          >
            <PieChart className="w-6 h-6" />
            <span className="text-xs mt-1">报表</span>
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="flex flex-col items-center p-2 text-gray-400 hover:text-teal-500"
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