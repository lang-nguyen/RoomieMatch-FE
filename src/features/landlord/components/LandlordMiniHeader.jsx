import { Bell } from 'lucide-react';
import styles from './LandlordMiniHeader.module.css';

const LandlordMiniHeader = ({ search, onSearchChange, activeTab, onTabChange, boostedCount = 0 }) => {
  return (
    <div className={styles.header}>
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder="Tìm theo tiêu đề bài viết hoặc ID (#P001)..."
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => onTabChange?.('all')}
        >
          Tất cả bài viết
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'boosted' ? styles.active : ''}`}
          onClick={() => onTabChange?.('boosted')}
        >
          Bài nổi bật
          <span>{boostedCount}</span>
        </button>
      </div>

      <div className={styles.account}>
        <button className={styles.iconBtn} aria-label="Thông báo">
          <Bell size={13} />
        </button>
        <span className={styles.avatar}>QT</span>
        <span className={styles.name}>Hảo</span>
      </div>
    </div>
  );
};

export default LandlordMiniHeader;
