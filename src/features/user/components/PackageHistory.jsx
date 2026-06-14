import { useState, useMemo } from 'react';
import { Search, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetPackageHistoryQuery } from '../api/userApi';
import styles from './PackageHistory.module.css';

const formatCurrency = (cents) => {
  if (!cents && cents !== 0) return '0 VND';
  return `${cents.toLocaleString('vi-VN')} VND`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('vi-VN');
};

const translateStatus = (status) => {
  const lower = String(status).toLowerCase();
  if (lower === 'active' || lower === 'đang kích hoạt') return 'Đang kích hoạt';
  if (lower === 'pending' || lower === 'đang chờ xử lý') return 'Đang chờ xử lý';
  if (lower === 'expired' || lower === 'đã hết hạn') return 'Đã hết hạn';
  return status;
};

const getStatusClass = (status) => {
  const translated = translateStatus(status);
  switch (translated) {
    case 'Đang kích hoạt': return styles.statusActive;
    case 'Đang chờ xử lý': return styles.statusPending;
    case 'Đã hết hạn': return styles.statusExpired;
    default: return '';
  }
};

const PackageHistory = () => {
  const navigate = useNavigate();
  const { data: packages = [], isLoading, isError } = useGetPackageHistoryQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredAndSortedPackages = useMemo(() => {
    let result = [...packages];

    // Filter by name
    if (searchTerm) {
      result = result.filter(pkg =>
        (pkg.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [packages, searchTerm, sortOrder]);

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>

      {isLoading ? (
        <div>Đang tải lịch sử gói...</div>
      ) : isError ? (
        <div>Đã có lỗi xảy ra khi tải dữ liệu.</div>
      ) : (
        <div className={styles.packagesList}>
          {filteredAndSortedPackages.map(pkg => (
            <div key={pkg.id} className={styles.card}>
              <div className={styles.packageInfo}>
                <div
                  className={styles.iconBox}
                  style={{ backgroundColor: pkg.color || '#e0e0e0', overflow: 'hidden' }}
                >
                  <img
                    src={pkg.image || 'https://placehold.co/100x100?text=No+Image'}
                    alt={pkg.name || 'Package'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x100?text=No+Image';
                    }}
                  />
                </div>

                <div className={styles.namePrice}>
                  <h3 className={styles.name}>{pkg.name}</h3>
                  <div className={styles.price}>{formatCurrency(pkg.amount_cents)}</div>
                </div>
              </div>

              <div className={styles.dates}>
                <div className={styles.dateRow}>
                  <span className={styles.dateLabel}>Ngày đăng ký:</span>
                  <span className={styles.dateValue}>{formatDate(pkg.created_at)}</span>
                </div>
                <div className={styles.dateRow}>
                  <span className={styles.dateLabel}>Ngày hết hạn:</span>
                  <span className={styles.dateValue}>{formatDate(pkg.expires_at || pkg.endDate)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <div className={`${styles.statusTag} ${getStatusClass(pkg.status)}`}>
                  {translateStatus(pkg.status)}
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
          {filteredAndSortedPackages.length === 0 && <div>Chưa có lịch sử mua gói.</div>}
        </div>
      )}
    </div>
  );
};

export default PackageHistory;
