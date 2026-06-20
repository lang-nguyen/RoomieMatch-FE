import { Search, FileText, Star } from 'lucide-react';
import { useGetRentalHistoryQuery } from '../api/userApi';
import styles from './RentalHistory.module.css';
import temptImage from '../../../assets/tempt.jpg';

const RentalHistory = () => {
  const { data, isLoading, isError } = useGetRentalHistoryQuery();
  const rentals = data?.items || [];

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

      {isLoading ? (
        <div>Đang tải lịch sử thuê phòng...</div>
      ) : isError ? (
        <div>Đã có lỗi xảy ra khi tải dữ liệu.</div>
      ) : (
        <div className={styles.rentalsList}>
          {rentals.map(rental => (
            <div key={rental.rental_id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img 
                  src={rental.image || temptImage} 
                  alt={rental.title} 
                  className={styles.image} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = temptImage;
                  }}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{rental.title}</h3>

                <div className={styles.details}>
                  <div className={styles.timeLabel}>Thời gian thuê:</div>
                  <div className={styles.timeValue}>
                    {rental.start_date} - {rental.end_date}
                  </div>
                </div>

                <div className={`${styles.statusTag} ${rental.status === 'Đang thuê' ? styles.statusActive : styles.statusCompleted}`}>
                  {rental.rental_status}
                </div>
              </div>

              <div className={styles.actions}>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                  <FileText className={styles.btnIcon} />
                  Xem hợp đồng
                </button>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  <Star className={styles.btnIcon} />
                  Đánh giá
                </button>
              </div>
            </div>
          ))}
          {rentals.length === 0 && <div>Chưa có lịch sử thuê phòng.</div>}
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
