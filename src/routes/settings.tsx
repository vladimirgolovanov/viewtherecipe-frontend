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

const MCP_NAME = 'Save The Recipe'
const MCP_URL = 'https://savetherecipe.golovanov.me/mcp'

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <div className="relative">
        <code className="block bg-gray-100 text-gray-800 text-xs rounded-lg px-4 py-3 pr-24 break-all font-mono">
          {value}
        </code>
        <button
          onClick={copy}
          className="absolute top-1/2 -translate-y-1/2 right-2 text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1 rounded transition"
        >
          {copied ? 'Скопировано!' : 'Скопировать'}
        </button>
      </div>
    </div>
  )
}

function SettingsPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery(meQuery)

  function logout() {
    localStorage.removeItem('token')
    navigate({ to: '/login' })
  }

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState />

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <section className="bg-white rounded-xl shadow-sm px-6 py-5 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Подключение Remote MCP
            </h2>
            <p className="text-sm text-gray-500">
              Используйте эти данные для подключения MCP-сервера в Claude.ai.
            </p>
          </div>
          <CopyField label="Name" value={MCP_NAME} />
          <CopyField label="Remote MCP server URL" value={MCP_URL} />
          <CopyField label="OAuth Client ID" value={data!.client_id} />
          <CopyField label="OAuth Client Secret" value={data!.client_secret} />
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
