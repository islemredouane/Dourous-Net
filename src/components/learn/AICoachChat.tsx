'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot } from 'lucide-react'

interface AICoachChatProps {
  courseTitle: string
  courseDescription?: string
  courseCategory: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AICoachChat({ courseTitle, courseDescription, courseCategory }: AICoachChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [welcomed, setWelcomed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Show welcome message on first open
  useEffect(() => {
    if (open && !welcomed) {
      setWelcomed(true)
      setMessages([
        {
          role: 'assistant',
          content: `👋 Hi! I'm your AI coach for **${courseTitle}**. Ask me anything about ${courseCategory}!`,
          timestamp: new Date(),
        },
      ])
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open, welcomed, courseTitle, courseCategory])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }])
    setLoading(true)

    const history = messages.map(m => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, courseTitle, courseDescription, courseCategory, history }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, timestamp: new Date() }])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble right now. Please try again.", timestamp: new Date() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Render bold markdown-style (**text**)
  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  const userMessageCount = messages.filter(m => m.role === 'user').length

  return (
    <>
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="w-96 h-[32rem] flex flex-col rounded-2xl border border-indigo-500/20 bg-[#030712]/90 backdrop-blur-xl shadow-2xl overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(99,102,241,0.12), 0 25px 50px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.08)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/15 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white leading-none">AI Learning Coach</p>
                    <p className="text-[11px] text-indigo-300/70 mt-0.5 truncate max-w-[200px]">
                      Ask me about {courseTitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-indigo-500/20">
                <AnimatePresence initial={false}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar for assistant */}
                      {msg.role === 'assistant' && (
                        <div className="flex items-end shrink-0">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                            <Bot className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      )}

                      <div className={`flex flex-col gap-1 max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div
                          className={
                            msg.role === 'user'
                              ? 'px-3 py-2 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-md'
                              : 'px-3 py-2 rounded-2xl rounded-tl-sm text-sm text-gray-100 leading-relaxed bg-white/[0.06] border border-white/[0.08]'
                          }
                        >
                          {renderContent(msg.content)}
                        </div>
                        <span className="text-[10px] text-gray-600 px-1">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing indicator */}
                  {loading && (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex gap-2"
                    >
                      <div className="flex items-end shrink-0">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div className="px-3 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08] flex gap-1 items-center">
                        {[0, 1, 2].map(dot => (
                          <motion.div
                            key={dot}
                            className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={{
                              duration: 0.9,
                              repeat: Infinity,
                              delay: dot * 0.15,
                            }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="shrink-0 px-3 py-3 border-t border-indigo-500/15 bg-[#030712]/60">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask about ${courseCategory}...`}
                    disabled={loading}
                    className="flex-1 min-w-0 h-9 px-3 py-1.5 rounded-xl text-sm text-white placeholder-gray-500 bg-white/[0.05] border border-white/[0.08] outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 disabled:opacity-50 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || loading}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md hover:from-indigo-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB button */}
        <div className="relative">
          {/* Pulsing ring when closed */}
          {!open && (
            <motion.div
              className="absolute inset-0 rounded-full bg-indigo-500/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          <button
            onClick={() => setOpen(o => !o)}
            className="relative h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:from-indigo-400 hover:to-purple-500 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{
              boxShadow: '0 0 20px rgba(99,102,241,0.4), 0 8px 24px rgba(0,0,0,0.4)',
            }}
            aria-label="Open AI Coach"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Message count badge */}
          {userMessageCount > 0 && !open && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 border-2 border-[#030712] flex items-center justify-center"
            >
              <span className="text-[10px] font-bold text-white leading-none">
                {userMessageCount > 9 ? '9+' : userMessageCount}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}
