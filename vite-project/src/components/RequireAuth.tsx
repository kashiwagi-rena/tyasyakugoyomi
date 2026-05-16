import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])

  if (authStatus === 'configuring') {
    return <p>読み込み中...</p>
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
