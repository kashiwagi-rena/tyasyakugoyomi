import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { suggestNames, type NamingSuggestion } from '../lib/gemini'
import { createCalendarEvent } from '../lib/googleCalendar'
import { useGoogleCalendar } from '../contexts/GoogleCalendarContext'

const CATEGORY_EMOJI: Record<string, string> = {
  天候: '🌤',
  お花: '🌸',
  自然: '🍃',
  風情: '🎋',
}

export default function Naming() {
  const { date } = useParams<{ date: string }>()
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
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <main>
      <h1>名付け</h1>
      <p>{formattedDate}</p>

      {!accessToken && (
        <button onClick={() => connectCalendar()}>
          Googleカレンダーに接続する
        </button>
      )}

      {accessToken && (
        <button onClick={handleSuggest} disabled={loading}>
          {loading ? 'AIが考えています...' : 'AIに季節の名前を提案してもらう'}
        </button>
      )}

      {error && <p>{error}</p>}

      {suggestions.length > 0 && (
        <section>
          <h2>提案された銘</h2>
          <ul>
            {suggestions.map((s) => (
              <li
                key={s.name}
                onClick={() => setSelected(s)}
                style={{
                  cursor: 'pointer',
                  fontWeight: selected?.name === s.name ? 'bold' : 'normal',
                  border: selected?.name === s.name ? '2px solid #333' : '1px solid #ccc',
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '8px',
                }}
              >
                <span>{CATEGORY_EMOJI[s.category]} </span>
                <strong>{s.name}</strong>
                <span>（{s.category}）</span>
                <p style={{ margin: '4px 0 0', fontSize: '0.9em' }}>{s.reason}</p>
              </li>
            ))}
          </ul>

          {selected && !saved && (
            <button onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : `「${selected.name}」をカレンダーに保存する`}
            </button>
          )}

          {saved && (
            <div>
              <p>「{selected?.name}」をGoogleカレンダーに保存しました</p>
              <button onClick={() => navigate('/history')}>過去の名付けを見る</button>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
