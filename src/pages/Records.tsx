import { useState } from 'react'
import { ChevronLeft, Search, Filter, Plus, X, Trash2 } from 'lucide-react'

interface RecordsProps {
  onNavigate: (page: string) => void
}

export default function Records({ onNavigate }: RecordsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all')

  const mockRecords = [
    { id: 1, category: '餐饮', description: '午餐', amount: -45, date: '2024-06-20', time: '12:30' },
    { id: 2, category: '交通', description: '打车', amount: -32, date: '2024-06-20', time: '14:00' },
    { id: 3, category: '购物', description: '日用品', amount: -88, date: '2024-06-19', time: '16:45' },
    { id: 4, category: '收入', description: '工资', amount: 15000, date: '2024-06-15', time: '09:00' },
    { id: 5, category: '餐饮', description: '早餐', amount: -15, date: '2024-06-19', time: '07:30' },
    { id: 6, category: '娱乐', description: '电影票', amount: -80, date: '2024-06-18', time: '20:00' },
  ]

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' ||
                       (selectedType === 'income' && record.amount > 0) ||
                       (selectedType === 'expense' && record.amount < 0)
    return matchesSearch && matchesType
  })

  const groupedRecords = filteredRecords.reduce((acc, record) => {
    const date = record.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(record)
    return acc
  }, {} as Record<string, typeof mockRecords>)

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
          <h1 className="text-lg font-semibold text-gray-800">账目记录</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索记录..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {filterVisible && (
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedType('all')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === 'all' 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedType('income')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === 'income' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                收入
              </button>
              <button
                onClick={() => setSelectedType('expense')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === 'expense' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                支出
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {Object.entries(groupedRecords).map(([date, records]) => (
            <div key={date}>
              <p className="text-sm text-gray-400 mb-2">{date}</p>
              <div className="space-y-2">
                {records.map(record => (
                  <div 
                    key={record.id}
                    className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.category === '收入' 
                            ? 'bg-green-100' 
                            : record.category === '餐饮' 
                              ? 'bg-orange-100' 
                              : record.category === '交通'
                                ? 'bg-blue-100'
                                : record.category === '购物'
                                  ? 'bg-purple-100'
                                  : 'bg-pink-100'
                        }`}>
                          <span className="text-sm">
                            {record.category === '餐饮' && '🍜'}
                            {record.category === '交通' && '🚕'}
                            {record.category === '购物' && '🛍️'}
                            {record.category === '收入' && '💰'}
                            {record.category === '娱乐' && '🎬'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{record.description}</p>
                          <p className="text-xs text-gray-400">{record.category} · {record.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className={`font-semibold ${record.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {record.amount > 0 ? '+' : ''}{record.amount}
                        </p>
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">暂无记录</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('voice')}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-200"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

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
            className="flex flex-col items-center p-2 text-teal-500"
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