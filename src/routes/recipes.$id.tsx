import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, queryOptions } from '@tanstack/react-query'
import { api } from '../api'

const recipeQuery = (id: number) =>
  queryOptions({
    queryKey: ['recipes', id],
    queryFn: () => api.recipes.get(id),
  })

export const Route = createFileRoute('/recipes/$id')({
  loader: ({ context: { queryClient }, params }) =>
    queryClient.ensureQueryData(recipeQuery(Number(params.id))),
  component: RecipeDetailPage,
  errorComponent: RecipeError,
})

function RecipeDetailPage() {
  const { id } = Route.useParams()
  const { data, isLoading } = useQuery(recipeQuery(Number(id)))

  if (isLoading) return <Spinner />

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/recipes" className="text-gray-500 hover:text-gray-700 transition">
          ← Назад
        </Link>
        <h1 className="text-xl font-bold text-gray-800">{data?.title}</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm px-6 py-6 space-y-4">
          {data?.description ? (
            <p className="text-gray-700 whitespace-pre-wrap">{data.description}</p>
          ) : (
            <p className="text-gray-400 italic">Описание отсутствует</p>
          )}
          {data?.source && (
            <a
              href={data.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-blue-500 hover:underline break-all"
            >
              {data.source}
            </a>
          )}
        </div>
      </main>
    </div>
  )
}

function RecipeError({ error }: { error: unknown }) {
  const status = (error as { status?: number })?.status

  if (status === 404) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Рецепт не найден</p>
        <Link to="/recipes" className="text-blue-500 hover:underline">
          К списку рецептов
        </Link>
      </div>
    )
  }

  if (status === 403) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600 text-lg">Нет доступа к этому рецепту</p>
        <Link to="/recipes" className="text-blue-500 hover:underline">
          К списку рецептов
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Что-то пошло не так</p>
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
