import { useEffect, useState } from 'react'
import { getCurrentUser, signInWithRedirect, signOut } from 'aws-amplify/auth'

type User = { username: string; email?: string } | null

export function useAuth() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((u) => setUser({ username: u.username }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = () => signInWithRedirect({ provider: 'Google' })
  const logout = () => signOut()

  return { user, loading, login, logout }
}
