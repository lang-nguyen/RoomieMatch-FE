import { ArrowLeft, Check, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PackageManagement.module.css';
import { useState } from 'react';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import { useGetAllPackagesQuery, useGetPackageEntitlementsQuery, useGetPackageHistoryQuery, useCreateVnpayPaymentMutation } from '../api/userApi';

const formatCurrency = (cents) => {
  if (!cents && cents !== 0) return '0 VND';
  return `${cents.toLocaleString('vi-VN')} VND`;
};

const translateFeatureKey = (key) => {
  const map = {
    'post_limit': 'Giới hạn bài đăng',
    'push_to_top': 'Đẩy tin lên top',
    'contact_views': 'Lượt xem liên hệ',
    'support_priority': 'Ưu tiên hỗ trợ'
  };
  return map[key] || key;
};

const PackageManagement = () => {
  const navigate = useNavigate();
  const { data: packages, isLoading: isLoadingPackages } = useGetAllPackagesQuery();
  const { data: entitlements, isLoading: isLoadingEntitlements } = useGetPackageEntitlementsQuery();
  const { data: purchaseHistory = [], isLoading: isLoadingHistory } = useGetPackageHistoryQuery();
  const [createVnpayPayment, { isLoading: isPurchasing }] = useCreateVnpayPaymentMutation();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'alert', message: '', title: 'Thông báo' });

  const handlePurchaseClick = (pkgId) => {
    setSelectedPkgId(pkgId);
    setShowConfirmModal(true);
  };

  const handlePurchase = async () => {
    setShowConfirmModal(false);
    if (!selectedPkgId) return;

    try {
      const response = await createVnpayPayment({ package_id: selectedPkgId }).unwrap();
      if (response.payment_url) {
        window.location.href = response.payment_url;
      } else {
        throw new Error('No payment url returned');
      }
    } catch(err) {
      setAlertModal({ isOpen: true, type: 'alert', message: 'Tạo thanh toán VNPAY thất bại. Xin vui lòng thử lại.', title: 'Lỗi' });
    }
    setSelectedPkgId(null);
  };

  if (isLoadingPackages || isLoadingEntitlements || isLoadingHistory) {
    return <div className={styles.container}>Đang tải...</div>;
  }

  // Find active entitlements
  const hasEntitlements = entitlements && entitlements.length > 0;
  
  // Identify the currently owned package
  const activePurchase = purchaseHistory.find(p => p.status && (p.status.toLowerCase() === 'active' || p.status.toLowerCase() === 'đang kích hoạt'));
  
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
              <h2 className={styles.packageName}>Quyền lợi: {translateFeatureKey(entitlement.feature_key)}</h2>
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
        <div className={styles.actionCard} style={{ width: '100%', border: 'none', boxShadow: 'none', padding: 0, background: 'transparent' }}>
          <h3 className={styles.cardTitle}>Mua gói dịch vụ mới</h3>
          <div className={styles.packageGrid}>
            {packages && packages.map(pkg => {
              const isFreePackage = !pkg.price_cents || pkg.price_cents === 0;
              const isActivePaidPackage = activePurchase && activePurchase.name === pkg.name;
              const isCurrentlyOwned = isActivePaidPackage || (!activePurchase && isFreePackage);

              return (
                <div key={pkg.id} className={styles.pricingCard}>
                  <div className={styles.pricingHeader}>
                    <h3 className={styles.pricingName}>{pkg.name}</h3>
                    <div className={styles.pricingPrice}>
                      {pkg.price_cents ? pkg.price_cents.toLocaleString('vi-VN') : '0'}
                      <span className={styles.pricingCurrency}>VND</span>
                    </div>
                    <p className={styles.pricingDesc}>{pkg.description}</p>
                  </div>
                  
                  <ul className={styles.pricingFeatures}>
                    <li className={styles.pricingFeature}>
                      <Check className={styles.featureIcon} size={18} />
                      <span>Mua và sử dụng ngay lập tức</span>
                    </li>
                    <li className={styles.pricingFeature}>
                      <Check className={styles.featureIcon} size={18} />
                      <span>Hỗ trợ thanh toán nhanh chóng</span>
                    </li>
                  </ul>

                  {isCurrentlyOwned ? (
                    <button className={styles.pricingBtnOwned} disabled>
                      Đang sở hữu
                    </button>
                  ) : (
                    <button 
                      className={styles.pricingBtn} 
                      onClick={() => handlePurchaseClick(pkg.id)}
                      disabled={isPurchasing}
                    >
                      Mua gói ngay
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Xác nhận mua gói"
        message="Bạn có chắc chắn muốn mua gói dịch vụ này không?"
        confirmText="Mua ngay"
        cancelText="Hủy"
        onConfirm={handlePurchase}
        onCancel={() => {
          setShowConfirmModal(false);
          setSelectedPkgId(null);
        }}
      />

      <ConfirmModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="Đóng"
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </div>
  );
};

export default PackageManagement;
