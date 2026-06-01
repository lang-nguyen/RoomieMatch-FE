import { useState } from 'react';
import { Search } from 'lucide-react';
import { useGetPackagesQuery, usePurchasePackageMutation } from '../../features/landlord/api/landlordApiMock';
import PackageCard from '../../features/landlord/components/PackageCard';
import styles from './LandlordPackagesPage.module.css';
import sharedStyles from './LandlordPageShared.module.css';

const TIER_TABS = [
  { value: '', label: 'Tất cả' },
  { value: 'basic', label: 'Cơ bản' },
  { value: 'pro', label: 'Pro' },
  { value: 'vip', label: 'Vip' },
];

const LandlordPackagesPage = () => {
  const [activeTier, setActiveTier] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useGetPackagesQuery({ tier: activeTier, search });
  const [purchasePackage] = usePurchasePackageMutation();

  const packages = data?.items ?? [];

  const handleSelect = async (pkg) => {
    try {
      await purchasePackage({ packageId: pkg.id }).unwrap();
      alert(`Đăng ký gói ${pkg.name} thành công!`);
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className={sharedStyles.page}>
      {/* Page header */}
      <div className={sharedStyles.pageHeader}>
        <div className={styles.breadcrumb}>
          <span>Danh sách gói</span>
          <span className={styles.breadSub}> · Mua tiện ích cho bạn</span>
        </div>
      </div>

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
      <div className={styles.featuredTitle}>
        Các gói nổi bật 🔥
      </div>

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
