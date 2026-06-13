import { Search } from 'lucide-react';
import RoomCard from '../../../shared/components/RoomCard';
import { useGetSavedRoomsQuery } from '../api/userApi';
import styles from './SavedRooms.module.css';

const SavedRooms = () => {
  const { data, isLoading, isError } = useGetSavedRoomsQuery();
  const rooms = data?.items || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Danh sách phòng đã lưu</h1>
      </div>

      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            className={styles.searchInput}
          />
        </div>

        <select className={styles.filterSelect}>
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {isLoading ? (
        <div>Đang tải danh sách phòng...</div>
      ) : isError ? (
        <div>Đã có lỗi xảy ra khi tải dữ liệu.</div>
      ) : (
        <div className={styles.roomsList}>
          {rooms.map(room => {
            const FALLBACK_IMAGE = room.thumbnail || room.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
            return (
              <RoomCard
                key={room.post_id || room.id}
                room={{
                  ...room,
                  image: FALLBACK_IMAGE
                }}
              />
            );
          })}
          {rooms.length === 0 && <div>Chưa có phòng nào được lưu.</div>}
        </div>
      )}
    </div>
  );
};

export default SavedRooms;
