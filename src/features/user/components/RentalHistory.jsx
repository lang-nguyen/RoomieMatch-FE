import { Search, FileText, Star } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useGetRentalHistoryQuery } from '../api/userApi';
import styles from './RentalHistory.module.css';
import temptImage from '../../../assets/tempt.jpg';

const RentalHistory = () => {
  const { data, isLoading, isError } = useGetRentalHistoryQuery();
  const rentals = data?.items || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRentals = useMemo(() => {
    let result = [...rentals];
    if (searchTerm) {
      result = result.filter(r => (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => {
        const isCurrentlyActive = r.status === 'Đang thuê' || r.rental_status === 'Đang thuê';
        if (statusFilter === 'active') return isCurrentlyActive;
        if (statusFilter === 'completed') return !isCurrentlyActive;
        return true;
      });
    }
    return result;
  }, [rentals, searchTerm, statusFilter]);

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
          {filteredRentals.map(rental => (
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
                <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => alert('Tính năng Xem hợp đồng đang được phát triển.')}>
                  <FileText className={styles.btnIcon} />
                  Xem hợp đồng
                </button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => alert('Tính năng Đánh giá đang được phát triển.')}>
                  <Star className={styles.btnIcon} />
                  Đánh giá
                </button>
              </div>
            </div>
          ))}
          {filteredRentals.length === 0 && <div>Không tìm thấy lịch sử thuê phòng phù hợp.</div>}
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
