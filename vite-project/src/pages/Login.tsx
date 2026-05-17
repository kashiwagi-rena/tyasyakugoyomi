import { useAuth } from '../hooks/useAuth'
import styles from './Login.module.css'

const features = [
  { icon: '📅', label: 'お稽古日を\n登録' },
  { icon: '✨', label: 'AIが名付けを\n提案' },
  { icon: '🌸', label: '季節の写真を\n確認' },
  { icon: '📆', label: 'Google\nカレンダーと連携' },
]

export default function Login() {
  const { login } = useAuth()

  return (
    <div className={styles.container}>
      <div className={styles.topDecor}>
        <span className={styles.sakura}>🌸</span>
        <span className={styles.sakura2}>🌸</span>
      </div>

      <div className={styles.hero}>
        <img
          src="/chaशaku.png"
          alt=""
          className={styles.heroImg}
          onError={(e) => (e.currentTarget.style.display = 'none')}
        />
      </div>

      <div className={styles.content}>
        <p className={styles.catchcopy}>茶杓の名付けを、もっと身近に</p>
        <h1 className={styles.title}>名付け</h1>
        <p className={styles.subtitle}>
          季節を感じ、心をこめて。<br />
          AIが提案する今日の一名
        </p>
      </div>

      <div className={styles.features}>
        {features.map((f) => (
          <div key={f.label} className={styles.feature}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <span className={styles.featureLabel}>{f.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.buttons}>
        <button className={styles.primaryButton} onClick={login}>
          はじめる
        </button>
        <button className={styles.secondaryButton} onClick={login}>
          ログイン
        </button>
      </div>

      <div className={styles.bottomDecor}>
        <span className={styles.flower}>🌿</span>
      </div>
    </div>
  )
}
