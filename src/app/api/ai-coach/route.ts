import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  try {
    const { message, courseTitle, courseDescription, courseCategory, history = [] } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ reply: "AI Coach is not configured. Add ANTHROPIC_API_KEY to environment variables." })
    }

    const systemPrompt = `You are an expert AI learning coach for the course "${courseTitle}" on Dourous-Net, an Algerian educational platform.

Course details:
- Category: ${courseCategory}
- Description: ${courseDescription}

Your role:
- Answer ONLY questions related to this course and its subject matter (${courseCategory})
- Explain concepts clearly and pedagogically, using analogies and examples
- Be encouraging and supportive — many students are Algerian learners
- Keep responses concise (under 250 words) unless a detailed explanation is truly needed
- Use numbered lists or bullet points for clarity when appropriate
- If asked about topics completely unrelated to ${courseCategory}, politely redirect: "I'm specialized in ${courseCategory} for this course. Ask me anything about ${courseTitle}!"

You are NOT a general assistant. You exclusively help students understand this course's material.`

    // Keep last 10 messages of history for context
    const recentHistory = history.slice(-10)

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 512,
      system: systemPrompt,
      messages: [
        ...recentHistory,
        { role: 'user', content: message }
      ]
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI Coach error:', error)
    return NextResponse.json({ reply: "Sorry, I'm having trouble right now. Please try again in a moment." }, { status: 200 })
  }
}
