import { AdminIcon } from './adminIconMap';
import styles from './AdminDashboard.module.css';

export const AdminTopbar = ({ currentUser, hasUnreadNotifications, onOpenMenu, onLogout }) => (
  <header className={styles.topbar}>
    <button
      className={`${styles.iconButton} ${styles.mobileMenuButton}`}
      type="button"
      aria-label="Mở menu admin"
      onClick={onOpenMenu}
    >
      <AdminIcon name="menu" size={17} />
    </button>

    <div className={styles.searchWrap}>
      <span className={styles.searchIcon}>
        <AdminIcon name="search" size={15} />
      </span>
      <input type="search" placeholder="Tìm kiếm..." />
    </div>

    <div className={styles.topbarActions}>
      <button className={styles.iconButton} type="button" aria-label="Thông báo">
        <AdminIcon name="bell" size={17} />
        {hasUnreadNotifications && <span className={styles.notifDot} />}
      </button>

      <button className={styles.userChip} type="button">
        <span className={styles.userAvatar}>{currentUser?.initials || 'AD'}</span>
        <span className={styles.userName}>{currentUser?.name || 'Quản trị viên'}</span>
      </button>

      <button className={`${styles.iconButton} ${styles.topbarLogoutButton}`} type="button" aria-label="Đăng xuất" title="Đăng xuất" onClick={onLogout}>
        <AdminIcon name="logout" size={17} />
      </button>
    </div>
  </header>
);
