import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import { useGetPackagesQuery } from '../../features/landlord/api/landlordApiMock';
import PackageCard from '../../features/landlord/components/PackageCard';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordPackagesPage.module.css';
import sharedStyles from './LandlordPageShared.module.css';

const TIER_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'basic', label: 'Cơ bản' },
  { value: 'pro', label: 'Pro' },
  { value: 'vip', label: 'Vip' },
];

const LandlordPackagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTier, setActiveTier] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetPackagesQuery({ tier: activeTier, search });

  const packages = data?.items ?? [];

  const handleSelect = (pkg) => {
    navigate(`/landlord/packages/${pkg.id}/payment`);
  };

  return (
    <div className={sharedStyles.page}>
      <LandlordPageHeader
        icon={ShoppingBag}
        title="Mua gói"
        subtitle="Chọn gói phù hợp để tăng lượt hiển thị và quản lý bài đăng hiệu quả hơn"
      />

      {location.state?.paymentSuccess ? (
        <div className={styles.successNotice}>
          Thanh toán gói {location.state.packageName} thành công. Gói đã được ghi nhận vào lịch sử mua.
        </div>
      ) : null}

      {/* Search bar */}
      <div className={styles.searchBar}>
        <Search size={14} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Tìm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className={styles.priceFilter}>Giá ▾</button>
      </div>

      {/* Featured title */}
      <div className={styles.featuredTitle}>Các gói nổi bật</div>

      {/* Tier tabs */}
      <div className={styles.tierTabs}>
        {TIER_TABS.map((tab) => (
          <button
            key={tab.value}
            className={`${styles.tierTab} ${activeTier === tab.value ? styles.tierTabActive : ''}`}
            onClick={() => setActiveTier(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Package cards */}
      {isLoading ? (
        <div className={styles.loading}>Đang tải gói dịch vụ...</div>
      ) : (
        <div className={styles.packageGrid}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordPackagesPage;
