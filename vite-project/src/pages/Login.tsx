import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login } = useAuth()

  return (
    <main>
      <h1>茶杓暦</h1>
      <p>裏千家お稽古の茶杓名付け管理アプリ</p>
      <button onClick={login}>Googleでログイン</button>
    </main>
  )
}
