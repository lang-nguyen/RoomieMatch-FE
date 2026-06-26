import { Outlet, useLocation } from 'react-router-dom';
import LandlordSidebar from '../shared/components/LandlordSidebar';
import UserInfoPanel from '../shared/components/UserInfoPanel';
import { useGetLandlordRoomsQuery, useGetLandlordStatsQuery } from '../features/landlord/api/landlordApi';
import styles from './LandlordLayout.module.css';

const LandlordLayout = () => {
  const location = useLocation();
  const { data: roomsData } = useGetLandlordRoomsQuery({ page: 1, pageSize: 4 });
  const { data: statsData } = useGetLandlordStatsQuery({ range: '7d' });
  const hideRightPanel = location.pathname.startsWith('/landlord/posts') || location.pathname.startsWith('/landlord/stats') || location.pathname.startsWith('/landlord/rental-requests');
  const ownedRooms = (roomsData?.items || []).map((room) => ({ id: room.id, name: room.title || room.name, code: room.room_code || room.code }));
  const chartData = (statsData?.weeklyInteractions || []).map((item) => Math.min(100, Math.max(8, Number(item.views || 0) * 10)));

  return (
    <div className={`${styles.wrapper} ${hideRightPanel ? styles.wrapperWide : ''}`}>
      <LandlordSidebar />
      <main className={styles.main}><Outlet /></main>
      {!hideRightPanel && <UserInfoPanel ownedRooms={ownedRooms} chartData={chartData} />}
    </div>
  );
};

export default LandlordLayout;
