import { useState, useEffect } from 'react'
import { getCalendarEvents, deleteCalendarEvent, type CalendarEvent } from '../lib/googleCalendar'
import { useGoogleCalendar } from '../contexts/GoogleCalendarContext'
import styles from './History.module.css'
import GoogleSignInButton from '../components/GoogleSignInButton'

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
      <main className={styles.container}>
        <h1>過去の名付け</h1>
        <p className={styles.message}>カレンダーに接続すると履歴が表示されます</p>
        <GoogleSignInButton onClick={() => connectCalendar()} label="Googleカレンダーに接続する" />
      </main>
    )
  }

  return (
    <main className={styles.container}>
      <h1>過去の名付け</h1>
      {loading && <p className={styles.message}>読み込み中...</p>}
      {error && <p className={styles.message}>{error}</p>}
      {!loading && records.length === 0 && (
        <p className={styles.message}>まだ名付けが登録されていません</p>
      )}
      <ul className={styles.list}>
        {records.map((r) => (
          <li key={r.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <span className={styles.date}>
                {new Date(r.date).toLocaleDateString('ja-JP', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
              <strong className={styles.name}>{r.name}</strong>
            </div>
            <p className={styles.reason}>{r.reason}</p>
            <button className={styles.deleteButton} onClick={() => handleDelete(r.id)}>
              削除
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
