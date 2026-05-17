const CALENDAR_API = 'https://www.googleapis.com/calendar/v3'
const APP_TAG = 'tyasyakugoyomi'

export type CalendarEvent = {
  id: string
  date: string
  name: string
  reason: string
}

export async function createCalendarEvent(
  accessToken: string,
  date: string,
  name: string,
  reason: string
): Promise<void> {
  const event = {
    summary: `お稽古 茶杓「${name}」`,
    description: `${reason}\n\n#${APP_TAG}`,
    start: { date },
    end: { date },
  }

  const res = await fetch(`${CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

  if (!res.ok) throw new Error('カレンダーへの保存に失敗しました')
}

export async function getCalendarEvents(
  accessToken: string
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    q: APP_TAG,
    orderBy: 'startTime',
    singleEvents: 'true',
    maxResults: '50',
  })

  const res = await fetch(
    `${CALENDAR_API}/calendars/primary/events?${params}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  if (!res.ok) throw new Error('カレンダーの取得に失敗しました')

  const data = await res.json()
  return (data.items ?? []).map((item: any) => ({
    id: item.id,
    date: item.start.date,
    name: item.summary.replace('お稽古 茶杓「', '').replace('」', ''),
    reason: item.description?.split('\n\n#')[0] ?? '',
  }))
}

export async function deleteCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const res = await fetch(
    `${CALENDAR_API}/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )

  if (!res.ok) throw new Error('カレンダーイベントの削除に失敗しました')
}
