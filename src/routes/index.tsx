import { createFileRoute, isRedirect, redirect } from '@tanstack/react-router'
import { meQuery } from '../api'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    try {
      await queryClient.fetchQuery(meQuery)
      throw redirect({ to: '/recipes' })
    } catch (e) {
      if (isRedirect(e)) throw e
      throw redirect({ to: '/login' })
    }
  },
  component: () => null,
})
