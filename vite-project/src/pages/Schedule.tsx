import { useState } from 'react'
import { useNavigate } from 'react-router'

export default function Schedule() {
  const [date, setDate] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!date) return
    navigate(`/naming/${date}`)
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
        <button type="submit">この日の名付けへ</button>
      </form>
    </main>
  )
}
