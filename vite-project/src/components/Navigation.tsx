import { NavLink } from 'react-router'
import { useAuthenticator } from '@aws-amplify/ui-react'

export default function Navigation() {
  const { signOut } = useAuthenticator((context) => [context.user])

  return (
    <nav>
      <NavLink to="/">ホーム</NavLink>
      <NavLink to="/schedule">お稽古日登録</NavLink>
      <NavLink to="/history">過去の名付け</NavLink>
      <button type="button" onClick={signOut}>
        ログアウト
      </button>
    </nav>
  )
}
