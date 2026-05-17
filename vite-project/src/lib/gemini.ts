import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

export type NamingSuggestion = {
  name: string
  reason: string
  category: '天候' | 'お花' | '自然' | '風情'
}

export async function suggestNames(date: string): Promise<NamingSuggestion[]> {
  const d = new Date(date)
  const month = d.getMonth() + 1
  const day = d.getDate()

  const prompt = `
あなたは裏千家の茶道に精通した専門家です。
${month}月${day}日のお稽古で使う茶杓の銘（名付け）を5つ提案してください。

条件：
- 季節感を大切にすること（${month}月の天候・お花・自然・風情を参考にする）
- 裏千家の伝統に沿った和の情緒ある言葉を選ぶこと
- 漢字1〜3文字が理想的（読み仮名もつける）

以下のJSON形式のみで返してください。説明文は不要です：
[
  {
    "name": "銘の名前（漢字）",
    "reason": "この銘を選んだ理由を一文で（${month}月との関連）",
    "category": "天候 または お花 または 自然 または 風情"
  }
]
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()
  const json = text.match(/\[[\s\S]*\]/)
  if (!json) throw new Error('AIの応答を解析できませんでした')
  return JSON.parse(json[0]) as NamingSuggestion[]
}
