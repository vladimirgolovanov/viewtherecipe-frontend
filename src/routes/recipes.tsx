import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { meQuery } from '../api'

export const Route = createFileRoute('/recipes')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const me = await queryClient.fetchQuery(meQuery).catch(() => null)
    if (!me) throw redirect({ to: '/login' })
  },
  component: () => <Outlet />,
})
