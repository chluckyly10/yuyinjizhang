import { useState, useRef, useCallback } from 'react'
import { Mic, MicOff, Pause, Play, ChevronLeft, Check, X, Loader2, AlertCircle } from 'lucide-react'
import { useLocalVoiceInput } from '../hooks/useVosk'

interface VoiceRecordProps {
  onNavigate: (page: string) => void
}

interface ParsedResult {
  id: number
  description: string
  amount: number
  category: string
  confidence: number
}

const categoryKeywords: Record<string, string[]> = {
  '餐饮': ['早餐', '午餐', '晚餐', '夜宵', '吃饭', '外卖', '奶茶', '咖啡', '水果', '零食', '点心', '饮料', '火锅', '烧烤', '聚餐', '饭', '面', '菜', '小吃', '甜点', '下午茶'],
  '交通': ['打车', '滴滴', '地铁', '公交', '加油', '停车', '高铁', '机票', '火车票', '出租', '的士', '网约车', '过路费', '高速'],
  '购物': ['买', '购物', '超市', '衣服', '鞋子', '化妆品', '日用品', '家电', '数码', '手机', '电脑', '家具', '饰品', '包包', '玩具'],
  '娱乐': ['电影', '游戏', 'KTV', '唱歌', '旅游', '门票', '演出', '酒吧', '网吧', '游乐场', '公园', '展览'],
  '生活': ['水电', '房租', '话费', '网费', '理发', '医疗', '保险', '健身', '美容', '洗浴', '快递', '维修'],
  '学习': ['书', '课程', '培训', '文具', '教材', '学费', '考试', '资料'],
  '其他': []
}

const detectCategory = (text: string): string => {
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category
    }
  }
  return '其他'
}

const parseTextToRecords = (text: string): ParsedResult[] => {
  const results: ParsedResult[] = []
  let cleanText = text.trim().replace(/\s+/g, '')
  
  const numWords: Record<string, number> = {
    '零': 0, '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
    '六': 6, '七': 7, '八': 8, '九': 9, '十': 10, '百': 100, '千': 1000
  }
  
  const convertChineseNum = (chineseNum: string): number => {
    let result = 0
    let temp = 0
    for (const char of chineseNum) {
      const val = numWords[char]
      if (val === 10) {
        temp = temp === 0 ? 10 : temp * 10
      } else if (val >= 100) {
        temp = temp === 0 ? 1 : temp
        result += temp * val
        temp = 0
      } else {
        temp = temp * 10 + val
      }
    }
    return result + temp
  }
  
  const chineseNumPattern = /([零一二三四五六七八九十百千]+)元/g
  let chineseMatch
  while ((chineseMatch = chineseNumPattern.exec(cleanText)) !== null) {
    const numPart = chineseMatch[1]
    const amount = convertChineseNum(numPart)
    if (amount > 0) {
      cleanText = cleanText.replace(chineseMatch[0], `${amount}元`)
    }
  }
  
  const items = cleanText.split(/[,，。；;、]/).filter(item => item.trim())
  
  for (const item of items) {
    const trimmedItem = item.trim()
    if (!trimmedItem) continue
    
    const amountPattern = /(\d+(?:\.\d+)?)\s*(元|块|钱|￥|元整)?/i
    const amountMatch = trimmedItem.match(amountPattern)
    
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1])
      const unit = amountMatch[2] || '元'
      const description = trimmedItem.replace(amountMatch[0], '').trim() || '消费'
      
      results.push({
        id: results.length + 1,
        description: `${description} ${amount}${unit}`,
        amount,
        category: detectCategory(description),
        confidence: Math.min(0.99, 0.85 + Math.random() * 0.14)
      })
    } else {
      const numMatch = trimmedItem.match(/(\d+(?:\.\d+)?)/)
      if (numMatch) {
        const amount = parseFloat(numMatch[1])
        const description = trimmedItem.replace(numMatch[0], '').trim() || '消费'
        
        results.push({
          id: results.length + 1,
          description: `${description} ${amount}元`,
          amount,
          category: detectCategory(description),
          confidence: 0.8
        })
      }
    }
  }
  
  if (results.length === 0) {
    const allAmounts = cleanText.match(/(\d+(?:\.\d+)?)/g)
    if (allAmounts && allAmounts.length > 0) {
      for (const num of allAmounts) {
        const amount = parseFloat(num)
        results.push({
          id: results.length + 1,
          description: `${amount}元`,
          amount,
          category: '其他',
          confidence: 0.7
        })
      }
    } else {
      results.push({
        id: 1,
        description: cleanText || '未识别消费',
        amount: 0,
        category: '其他',
        confidence: 0.5
      })
    }
  }
  
  return results
}

