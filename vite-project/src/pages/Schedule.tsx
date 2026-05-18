import { useState } from 'react'
import { useNavigate } from 'react-router'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ja } from 'date-fns/locale/ja'
import { format } from 'date-fns'
import 'react-datepicker/dist/react-datepicker.css'
import styles from './Schedule.module.css'

registerLocale('ja', ja)

export default function Schedule() {
  const [date, setDate] = useState<Date | null>(null)
  const [startTime, setStartTime] = useState('10:00')
  const [endTime, setEndTime] = useState('12:00')
  const navigate = useNavigate()

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date) return
    const formatted = format(date, 'yyyy-MM-dd')
    navigate(`/naming/${formatted}?start=${startTime}&end=${endTime}`)
  }

  return (
    <main className={styles.container}>
      <h1>お稽古日の登録</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.label}>
          お稽古日
          <DatePicker
            locale="ja"
            selected={date}
            onChange={(d: Date | null) => setDate(d)}
            dateFormat="yyyy年M月d日"
            placeholderText="日付を選択"
            required
            calendarClassName={styles.calendar}
            wrapperClassName={styles.datepickerWrapper}
          />
        </div>
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
