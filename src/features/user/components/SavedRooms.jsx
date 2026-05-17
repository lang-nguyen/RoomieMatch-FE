import { Search } from 'lucide-react';
import RoomCard from '../../../shared/components/RoomCard';
import styles from './SavedRooms.module.css';

const MOCK_ROOMS = [
  {
    id: 1,
    title: 'Phòng trọ cao cấp gần Đại học Bách Khoa',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    address: '123 Đường Thảo Điền, P. Thảo Điền, TP. Thủ Đức',
    dateSaved: '20/03/2026',
    area: 20,
    status: 'Còn trống',
  },
  {
    id: 2,
    title: 'Phòng trọ thoáng mát, có gác lửng',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    address: '123 Đường Thảo Điền, P. Thảo Điền, TP. Thủ Đức',
    dateSaved: '18/03/2026',
    area: 18,
    status: 'Còn trống',
  },
  {
    id: 3,
    title: 'Studio mini đầy đủ nội thất',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    address: '123 Đường Thảo Điền, P. Thảo Điền, TP. Thủ Đức',
    dateSaved: '15/03/2026',
    area: 25,
    status: 'Đã cho thuê',
  },
  {
    id: 4,
    title: 'Phòng trọ gần chợ, tiện ích đầy đủ',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    address: '123 Đường Thảo Điền, P. Thảo Điền, TP. Thủ Đức',
    dateSaved: '12/03/2026',
    area: 22,
    status: 'Còn trống',
  }
];

const SavedRooms = () => {
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

      <div className={styles.roomsList}>
        {MOCK_ROOMS.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default SavedRooms;
