import { NavLink } from 'react-router'

export default function Navigation() {
  return (
    <nav>
      <NavLink to="/">ホーム</NavLink>
      <NavLink to="/schedule">お稽古日登録</NavLink>
      <NavLink to="/history">過去の名付け</NavLink>
    </nav>
  )
}
