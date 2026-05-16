import { Amplify } from 'aws-amplify'

const origin = window.location.origin

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [
            import.meta.env.VITE_COGNITO_REDIRECT_SIGN_IN ?? `${origin}/`,
          ],
          redirectSignOut: [
            import.meta.env.VITE_COGNITO_REDIRECT_SIGN_OUT ?? `${origin}/login`,
          ],
          responseType: 'code',
        },
      },
    },
  },
})
