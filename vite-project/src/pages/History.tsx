import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { getNamings, deleteNaming, type NamingRecord } from '../lib/namingStorage'

export default function History() {
  const [records, setRecords] = useState<NamingRecord[]>([])

  useEffect(() => {
    setRecords(getNamings())
  }, [])

  const handleDelete = (date: string) => {
    deleteNaming(date)
    setRecords(getNamings())
  }

  return (
    <main>
      <h1>過去の名付け</h1>
      {records.length === 0 ? (
        <p>まだ名付けが登録されていません</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r.date}>
              <span>
                {new Date(r.date).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <strong>　{r.name}</strong>
              <p style={{ fontSize: '0.9em', margin: '4px 0' }}>{r.reason}</p>
              <Link to={`/naming/${r.date}`}>編集</Link>

              <button onClick={() => handleDelete(r.date)}>削除</button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
