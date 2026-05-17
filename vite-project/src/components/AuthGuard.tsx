import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

// 未ログインのユーザーをログイン画面へ誘導するガード
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <p>読み込み中...</p>
  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
