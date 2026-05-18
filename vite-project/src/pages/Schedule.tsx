import { useState } from 'react'
import { useNavigate } from 'react-router'
import styles from './Schedule.module.css'

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
    <main className={styles.container}>
      <h1>お稽古日の登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>
          お稽古日
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          開始時間
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label className={styles.label}>
          終了時間
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <button className={styles.button} type="submit">この日の名付けへ</button>
      </form>
    </main>
  )
}
