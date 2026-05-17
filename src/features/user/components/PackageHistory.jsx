import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PackageHistory.module.css';

const MOCK_PACKAGES = [
  {
    id: 1,
    name: 'Cơ bản',
    letter: 'B',
    color: '#4F46E5', // Indigo
    price: '39.000 đ/tháng',
    startDate: '20/03/2026',
    endDate: '20/03/2026',
    status: 'Đang kích hoạt',
  },
  {
    id: 2,
    name: 'Miễn phí',
    letter: 'F',
    color: '#111827', // Black
    price: '0 đ/tháng',
    startDate: '20/03/2026',
    endDate: '20/03/2026',
    status: 'Đang chờ xử lý',
  },
  {
    id: 3,
    name: 'Pro',
    letter: 'P',
    color: '#8B5CF6', // Purple
    price: '99.000 đ/tháng',
    startDate: '20/03/2026',
    endDate: '20/03/2026',
    status: 'Đã hết hạn',
  }
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Đang kích hoạt': return styles.statusActive;
    case 'Đang chờ xử lý': return styles.statusPending;
    case 'Đã hết hạn': return styles.statusExpired;
    default: return '';
  }
};

const PackageHistory = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Lịch sử mua gói</h1>
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

      <div className={styles.packagesList}>
        {MOCK_PACKAGES.map(pkg => (
          <div key={pkg.id} className={styles.card}>
            <div className={styles.packageInfo}>
              <div 
                className={styles.iconBox} 
                style={{ backgroundColor: pkg.color }}
              >
                {pkg.letter}
              </div>
              
              <div className={styles.namePrice}>
                <h3 className={styles.name}>{pkg.name}</h3>
                <div className={styles.price}>{pkg.price}</div>
              </div>
            </div>

            <div className={styles.dates}>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>Ngày đăng ký:</span>
                <span className={styles.dateValue}>{pkg.startDate}</span>
              </div>
              <div className={styles.dateRow}>
                <span className={styles.dateLabel}>Ngày hết hạn:</span>
                <span className={styles.dateValue}>{pkg.endDate}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <div className={`${styles.statusTag} ${getStatusClass(pkg.status)}`}>
                {pkg.status}
              </div>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => navigate('/user/package-management')}
              >
                <Eye className={styles.btnIcon} />
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageHistory;
