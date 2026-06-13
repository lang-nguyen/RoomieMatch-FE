import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Home,
  ShoppingBag,
  List,
  BarChart2,
  Settings,
  LogOut,
  Package,
  FileText,
} from 'lucide-react';
import { logout, selectCurrentUser } from '../../features/auth/slice';
import styles from './LandlordSidebar.module.css';

const OVERVIEW_ITEMS = [
  { id: 'home', label: 'Trang chủ', path: '/landlord', icon: Home, end: true },
  { id: 'packages', label: 'Mua gói', path: '/landlord/packages', icon: ShoppingBag },
  { id: 'rooms', label: 'Danh sách trọ', path: '/landlord/rooms', icon: List },
  { id: 'stats', label: 'Thống kê', path: '/landlord/stats', icon: BarChart2 },
  { id: 'package-mgmt', label: 'Quản lý gói', path: '/landlord/package-management', icon: Package },
  { id: 'posts', label: 'Quản lý bài đăng', path: '/landlord/posts', icon: FileText },
];

const SETTINGS_ITEMS = [
  { id: 'settings', label: 'Cài đặt', path: '/landlord/settings', icon: Settings },
];

const LandlordSidebar = ({ promotedUsers = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <span className={styles.logoText}>ROOMIEMATCH</span>
      </div>

      {/* Overview */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>OVERVIEW</div>
        <nav className={styles.nav}>
          {OVERVIEW_ITEMS.map(({ id, label, path, icon: Icon, end }) => (
            <NavLink
              key={id}
              to={path}
              end={end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <Icon size={16} className={styles.navIcon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Promoted Users (Gói khuyến mãi) */}
      {promotedUsers.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>GÓI KHUYẾN MÃI</div>
          <div className={styles.promotedList}>
            {promotedUsers.map((u) => (
              <div key={u.id} className={styles.promotedItem}>
                <div className={styles.promotedAvatar}>
                  {u.display_name?.[0] ?? 'U'}
                </div>
                <div className={styles.promotedInfo}>
                  <div className={styles.promotedName}>{u.display_name}</div>
                  <div className={styles.promotedSub}>{u.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings & Logout */}
      <div className={styles.footer}>
        <div className={styles.sectionLabel}>CÀI ĐẶT</div>
        {SETTINGS_ITEMS.map(({ id, label, path, icon: Icon }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
            }
          >
            <Icon size={16} className={styles.navIcon} />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={16} className={styles.navIcon} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default LandlordSidebar;
