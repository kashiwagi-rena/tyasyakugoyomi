import { Link } from 'react-router'
import faviconImg from '../assets/ChatGPT_Image_favicon.png'
import styles from './Navigation.module.css'

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      <Link to="/">
        <img src={faviconImg} alt="茶杓暦" className={styles.icon} />
      </Link>
    </nav>
  )
}
