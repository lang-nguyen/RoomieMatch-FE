import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { useGetLandlordPackagesQuery } from '../../features/landlord/api/landlordApi';
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

const getWrappedIndex = (index, length) => {
  if (!length) return 0;
  return (index + length) % length;
};

const LandlordPackagesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTier, setActiveTier] = useState('');
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const { data, isLoading } = useGetLandlordPackagesQuery();

  const packages = (data?.items ?? []).filter((pkg) => {
    const matchTier = !activeTier || pkg.tier === activeTier;
    const matchSearch = !search || pkg.name.toLowerCase().includes(search.toLowerCase());
    return matchTier && matchSearch;
  });

  useEffect(() => {
    setActiveIndex(0);
  }, [activeTier, search]);

  useEffect(() => {
    if (!packages.length) {
      setActiveIndex(0);
      return;
    }
    setActiveIndex((current) => getWrappedIndex(current, packages.length));
  }, [packages.length]);

  const handleSelect = (pkg) => {
    navigate(`/landlord/packages/${pkg.id}/payment`);
  };

  const carouselItems = useMemo(() => {
    if (!packages.length) return [];

    if (packages.length === 1) {
      return [{ pkg: packages[0], slot: 'center', key: `${packages[0].id}-center` }];
    }

    if (packages.length === 2) {
      return [
        { pkg: packages[getWrappedIndex(activeIndex - 1, packages.length)], slot: 'left', key: `${packages[getWrappedIndex(activeIndex - 1, packages.length)].id}-left` },
        { pkg: packages[activeIndex], slot: 'center', key: `${packages[activeIndex].id}-center` },
      ];
    }

    return [
      { pkg: packages[getWrappedIndex(activeIndex - 1, packages.length)], slot: 'left', key: `${packages[getWrappedIndex(activeIndex - 1, packages.length)].id}-left` },
      { pkg: packages[activeIndex], slot: 'center', key: `${packages[activeIndex].id}-center` },
      { pkg: packages[getWrappedIndex(activeIndex + 1, packages.length)], slot: 'right', key: `${packages[getWrappedIndex(activeIndex + 1, packages.length)].id}-right` },
    ];
  }, [activeIndex, packages]);

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

      <div className={styles.featuredTitle}>Các gói nổi bật</div>

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

        {packages.length > 0 && (
          <div className={styles.packageCount}>
            Hiện có <strong>{packages.length}</strong> gói cho chủ trọ
          </div>
        )}
      </div>

      {isLoading ? (
        <div className={styles.loading}>Đang tải gói dịch vụ...</div>
      ) : packages.length > 0 ? (
        <div className={styles.carouselSection}>
          <div className={styles.carouselShell}>
            {packages.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonLeft}`}
                onClick={() => setActiveIndex((current) => getWrappedIndex(current - 1, packages.length))}
                aria-label="Xem gói trước"
              >
                <ChevronLeft size={18} />
              </button>
            )}

            <div className={styles.carouselTrack}>
              {carouselItems.map(({ pkg, slot, key }) => (
                <div
                  key={key}
                  className={`${styles.carouselItem} ${styles[`carouselItem${slot.charAt(0).toUpperCase() + slot.slice(1)}`]}`}
                >
                  <PackageCard pkg={pkg} onSelect={handleSelect} isCarouselActive={slot === 'center'} />
                </div>
              ))}
            </div>

            {packages.length > 1 && (
              <button
                type="button"
                className={`${styles.navButton} ${styles.navButtonRight}`}
                onClick={() => setActiveIndex((current) => getWrappedIndex(current + 1, packages.length))}
                aria-label="Xem gói tiếp theo"
              >
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {packages.length > 1 && (
            <div className={styles.dots}>
              {packages.map((pkg, index) => (
                <button
                  key={pkg.id}
                  type="button"
                  className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Chọn gói ${pkg.name}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.loading}>Chưa có gói phù hợp.</div>
      )}
    </div>
  );
};

export default LandlordPackagesPage;
