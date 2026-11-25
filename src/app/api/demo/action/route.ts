import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import {
  applyMutationToDb,
  getServerDemoDb,
  resetServerDemoDb,
} from '@/lib/demo/store'
import type { DemoDatabase } from '@/lib/demo/seed'

type DemoTableName = keyof Omit<DemoDatabase, 'version' | 'createdAt'>

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    let sid = cookieStore.get('dourous_demo_sid')?.value
    if (!sid) {
      sid = crypto.randomUUID()
    }

    if (body.op === 'switchRole') {
      const role = body.role as 'student' | 'teacher' | 'guest'
      const res = NextResponse.json({ ok: true, role, sid })
      res.cookies.set('dourous_demo_sid', sid, {
        path: '/',
        maxAge: 86_400,
        sameSite: 'lax',
      })
      if (role === 'student' || role === 'teacher') {
        res.cookies.set('dourous_demo_role', role, {
          path: '/',
          maxAge: 86_400,
          sameSite: 'lax',
          httpOnly: false,
        })
      } else {
        res.cookies.delete('dourous_demo_role')
      }
      getServerDemoDb(sid)
      return res
    }

    if (body.op === 'reset') {
      resetServerDemoDb(sid)
      const res = NextResponse.json({ ok: true, reset: true })
      res.cookies.set('dourous_demo_sid', sid, {
        path: '/',
        maxAge: 86_400,
        sameSite: 'lax',
      })
      return res
    }

    if (body.op === 'mutate') {
      const db = getServerDemoDb(sid)
      const affected = applyMutationToDb(
        db,
        body.table as DemoTableName,
        body.action,
        body.payload,
        body.filters ?? [],
        body.upsertOptions,
      )
      const res = NextResponse.json({ ok: true, count: affected.length })
      res.cookies.set('dourous_demo_sid', sid, {
        path: '/',
        maxAge: 86_400,
        sameSite: 'lax',
      })
      return res
    }

    return NextResponse.json({ ok: false, error: 'Unsupported op' }, { status: 400 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