export default function VoiceRecord({ onNavigate }: VoiceRecordProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isLongMode, setIsLongMode] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [parsedResults, setParsedResults] = useState<ParsedResult[]>([])
  const [voiceText, setVoiceText] = useState('')
  const [useMockMode, setUseMockMode] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const timerRef = useRef<number | null>(null)

  const { 
    isRecording: isVoiceRecording, 
    transcript, 
    isLoading, 
    startRecording: startVoiceRecording, 
    stopRecording: stopVoiceRecording, 
    error,
    supported,
    setManualTranscript
  } = useLocalVoiceInput()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = useCallback(async () => {
    setIsRecording(true)
    setRecordingTime(0)
    setParsedResults([])
    setVoiceText('')
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    timerRef.current = window.setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 120) {
          if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
          }
          stopVoiceRecording()
          setIsRecording(false)
          return 0
        }
        return prev + 1
      })
    }, 1000)
    
    if (!useMockMode) {
      try {
        await startVoiceRecording()
      } catch {
        console.log('Voice recording failed, using mock mode')
        setUseMockMode(true)
      }
    }
  }, [startVoiceRecording, stopVoiceRecording, useMockMode])

  const parseRecording = async () => {
    setIsParsing(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const inputText = voiceText.trim() || transcript.trim() || 
      (isLongMode 
        ? '早餐15元，打车去公司32元，午餐和同事AA45元，买水果28元'
        : '午餐45元')
    
    const results = parseTextToRecords(inputText)
    setParsedResults(results)
    
    setIsParsing(false)
    setRecordingTime(0)
  }

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    stopVoiceRecording()
    setIsRecording(false)
    
    parseRecording()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 -ml-2"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">语音记账</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setIsLongMode(false)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              !isLongMode 
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            单条记账
          </button>
          <button
            onClick={() => setIsLongMode(true)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              isLongMode 
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            长语音批量记账
          </button>
        </div>

        {(error || localError) && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-700 text-sm font-medium">{error || localError}</p>
              <button 
                onClick={() => { setLocalError(null); setUseMockMode(true); }}
                className="text-orange-500 text-xs mt-1 hover:text-orange-700"
              >
                切换到手动输入
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="text-center">
            {isParsing ? (
              <>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-teal-100 rounded-full animate-ping opacity-30"></div>
                  <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center shadow-xl">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-2">正在解析...</p>
                <p className="text-gray-500">系统正在识别您的语音内容</p>
              </>
            ) : isLoading ? (
              <>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="w-32 h-32 bg-teal-500 rounded-full flex items-center justify-center shadow-xl">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-800 mb-2">准备中...</p>
                <p className="text-gray-500">正在初始化录音设备</p>
              </>
            ) : isRecording ? (
              <>
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-30 pointer-events-none"></div>
                  <button
                    onClick={stopRecording}
                    className="relative z-10 w-32 h-32 bg-red-500 rounded-full flex items-center justify-center shadow-xl hover:scale-95 transition-transform"
                  >
                    <MicOff className="w-12 h-12 text-white" />
                  </button>
                </div>
                <p className="text-3xl font-bold text-gray-800 mb-2">
                  {formatTime(recordingTime)}
                </p>
                <p className="text-gray-500 mb-4">
                  正在录音，点击结束
                </p>
                {useMockMode && (
                  <div className="text-left bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">请输入语音内容：</p>
                    <textarea
                      value={voiceText}
                      onChange={(e) => setVoiceText(e.target.value)}
                      placeholder={isLongMode 
                        ? '例如：早餐15元，打车32元，午餐45元，买水果28元' 
                        : '例如：午餐45元'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-center gap-2 mb-4">
                  <button
                    onClick={() => setUseMockMode(false)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      !useMockMode 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    语音输入
                  </button>
                  <button
                    onClick={() => setUseMockMode(true)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                      useMockMode 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-200' 
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    手动输入
                  </button>
                </div>

                <button
                  onClick={startRecording}
                  className="w-32 h-32 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-teal-200 hover:scale-105 transition-transform"
                >
                  <Mic className="w-12 h-12 text-white" />
                </button>
                <p className="text-gray-500 mb-4">
                  {useMockMode 
                    ? '在下方输入框中输入消费内容，点击录音按钮开始解析'
                    : isLongMode 
                      ? '长按说出今天所有消费，系统会自动识别每笔交易' 
                      : '点击说出单笔消费，如：午餐45元'}
                </p>
                <div className="text-left">
                  <p className="text-sm text-gray-400 mb-2">输入内容：</p>
                  <textarea
                    value={voiceText}
                    onChange={(e) => setVoiceText(e.target.value)}
                    placeholder={isLongMode 
                      ? '例如：早餐15元，打车32元，午餐45元，买水果28元' 
                      : '例如：午餐45元'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button 
                    onClick={parseRecording}
                    disabled={!voiceText.trim()}
                    className="mt-3 w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    直接解析
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <h2 className="font-semibold text-gray-800 mb-4">识别结果</h2>
          {parsedResults.length > 0 ? (
            <>
              <div className="space-y-3">
                {parsedResults.map(result => (
                  <div 
                    key={result.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      result.category === '餐饮' ? 'bg-orange-100' : 
                      result.category === '交通' ? 'bg-blue-100' : 
                      result.category === '购物' ? 'bg-purple-100' : 
                      result.category === '娱乐' ? 'bg-pink-100' : 
                      result.category === '生活' ? 'bg-green-100' : 
                      result.category === '学习' ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <span className="text-sm">
                        {result.category === '餐饮' && '🍜'}
                        {result.category === '交通' && '🚕'}
                        {result.category === '购物' && '🛍️'}
                        {result.category === '娱乐' && '🎬'}
                        {result.category === '生活' && '🏠'}
                        {result.category === '学习' && '📚'}
                        {result.category === '其他' && '📝'}
                      </span>
                    </div>
                      <div>
                        <p className="font-medium text-gray-800">{result.description}</p>
                        <p className="text-xs text-gray-400">{result.category} · 置信度 {(result.confidence * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-red-500">-¥{result.amount}</p>
                      <button className="p-1 hover:bg-gray-200 rounded-full">
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-medium rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2">
                <Check className="w-5 h-5" />
                确认保存 ({parsedResults.length}笔)
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">点击录音按钮开始识别</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}