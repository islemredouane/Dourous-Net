import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'qwen/qwen3.8-27b',
] as const

function sanitizeReply(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
}

function buildDemoCoachReply(
  message: string,
  courseTitle: string,
  courseCategory: string,
  courseDescription?: string,
): string {
  const snippet = courseDescription
    ? courseDescription.slice(0, 140)
    : `core concepts in ${courseCategory}`

  return [
    `Here is a structured walkthrough for **${courseTitle}** (${courseCategory}):`,
    `1. **Core Focus:** Your question connects directly to ${snippet}...`,
    `2. **Approach:** Break "${message.slice(0, 80)}" into inputs, invariants, and concrete edge cases from the lesson video.`,
    `3. **Next Step:** Review the highlighted section in the lesson player and test your intuition using the course quiz.`,
  ].join('\n\n')
}

export async function POST(request: NextRequest) {
  let payload: {
    message?: string
    courseTitle?: string
    courseDescription?: string
    courseCategory?: string
    history?: Array<{ role: string; content: string }>
  } = {}

  try {
    payload = await request.json()
    const {
      message = '',
      courseTitle = 'Dourous-Net Course',
      courseDescription,
      courseCategory = 'General',
      history = [],
    } = payload

    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      return NextResponse.json({ reply: 'Ask me any question about this course to get started!' })
    }

    const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, '')
    if (!apiKey) {
      return NextResponse.json({
        reply: buildDemoCoachReply(
          trimmedMessage,
          courseTitle,
          courseCategory,
          courseDescription,
        ),
      })
    }

    const groq = new Groq({ apiKey })

    const systemPrompt = `You are an expert AI learning coach for the course "${courseTitle}" on Dourous-Net, an Algerian educational platform.

Course details:
- Category: ${courseCategory}
- Description: ${courseDescription ?? 'No description provided.'}

Your role:
- Answer ONLY questions related to this course and its subject matter (${courseCategory})
- Explain concepts clearly and pedagogically, using analogies and concrete examples
- Be encouraging and supportive — many students are Algerian learners
- Keep responses concise (under 220 words) unless a detailed explanation is truly needed
- Format emphasis with simple **bold** labels and numbered points or plain bullet text; avoid raw LaTeX $ delimiters so explanations read cleanly inside plain chat cards
- If asked about topics completely unrelated to ${courseCategory}, politely redirect: "I'm specialized in ${courseCategory} for this course. Ask me anything about ${courseTitle}!"

You are NOT a general assistant. You exclusively help students understand this course's material.`

    const recentHistory = history
      .slice(-10)
      .map((m) => ({
        role: (m.role === 'assistant' || m.role === 'model'
          ? 'assistant'
          : 'user') as 'user' | 'assistant',
        content: m.content,
      }))

    for (const model of GROQ_MODELS) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...recentHistory,
            { role: 'user', content: trimmedMessage },
          ],
          max_tokens: 900,
          temperature: 0.7,
        })

        const rawContent = completion.choices[0]?.message?.content ?? ''
        const reply = sanitizeReply(rawContent)
        if (reply.length > 0) {
          return NextResponse.json({ reply })
        }
      } catch {
        // Try next available Groq model in fallback chain
      }
    }

    return NextResponse.json({
      reply: buildDemoCoachReply(
        trimmedMessage,
        courseTitle,
        courseCategory,
        courseDescription,
      ),
    })
  } catch {
    return NextResponse.json(
      {
        reply: buildDemoCoachReply(
          payload.message ?? 'this concept',
          payload.courseTitle ?? 'Dourous-Net Course',
          payload.courseCategory ?? 'General',
          payload.courseDescription,
        ),
      },
      { status: 200 },
    )
  }
}
