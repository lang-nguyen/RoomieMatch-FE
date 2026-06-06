import { Outlet, useLocation } from 'react-router-dom';
import LandlordSidebar from '../shared/components/LandlordSidebar';
import UserInfoPanel from '../shared/components/UserInfoPanel';
import styles from './LandlordLayout.module.css';

// Mock promoted users cho sidebar — sẽ thay bằng API sau
const PROMOTED_USERS = [
  { id: 1, display_name: 'Aaa', subtitle: 'Aaa' },
  { id: 2, display_name: 'Aaa', subtitle: 'Aaaa' },
  { id: 3, display_name: 'Aaa', subtitle: 'Aas' },
];

// Mock owned rooms cho right panel — sẽ thay bằng real data sau
const OWNED_ROOMS_PREVIEW = [
  { id: 1, name: 'Trọ Thủ Đức', code: 'XO34_TD' },
  { id: 2, name: 'Trọ Thủ Đức', code: 'XO34_TD' },
  { id: 3, name: 'Trọ Thủ Đức', code: 'XO34_TD' },
  { id: 4, name: 'Trọ Thủ Đức', code: 'XO34_TD' },
];

const LandlordLayout = () => {
  const location = useLocation();
  const hideRightPanel =
    location.pathname.startsWith('/landlord/posts') ||
    location.pathname.startsWith('/landlord/stats');

  return (
    <div className={`${styles.wrapper} ${hideRightPanel ? styles.wrapperWide : ''}`}>
      {/* Left sidebar */}
      <LandlordSidebar promotedUsers={PROMOTED_USERS} />

      {/* Main content area */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* Right panel */}
      {!hideRightPanel && <UserInfoPanel ownedRooms={OWNED_ROOMS_PREVIEW} />}
    </div>
  );
};

export default LandlordLayout;
