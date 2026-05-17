import { useNavigate } from 'react-router'
import imgPc from '../assets/ChatGPT_Image_pc.png'
import imgSp from '../assets/ChatGPT_Image_sp.png'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className={styles.container}>
      <picture>
        <source media="(min-width: 768px)" srcSet={imgPc} />
        <img src={imgSp} alt="茶杓暦" className={styles.heroImage} />
      </picture>

      <div className={styles.buttons}>
        <button
          className={styles.sakuraButton}
          onClick={() => navigate('/schedule')}
        >
          次のお稽古
        </button>
        <button
          className={styles.matchaButton}
          onClick={() => navigate('/history')}
        >
          直近の名付け
        </button>
      </div>
    </main>
  )
}
