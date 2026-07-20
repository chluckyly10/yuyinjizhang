import { useState } from 'react'
import { ChevronLeft, TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react'

interface ReportsProps {
  onNavigate: (page: string) => void
}

export default function Reports({ onNavigate }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<'month' | 'year'>('month')

  const categoryData = [
    { name: '餐饮', value: 4500, color: '#FF9F43' },
    { name: '交通', value: 1200, color: '#54A0FF' },
    { name: '购物', value: 1800, color: '#5F27CD' },
    { name: '娱乐', value: 800, color: '#FF6B6B' },
    { name: '其他', value: 200, color: '#1DD1A1' },
  ]

  const monthlyData = [
    { month: '1月', income: 15000, expense: 8000 },
    { month: '2月', income: 15000, expense: 9500 },
    { month: '3月', income: 16000, expense: 8200 },
    { month: '4月', income: 15000, expense: 7800 },
    { month: '5月', income: 17000, expense: 9000 },
    { month: '6月', income: 15000, expense: 8500 },
  ]

  const maxValue = Math.max(...categoryData.map(item => item.value))

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">报表中心</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('month')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'month' 
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            月度统计
          </button>
          <button
            onClick={() => setActiveTab('year')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'year' 
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            年度统计
          </button>
        </div>

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

        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-teal-500" />
            <h2 className="font-semibold text-gray-800">支出分类占比</h2>
          </div>
          <div className="space-y-3">
            {categoryData.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium">¥{item.value}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-teal-500" />
            <h2 className="font-semibold text-gray-800">收支趋势</h2>
          </div>
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyData.map(item => {
              const maxHeight = 120
              const incomeHeight = (item.income / 18000) * maxHeight
              const expenseHeight = (item.expense / 10000) * maxHeight
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="relative w-full h-32 flex items-end justify-center gap-1">
                    <div 
                      className="w-3 bg-green-500 rounded-t transition-all"
                      style={{ height: `${incomeHeight}px` }}
                      title={`收入: ¥${item.income}`}
                    ></div>
                    <div 
                      className="w-3 bg-red-500 rounded-t transition-all"
                      style={{ height: `${expenseHeight}px` }}
                      title={`支出: ¥${item.expense}`}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">{item.month}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-gray-500">收入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-xs text-gray-500">支出</span>
            </div>
          </div>
        </div>
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
            className="flex flex-col items-center p-2 text-teal-500"
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