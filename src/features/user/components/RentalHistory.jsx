import { Search, FileText, Star } from 'lucide-react';
import styles from './RentalHistory.module.css';

const MOCK_RENTALS = [
  {
    id: 1,
    title: 'Phòng trọ cao cấp gần Đại học Bách Khoa',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    startDate: '01/01/2026',
    endDate: 'Đang thuê',
    status: 'Đang thuê',
  },
  {
    id: 2,
    title: 'Phòng trọ sinh viên - Ký túc xá A',
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    startDate: '01/08/2025',
    endDate: '31/12/2025',
    status: 'Đã trả phòng',
  },
  {
    id: 3,
    title: 'Phòng trọ gần chợ Bến Thành',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    startDate: '15/03/2025',
    endDate: '31/07/2025',
    status: 'Đã trả phòng',
  },
  {
    id: 4,
    title: 'Studio hiện đại khu trung tâm',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    startDate: '01/01/2025',
    endDate: '28/02/2025',
    status: 'Đã trả phòng',
  }
];

const RentalHistory = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Lịch sử thuê phòng</h1>
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
          <option value="all">Tất cả</option>
          <option value="active">Đang thuê</option>
          <option value="completed">Đã trả phòng</option>
        </select>
      </div>

      <div className={styles.rentalsList}>
        {MOCK_RENTALS.map(rental => (
          <div key={rental.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={rental.image} alt={rental.title} className={styles.image} />
            </div>

            <div className={styles.content}>
              <h3 className={styles.title}>{rental.title}</h3>
              
              <div className={styles.details}>
                <div className={styles.timeLabel}>Thời gian thuê:</div>
                <div className={styles.timeValue}>
                  {rental.startDate} - {rental.endDate}
                </div>
              </div>

              <div className={`${styles.statusTag} ${rental.status === 'Đang thuê' ? styles.statusActive : styles.statusCompleted}`}>
                {rental.status}
              </div>
            </div>

            <div className={styles.actions}>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <FileText className={styles.btnIcon} />
                Xem hợp đồng
              </button>
              <button className={`${styles.btn} ${styles.btnSecondary}`}>
                <Star className={styles.btnIcon} />
                Đánh giá
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentalHistory;
