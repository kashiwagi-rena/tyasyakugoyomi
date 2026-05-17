import { useState, useEffect } from 'react'
import { getCalendarEvents, deleteCalendarEvent, type CalendarEvent } from '../lib/googleCalendar'
import { useGoogleCalendar } from '../contexts/GoogleCalendarContext'

export default function History() {
  const { accessToken, connectCalendar } = useGoogleCalendar()
  const [records, setRecords] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    getCalendarEvents(accessToken)
      .then(setRecords)
      .catch(() => setError('カレンダーの取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [accessToken])

  const handleDelete = async (eventId: string) => {
    if (!accessToken) return
    try {
      await deleteCalendarEvent(accessToken, eventId)
      setRecords((prev) => prev.filter((r) => r.id !== eventId))
    } catch {
      setError('削除に失敗しました')
    }
  }

  if (!accessToken) {
    return (
      <main>
        <h1>過去の名付け</h1>
        <p>カレンダーに接続すると履歴が表示されます</p>
        <button onClick={() => connectCalendar()}>Googleカレンダーに接続する</button>
      </main>
    )
  }

  return (
    <main>
      <h1>過去の名付け</h1>
      {loading && <p>読み込み中...</p>}
      {error && <p>{error}</p>}
      {!loading && records.length === 0 && <p>まだ名付けが登録されていません</p>}
      <ul>
        {records.map((r) => (
          <li key={r.id}>
            <span>
              {new Date(r.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
            <strong>　{r.name}</strong>
            <p style={{ fontSize: '0.9em', margin: '4px 0' }}>{r.reason}</p>
            <button onClick={() => handleDelete(r.id)}>削除</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
