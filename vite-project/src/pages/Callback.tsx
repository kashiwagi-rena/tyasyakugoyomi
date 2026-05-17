import { useEffect } from 'react'
import { useNavigate } from 'react-router'

// Cognitoのログイン後にリダイレクトされるページ
// AmplifyがURLのcodeパラメータを処理してトークンを取得する
export default function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/', { replace: true })
  }, [navigate])

  return <p>ログイン中...</p>
}
