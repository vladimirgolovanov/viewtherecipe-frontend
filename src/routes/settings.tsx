import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../api'

const meQuery = queryOptions({
  queryKey: ['user', 'me'],
  queryFn: api.user.me,
})

export const Route = createFileRoute('/settings')({
  beforeLoad: () => {
    if (!localStorage.getItem('token')) {
      throw redirect({ to: '/login' })
    }
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(meQuery),
  component: SettingsPage,
})

function SettingsPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery(meQuery)
  const [copied, setCopied] = useState(false)

  function logout() {
    localStorage.removeItem('token')
    navigate({ to: '/login' })
  }

  async function copyConfig() {
    if (!data) return
    await navigator.clipboard.writeText(JSON.stringify(data.mcp_config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState />

  const configJson = JSON.stringify(data!.mcp_config, null, 2)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Настройки</h1>
        <div className="flex items-center gap-4">
          <Link to="/recipes" className="text-sm text-gray-500 hover:text-gray-700 transition">
            Рецепты
          </Link>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-xl shadow-sm px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Подключение к Claude Desktop
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Добавьте этот конфиг в файл настроек Claude Desktop, чтобы подключить MCP-сервер с вашими рецептами.
          </p>

          <ol className="text-sm text-gray-600 space-y-1 mb-5 list-decimal list-inside">
            <li>
              Откройте{' '}
              <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                claude_desktop_config.json
              </span>{' '}
              — в Claude Desktop:{' '}
              <span className="italic">Настройки → Developer → Edit Config</span>
            </li>
            <li>Вставьте JSON ниже (объедините с существующим содержимым файла, если оно есть)</li>
            <li>Перезапустите Claude Desktop</li>
          </ol>

          <div className="relative">
            <pre className="bg-gray-900 text-green-300 text-xs rounded-lg px-4 py-4 overflow-x-auto leading-relaxed">
              {configJson}
            </pre>
            <button
              onClick={copyConfig}
              className="absolute top-2 right-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition"
            >
              {copied ? 'Скопировано!' : 'Скопировать'}
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">API токен</h2>
          <p className="text-sm text-gray-500 mb-2">
            Используйте этот токен для прямых запросов к API.
          </p>
          <code className="block bg-gray-100 text-gray-800 text-xs rounded-lg px-4 py-3 break-all font-mono">
            {data!.api_token}
          </code>
        </section>
      </main>
    </div>
  )
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ErrorState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Не удалось загрузить настройки</p>
    </div>
  )
}
