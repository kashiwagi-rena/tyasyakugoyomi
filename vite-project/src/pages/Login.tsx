import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'

export default function Login() {
  const { authStatus } = useAuthenticator((context) => [context.authStatus])
  const navigate = useNavigate()

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/', { replace: true })
    }
  }, [authStatus, navigate])

  return (
    <main>
      <h1>茶杓暦にログイン</h1>
      <Authenticator socialProviders={['google']} />
    </main>
  )
}
