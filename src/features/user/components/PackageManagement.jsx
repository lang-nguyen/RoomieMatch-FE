import { ArrowLeft, Check, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PackageManagement.module.css';
import { useGetAllPackagesQuery, useGetPackageEntitlementsQuery, usePurchasePackageMutation } from '../api/userApi';

const PackageManagement = () => {
  const navigate = useNavigate();
  const { data: packages, isLoading: isLoadingPackages } = useGetAllPackagesQuery();
  const { data: entitlements, isLoading: isLoadingEntitlements } = useGetPackageEntitlementsQuery();
  const [purchasePackage, { isLoading: isPurchasing }] = usePurchasePackageMutation();

  const handlePurchase = async (pkgId) => {
    try {
      const res = await purchasePackage({ package_id: pkgId }).unwrap();
      alert('Đăng ký thành công!');
    } catch(err) {
      alert('Đăng ký thất bại. Xin vui lòng thử lại.');
    }
  };

  if (isLoadingPackages || isLoadingEntitlements) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  // Find active entitlements
  const hasEntitlements = entitlements && entitlements.length > 0;
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backBtn}
          onClick={() => navigate('/user/package-history')}
        >
          <ArrowLeft className={styles.backIcon} />
        </button>
        <div>
          <h1 className={styles.pageTitle}>Quản lý gói dịch vụ</h1>
          <p className={styles.pageSubtitle}>
            Xem thông tin chi tiết và quyền lợi các gói dịch vụ của bạn.
          </p>
        </div>
      </div>

      {!hasEntitlements && (
        <div className={styles.mainCard} style={{marginBottom: '20px'}}>
          Bạn hiện chưa có quyền lợi gói dịch vụ nào đang kích hoạt.
        </div>
      )}

      {hasEntitlements && entitlements.map(entitlement => (
        <div key={entitlement.id} className={styles.mainCard} style={{marginBottom: '20px'}}>
          <div className={styles.mainCardHeader}>
            <div>
              <div className={styles.activeTag}>
                <Check className={styles.checkIcon} />
                Đang kích hoạt
              </div>
              <h2 className={styles.packageName}>Quyền lợi: {entitlement.feature_key}</h2>
              <div className={styles.packagePrice}>Số lượng: {entitlement.quantity}</div>
            </div>
            <div className={styles.nextRenewal}>
              <div className={styles.renewalLabel}>Ngày hết hạn</div>
              <div className={styles.renewalDate}>{new Date(entitlement.expires_at).toLocaleDateString('vi-VN')}</div>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.bottomSection}>
        <div className={styles.actionCard} style={{ width: '100%' }}>
          <h3 className={styles.cardTitle}>Mua gói dịch vụ mới</h3>
          {packages && packages.map(pkg => (
              <div key={pkg.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ccc' }}>
                <div>
                  <strong>{pkg.name}</strong> - {pkg.price_cents.toLocaleString()} VND
                  <p>{pkg.description}</p>
                </div>
                <button 
                  className={styles.upgradeBtn} 
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isPurchasing}
                >
                  Mua ngay
                </button>
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackageManagement;
