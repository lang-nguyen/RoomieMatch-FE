import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Plus, Search, Info } from 'lucide-react';
import { useLandlordRooms } from '../../features/landlord/hooks/useLandlordRooms';
import LandlordRoomCard from '../../features/landlord/components/LandlordRoomCard';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordRoomsPage.module.css';
import sharedStyles from './LandlordPageShared.module.css';

const STATUS_FILTERS = [
  { value: '', label: 'Trạng thái' },
  { value: 'available', label: 'Trống' },
  { value: 'rented', label: 'Đã thuê' },
  { value: 'negotiating', label: 'Thương lượng' },
];

const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonThumb} />
    <div className={styles.skeletonBody}>
      <div className={styles.skeletonLine} />
      <div className={styles.skeletonLine} style={{ width: '60%' }} />
      <div className={styles.skeletonLine} style={{ width: '40%' }} />
    </div>
  </div>
);

const AddRoomEmptyCard = ({ onClick }) => (
  <button className={styles.addEmptyCard} onClick={onClick}>
    <div className={styles.addEmptyIcon}>＋</div>
    <div className={styles.addEmptyLabel}>Thêm phòng trọ</div>
    <div className={styles.addEmptySub}>Tạo mã trọ mới</div>
  </button>
);

const LandlordRoomsPage = () => {
  const navigate = useNavigate();
  const {
    rooms,
    total,
    totalPages,
    currentPage,
    filters,
    isLoading,
    isFetching,
    handleSearchChange,
    handleStatusChange,
    handlePageChange,
    handleDelete,
  } = useLandlordRooms();
  const [searchParams] = useSearchParams();
  const isSelectForPostMode = searchParams.get('mode') === 'select-for-post';

  const handleTogglePost = (room) => {
    navigate(`/landlord/posts/create?roomId=${room.id}`);
  };

  return (
    <div className={sharedStyles.page}>
      <LandlordPageHeader
        icon={Home}
        title="Danh sách trọ"
        subtitle={`Quản lý phòng trọ, trạng thái thuê và thông tin hiển thị · ${total} phòng`}
        actions={(
          <button
            className={styles.addBtn}
            onClick={() => navigate('/landlord/rooms/add')}
          >
            <Plus size={15} />
            Thêm trọ mới
          </button>
        )}
      />

      {isSelectForPostMode && (
        <div style={{ backgroundColor: '#eef2ff', color: '#4f46e5', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
          <Info size={18} />
          Hướng dẫn: Bấm vào [Dùng cho bài] trên phòng trọ bạn muốn đăng bài.
        </div>
      )}

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search size={14} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Tìm theo tên, mã trọ, địa chỉ..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {/* Room grid */}
      <div className={`${styles.grid} ${isFetching ? styles.gridFetching : ''}`}>
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {rooms.map((room) => (
              <LandlordRoomCard
                key={room.id}
                room={room}
                onEdit={(r) => navigate(`/landlord/rooms/${r.id}/edit`)}
                onDelete={(r) => handleDelete(r.id)}
                onTogglePost={handleTogglePost}
              />
            ))}
            {/* Add room CTA card */}
            <AddRoomEmptyCard onClick={() => navigate('/landlord/rooms/add')} />
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.pageBtn} ${currentPage === i + 1 ? styles.pageBtnActive : ''}`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default LandlordRoomsPage;
