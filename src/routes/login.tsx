import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

declare global {
  interface Window {
    onTelegramAuth: (user: Record<string, string>) => void
  }
}

function LoginPage() {
  useEffect(() => {
    window.onTelegramAuth = async (user) => {
      const params = new URLSearchParams(user)

      const redirect = new URLSearchParams(window.location.search).get('redirect')
      console.log('redirect from URL:', redirect)
      console.log('params before fetch:', params.toString())

      const safeRedirect = redirect && (
          redirect.startsWith('/') ||
          redirect.startsWith('https://savetherecipe.golovanov.me')
      ) ? redirect : null

      if (safeRedirect) {
        params.set('redirect', safeRedirect)
      }

      window.location.href = `/api/auth/telegram?${params}`
    }

    const script = document.createElement('script')
    script.src = 'https://telegram.org/js/telegram-widget.js?22'
    script.async = true
    script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_NAME ?? 'savetherecipe_bot')
    script.setAttribute('data-size', 'large')
    script.setAttribute('data-onauth', 'onTelegramAuth(user)')
    script.setAttribute('data-request-access', 'write')
    document.getElementById('telegram-widget')?.appendChild(script)
  }, [])

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center gap-6 w-full max-w-sm">
          <h1 className="text-2xl font-bold text-gray-800">ViewTheRecipe</h1>
          <p className="text-gray-500 text-sm text-center">
            Войдите через Telegram, чтобы увидеть свои рецепты
          </p>
          <div id="telegram-widget" />
        </div>
      </div>
  )
}
