'use client'

import { resetBrowserDemoDb, getBrowserDemoDb } from './store'
import type { DemoRole } from './seed'

export async function switchDemoRole(role: DemoRole | 'guest'): Promise<void> {
  if (typeof document !== 'undefined') {
    if (role === 'student' || role === 'teacher') {
      document.cookie = `dourous_demo_role=${role}; path=/; max-age=86400; SameSite=Lax`
      getBrowserDemoDb()
    } else {
      document.cookie = 'dourous_demo_role=; path=/; max-age=0; SameSite=Lax'
    }
  }

  await fetch('/api/demo/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ op: 'switchRole', role }),
  }).catch(() => {})

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('dourous-demo-auth', {
        detail: { role: role === 'guest' ? null : role },
      }),
    )
  }
}

export async function resetDemoSandbox(): Promise<void> {
  resetBrowserDemoDb()
  await fetch('/api/demo/action', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ op: 'reset' }),
  }).catch(() => {})

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dourous-demo-change'))
  }
}
