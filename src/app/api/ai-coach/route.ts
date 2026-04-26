import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, courseTitle, courseDescription, courseCategory, history = [] } = await request.json()

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: 'AI Coach is not configured. Add GEMINI_API_KEY to environment variables.' })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

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

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    })

    // Build chat history (Gemini format: role is 'user' | 'model')
    const recentHistory = history.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history: recentHistory })
    const result = await chat.sendMessage(message)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Coach error:', error)
    return NextResponse.json(
      { reply: "Sorry, I'm having trouble right now. Please try again in a moment." },
      { status: 200 },
    )
  }
}
