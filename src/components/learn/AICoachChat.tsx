'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, Send, Sparkles, X } from 'lucide-react'

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

export function AICoachChat({
  courseTitle,
  courseDescription,
  courseCategory,
}: AICoachChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => inputRef.current?.focus(), 120)
    return () => clearTimeout(timer)
  }, [open])

  const handleToggleOpen = () => {
    const next = !open
    if (next && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `Hi! I'm your AI coach for **${courseTitle}**. Ask me anything about ${courseCategory}!`,
          timestamp: new Date(),
        },
      ])
    }
    setOpen(next)
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMsg, timestamp: new Date() },
    ])
    setLoading(true)

    const history = messages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          courseTitle,
          courseDescription,
          courseCategory,
          history,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, timestamp: new Date() },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again.",
          timestamp: new Date(),
        },
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

  const renderContent = (content: string) => {
    const parts = content.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <strong key={i} className="text-white">
          {part.slice(2, -2)}
        </strong>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-96 h-[30rem] flex flex-col rounded-2xl border border-[#DDE3EC]/15 bg-[#0E1526] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#DDE3EC]/10 bg-[#121A2E] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2563EB] shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-none">AI Learning Coach</p>
                <p className="font-mono text-[10px] text-[#7F97C7] mt-1 truncate">
                  {courseCategory} · Scoped Assistant
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI Coach"
              className="flex items-center justify-center w-7 h-7 rounded-lg border border-[#DDE3EC]/15 text-[#8A94A8] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex flex-col gap-1 max-w-[82%] ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={
                      msg.role === 'user'
                        ? 'rounded-xl rounded-br-sm px-3 py-2 text-xs text-white leading-relaxed bg-[#2563EB]'
                        : 'rounded-xl rounded-bl-sm px-3 py-2 text-xs text-[#DDE3EC] leading-relaxed bg-[#121A2E] border border-[#DDE3EC]/10'
                    }
                  >
                    {renderContent(msg.content)}
                  </div>
                  <span className="font-mono text-[10px] text-[#8A94A8]">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="rounded-xl px-3 py-2.5 w-fit border border-[#DDE3EC]/10 bg-[#121A2E] font-mono text-[11px] text-[#AEC6FF]">
                Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 p-3 border-t border-[#DDE3EC]/10 bg-[#080E1D]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${courseCategory}...`}
                disabled={loading}
                className="flex-1 min-w-0 h-9 rounded-full px-3.5 text-xs text-white placeholder-[#8A94A8] bg-[#121A2E] border border-[#DDE3EC]/15 outline-none focus:border-[#3B82F6] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white disabled:opacity-40 shrink-0 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleToggleOpen}
        className="inline-flex h-12 items-center gap-2.5 rounded-full px-5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-2xl border border-[#AEC6FF]/25 transition-colors"
        aria-label="Toggle AI Coach"
      >
        {open ? (
          <>
            <X className="w-4 h-4" />
            <span className="text-xs font-semibold">Close Coach</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold">AI Coach</span>
          </>
        )}
      </button>
    </div>
  )
}
