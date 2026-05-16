import { useParams } from 'react-router'

export default function Naming() {
  const { date } = useParams()

  return (
    <main>
      <h1>名付け</h1>
      <p>日付：{date}</p>
      <p>（AIによる季節名の提案・写真が表示される画面です）</p>
    </main>
  )
}
