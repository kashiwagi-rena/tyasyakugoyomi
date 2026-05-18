import { useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { suggestNames, type NamingSuggestion } from '../lib/gemini'
import { createCalendarEvent } from '../lib/googleCalendar'
import { useGoogleCalendar } from '../contexts/GoogleCalendarContext'
import GoogleSignInButton from '../components/GoogleSignInButton'
import styles from './Naming.module.css'

const CATEGORY_EMOJI: Record<string, string> = {
  天候: '🌤',
  お花: '🌸',
  自然: '🍃',
  風情: '🎋',
}

export default function Naming() {
  const { date } = useParams<{ date: string }>()
  const [searchParams] = useSearchParams()
  const startTime = searchParams.get('start') ?? '10:00'
  const endTime = searchParams.get('end') ?? '12:00'
  const navigate = useNavigate()
  const { accessToken, connectCalendar } = useGoogleCalendar()
  const [suggestions, setSuggestions] = useState<NamingSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<NamingSuggestion | null>(null)
  const [saved, setSaved] = useState(false)

  const handleSuggest = async () => {
    if (!date) return
    setLoading(true)
    setError(null)
    setSelected(null)
    setSaved(false)
    try {
      const result = await suggestNames(date)
      setSuggestions(result)
    } catch {
      setError('AIの提案取得に失敗しました。もう一度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!date || !selected || !accessToken) return
    setSaving(true)
    setError(null)
    try {
      await createCalendarEvent(accessToken, date, selected.name, selected.reason)
      setSaved(true)
    } catch {
      setError('カレンダーへの保存に失敗しました。もう一度お試しください。')
    } finally {
      setSaving(false)
    }
  }

  const formattedDate = date
    ? new Date(date).toLocaleDateString('ja-JP', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <main className={styles.container}>
      <h1>名付け</h1>
      <p className={styles.date}>{formattedDate}　{startTime} 〜 {endTime}</p>

      {!accessToken && (
        <div className={styles.connectArea}>
          <p className={styles.connectNote}>名付けをカレンダーに保存するために接続してください</p>
          <GoogleSignInButton onClick={() => connectCalendar()} label="Googleカレンダーに接続" />
        </div>
      )}

      {accessToken && (
        <button className={styles.suggestButton} onClick={handleSuggest} disabled={loading}>
          {loading ? 'AIが考えています...' : 'AIに季節の名前を提案してもらう'}
        </button>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {suggestions.length > 0 && (
        <section className={styles.section}>
          <h2>提案された銘</h2>
          <ul className={styles.list}>
            {suggestions.map((s) => (
              <li
                key={s.name}
                onClick={() => setSelected(s)}
                className={`${styles.card} ${selected?.name === s.name ? styles.cardSelected : ''}`}
              >
                <div className={styles.cardHeader}>
                  <span>{CATEGORY_EMOJI[s.category]}</span>
                  <strong className={styles.cardName}>
                    <ruby>{s.name}<rt>{s.reading}</rt></ruby>
                  </strong>
                  <span className={styles.cardCategory}>（{s.category}）</span>
                </div>
                <p className={styles.cardReason}>{s.reason}</p>
              </li>
            ))}
          </ul>

          {selected && !saved && (
            <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : (
                <>「<ruby>{selected.name}<rt>{selected.reading}</rt></ruby>」をカレンダーに保存する</>
              )}
            </button>
          )}

          {saved && (
            <div className={styles.savedBox}>
              <p className={styles.savedText}>「<ruby>{selected?.name}<rt>{selected?.reading}</rt></ruby>」をGoogleカレンダーに保存しました</p>
              <button className={styles.historyButton} onClick={() => navigate('/history')}>過去の名付けを見る</button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
