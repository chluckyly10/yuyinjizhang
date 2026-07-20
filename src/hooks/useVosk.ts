import { useState, useCallback, useRef, useEffect } from 'react'

interface UseLocalVoiceInputResult {
  isRecording: boolean
  transcript: string
  isLoading: boolean
  startRecording: () => Promise<void>
  stopRecording: () => void
  error: string | null
  supported: boolean
  setManualTranscript: (text: string) => void
}

export function useLocalVoiceInput(): UseLocalVoiceInputResult {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const supported = true

  const startRecording = useCallback(async () => {
    if (isRecording) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = mediaStream
      
      const mediaRecorder = new MediaRecorder(mediaStream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.onstop = () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop())
          mediaStreamRef.current = null
        }
        mediaRecorderRef.current = null
      }
      
      mediaRecorder.start(100)
      setIsRecording(true)
      
    } catch (err) {
      console.error('Failed to access microphone:', err)
      setError(err instanceof Error ? err.message : '无法访问麦克风，请检查权限设置')
    } finally {
      setIsLoading(false)
    }
  }, [isRecording])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
    
    mediaRecorderRef.current = null
    setIsRecording(false)
  }, [isRecording])

  const setManualTranscript = useCallback((text: string) => {
    setTranscript(text)
  }, [])

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [stopRecording])

  return {
    isRecording,
    transcript,
    isLoading,
    startRecording,
    stopRecording,
    error,
    supported,
    setManualTranscript
  }
}