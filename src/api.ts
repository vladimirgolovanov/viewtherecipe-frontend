export interface UserSettings {
  client_id: string
  client_secret: string
}

export interface RecipeSummary {
  id: number
  title: string
  description: string | null
}

export interface RecipeDetail {
  id: number
  title: string
  description: string | null
  source: string | null
}

export interface RecipeCollection {
  totalItems: number
  member: RecipeSummary[]
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token')

  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    throw new ApiError(res.status, `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export const api = {
  recipes: {
    list: () => request<RecipeCollection>('/recipes'),
    get: (id: number) => request<RecipeDetail>(`/recipes/${id}`),
  },
  user: {
    me: () => request<UserSettings>('/me'),
  },
}
