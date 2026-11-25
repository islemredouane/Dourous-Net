'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { toast } from 'sonner'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

interface PwaContextValue {
  readonly canInstall: boolean
  readonly isIOS: boolean
  readonly isStandalone: boolean
  readonly promptInstall: () => Promise<void>
}

const PwaContext = createContext<PwaContextValue>({
  canInstall: false,
  isIOS: false,
  isStandalone: false,
  promptInstall: async () => {},
})

export function usePwaInstall() {
  return useContext(PwaContext)
}

const emptySubscribe = () => () => {}

function getIsStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true
  )
}

function getIsIOS(): boolean {
  if (typeof window === 'undefined') return false
  const win = window as Window & { MSStream?: unknown }
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !win.MSStream
}

export function PwaProvider({ children }: { readonly children: React.ReactNode }) {
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [hasDeferredPrompt, setHasDeferredPrompt] = useState(false)
  const [installedNow, setInstalledNow] = useState(false)

  const standaloneInitial = useSyncExternalStore(
    emptySubscribe,
    getIsStandalone,
    () => false,
  )
  const isIOS = useSyncExternalStore(emptySubscribe, getIsIOS, () => false)
  const isStandalone = standaloneInitial || installedNow

  useEffect(() => {
    document.documentElement.dataset.standalone = isStandalone ? 'true' : 'false'
  }, [isStandalone])

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      deferredPromptRef.current = e as BeforeInstallPromptEvent
      setHasDeferredPrompt(true)
    }

    const onAppInstalled = () => {
      deferredPromptRef.current = null
      setHasDeferredPrompt(false)
      setInstalledNow(true)
      toast.success('Dourous-Net installed on your device.')
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onAppInstalled)

    const onOffline = () => {
      toast('You are offline', {
        description: 'Reconnect anytime to sync progress and stream videos.',
      })
    }
    const onOnline = () => {
      toast.success('Back online')
    }

    window.addEventListener('offline', onOffline)
    window.addEventListener('online', onOnline)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onAppInstalled)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('online', onOnline)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    let refreshing = false
    const onControllerChange = () => {
      if (refreshing) return
      refreshing = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing
          if (!installing) return
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              toast('A new version of Dourous-Net is ready', {
                action: {
                  label: 'Reload',
                  onClick: () =>
                    installing.postMessage({ type: 'SKIP_WAITING' }),
                },
                duration: 10000,
              })
            }
          })
        })
      })
      .catch(() => {
        // Silent registration failure in restricted environments (e.g. private iframes)
      })

    return () => {
      navigator.serviceWorker.removeEventListener(
        'controllerchange',
        onControllerChange,
      )
    }
  }, [])

  const promptInstall = useCallback(async () => {
    const promptEvent = deferredPromptRef.current
    if (promptEvent) {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      if (choice.outcome === 'accepted') {
        deferredPromptRef.current = null
        setHasDeferredPrompt(false)
      }
      return
    }

    if (isIOS) {
      toast('Install Dourous-Net on iOS', {
        description: 'Tap the Share button in Safari, then choose "Add to Home Screen".',
        duration: 8000,
      })
    }
  }, [isIOS])

  return (
    <PwaContext.Provider
      value={{
        canInstall: hasDeferredPrompt,
        isIOS,
        isStandalone,
        promptInstall,
      }}
    >
      {children}
    </PwaContext.Provider>
  )
}
