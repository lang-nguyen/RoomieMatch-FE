import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  User, 
  Bookmark, 
  History, 
  CreditCard, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { logout } from '../../auth/slice';
import styles from './UserSidebar.module.css';

const UserSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

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
          to="/user/package-management" 
          className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ''}`}
        >
          <CreditCard className={styles.icon} />
          Quản lý gói
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
        
        <button className={styles.logoutBtn} onClick={handleLogout} type="button">
          <LogOut className={styles.logoutIcon} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default UserSidebar;
