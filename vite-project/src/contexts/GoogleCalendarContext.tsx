import { createContext, useContext, useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'

type GoogleCalendarContextType = {
  accessToken: string | null
  connectCalendar: () => void
}

const GoogleCalendarContext = createContext<GoogleCalendarContextType>({
  accessToken: null,
  connectCalendar: () => {},
})

export function GoogleCalendarProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [accessToken, setAccessToken] = useState<string | null>(
    sessionStorage.getItem('google_calendar_token')
  )

  const connectCalendar = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar',
    onSuccess: (res) => {
      sessionStorage.setItem('google_calendar_token', res.access_token)
      setAccessToken(res.access_token)
    },
  })

  return (
    <GoogleCalendarContext.Provider value={{ accessToken, connectCalendar }}>
      {children}
    </GoogleCalendarContext.Provider>
  )
}

export function useGoogleCalendar() {
  return useContext(GoogleCalendarContext)
}
