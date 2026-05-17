import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function Schedule() {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('12:00')
  const navigate = useNavigate()

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date) return
    navigate(`/naming/${date}?start=${startTime}&end=${endTime}`)
  }

  return (
    <main>
      <h1>お稽古日の登録</h1>
      <form onSubmit={handleSubmit}>
        <label>
          お稽古日
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          開始時間
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          終了時間
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <button type="submit">この日の名付けへ</button>
      </form>
    </main>
  )
}
