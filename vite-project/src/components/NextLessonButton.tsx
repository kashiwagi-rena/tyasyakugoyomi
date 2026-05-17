import styles from './NextLessonButton.module.css'

type Props = {
  date?: string
  onClick?: () => void
}

export default function NextLessonButton({ date, onClick }: Props) {
  return (
    <button className={styles.nextLessonButton} onClick={onClick}>
      <span className={styles.nextLessonSub}>次のお稽古</span>
      <span className={styles.nextLessonDate}>
        {date ?? '未登録'}
      </span>
    </button>
  )
}
