import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { api } from '../api'

const recipesQuery = queryOptions({
  queryKey: ['recipes'],
  queryFn: api.recipes.list,
})

export const Route = createFileRoute('/recipes/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(recipesQuery),
  component: RecipesPage,
})

function RecipesPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError } = useQuery(recipesQuery)

  async function logout() {
    await api.auth.logout()
    navigate({ to: '/login' })
  }

  if (isLoading) return <Spinner />
  if (isError) return <ErrorState />

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Мои рецепты</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/settings"
            className="text-sm text-gray-500 hover:text-gray-700 transition"
          >
            Настройки
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
        {data?.member.length === 0 ? (
          <p className="text-center text-gray-400 mt-16">Рецептов пока нет</p>
        ) : (
          <ul className="space-y-3">
            {data?.member.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  to="/recipes/$id"
                  params={{ id: String(recipe.id) }}
                  className="block bg-white rounded-xl shadow-sm px-6 py-4 hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-800">{recipe.title}</p>
                  {recipe.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
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
      <p className="text-gray-500">Не удалось загрузить рецепты</p>
    </div>
  )
}
