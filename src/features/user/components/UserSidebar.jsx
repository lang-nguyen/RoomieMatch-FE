import { NavLink } from 'react-router-dom';
import { 
  User, 
  Bookmark, 
  History, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import styles from './UserSidebar.module.css';

const UserSidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Quản lý cá nhân</h2>
      
      <nav className={styles.menu}>
        <NavLink 
          to="/user/profile" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <User className={styles.icon} />
          Hồ sơ cá nhân
        </NavLink>
        
        <NavLink 
          to="/user/saved-rooms" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <Bookmark className={styles.icon} />
          Phòng đã lưu
        </NavLink>

        <NavLink 
          to="/user/rental-history" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <History className={styles.icon} />
          Lịch sử thuê
        </NavLink>

        <NavLink 
          to="/user/package-history" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <CreditCard className={styles.icon} />
          Lịch sử mua gói
        </NavLink>
      </nav>

      <div className={styles.footerMenu}>
        <NavLink 
          to="/user/settings" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <Settings className={styles.icon} />
          Cài đặt
        </NavLink>

        <button className={styles.logoutBtn}>
          <LogOut className={styles.logoutIcon} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
