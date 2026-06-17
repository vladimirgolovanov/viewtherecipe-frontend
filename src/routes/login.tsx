import { createFileRoute, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem('token')) {
        await navigate({ to: '/recipes' })
        return
      }

      window.onTelegramAuth = async (user) => {
        const params = new URLSearchParams(user)

        const urlParams = new URLSearchParams(window.location.search)
        const redirect = urlParams.get('redirect')
        if (redirect) {
          params.set('redirect', redirect)
        }

        const res = await fetch(`/api/auth/telegram?${params}`)

        if (redirect && res.redirected) {
          window.location.href = res.url
          return
        }

        const data = await res.json()
        if (data.token) {
          localStorage.setItem('token', data.token)
          await navigate({ to: '/recipes' })
        }
      }

      const script = document.createElement('script')
      script.src = 'https://telegram.org/js/telegram-widget.js?22'
      script.async = true
      script.setAttribute('data-telegram-login', import.meta.env.VITE_TELEGRAM_BOT_NAME ?? 'savetherecipe_bot')
      script.setAttribute('data-size', 'large')
      script.setAttribute('data-onauth', 'onTelegramAuth(user)')
      script.setAttribute('data-request-access', 'write')
      document.getElementById('telegram-widget')?.appendChild(script)
    }

    init()
  }, [navigate])

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
