import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, courseTitle, courseDescription, courseCategory, history = [] } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ reply: 'AI Coach is not configured. Add GROQ_API_KEY to environment variables.' })
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const systemPrompt = `You are an expert AI learning coach for the course "${courseTitle}" on Dourous-Net, an Algerian educational platform.

Course details:
- Category: ${courseCategory}
- Description: ${courseDescription ?? 'No description provided.'}

Your role:
- Answer ONLY questions related to this course and its subject matter (${courseCategory})
- Explain concepts clearly and pedagogically, using analogies and examples
- Be encouraging and supportive — many students are Algerian learners
- Keep responses concise (under 250 words) unless a detailed explanation is truly needed
- Use numbered lists or bullet points for clarity when appropriate
- If asked about topics completely unrelated to ${courseCategory}, politely redirect: "I'm specialized in ${courseCategory} for this course. Ask me anything about ${courseTitle}!"

You are NOT a general assistant. You exclusively help students understand this course's material.`

    const recentHistory = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: (m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: m.content,
    }))

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...recentHistory,
      { role: 'user' as const, content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    })

    const reply = completion.choices[0]?.message?.content ?? "I couldn't generate a response. Please try again."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Coach error:', error)
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble right now. Please try again in a moment." },
      { status: 200 },
    )
  }
}
