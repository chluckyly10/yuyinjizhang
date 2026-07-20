import { useState } from 'react'
import { ChevronLeft, Wallet, Plus, AlertCircle, CheckCircle } from 'lucide-react'

interface BudgetProps {
  onNavigate: (page: string) => void
}

export default function Budget({ onNavigate }: BudgetProps) {
  const [budgets, setBudgets] = useState([
    { id: 1, category: '餐饮', limit: 5000, spent: 4500, icon: '🍜', color: '#FF9F43' },
    { id: 2, category: '交通', limit: 2000, spent: 1200, icon: '🚕', color: '#54A0FF' },
    { id: 3, category: '购物', limit: 3000, spent: 2800, icon: '🛍️', color: '#5F27CD' },
    { id: 4, category: '娱乐', limit: 1000, spent: 800, icon: '🎬', color: '#FF6B6B' },
  ])

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent

  const getStatus = (spent: number, limit: number) => {
    const percent = (spent / limit) * 100
    if (percent >= 100) return 'over'
    if (percent >= 80) return 'warning'
    return 'normal'
  }

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
          <h1 className="text-lg font-semibold text-gray-800">预算管理</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 mb-6 shadow-lg text-white">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-teal-100 text-sm">本月总预算</span>
          </div>
          <p className="text-3xl font-bold mb-2">¥{totalBudget}</p>
          <div className="flex gap-4 text-sm">
            <span>已用: ¥{totalSpent}</span>
            <span>剩余: ¥{remaining}</span>
          </div>
          <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(totalSpent / totalBudget) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          {budgets.map(budget => {
            const percent = (budget.spent / budget.limit) * 100
            const status = getStatus(budget.spent, budget.limit)
            const isOver = status === 'over'
            const isWarning = status === 'warning'
            
            return (
              <div 
                key={budget.id}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${budget.color}20` }}
                    >
                      <span className="text-xl">{budget.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{budget.category}</p>
                      <p className="text-xs text-gray-400">
                        预算 ¥{budget.limit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${isOver ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-gray-800'}`}>
                      ¥{budget.spent}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isOver ? '已超支' : `剩余 ¥${budget.limit - budget.spent}`}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isOver ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs ${isOver ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-gray-400'}`}>
                    {isOver ? (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 已超支 {Math.abs(percent - 100).toFixed(0)}%
                      </span>
                    ) : isWarning ? (
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 接近预算
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> 状态良好
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-400">{percent.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>

        <button
          className="w-full mt-6 py-3 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-teal-500 hover:text-teal-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          添加新预算
        </button>
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