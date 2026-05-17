import { ArrowLeft, Check, CreditCard, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './PackageManagement.module.css';

const PackageManagement = () => {
  const navigate = useNavigate();

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
            Xem thông tin chi tiết và mức sử dụng gói dịch vụ hiện tại của bạn.
          </p>
        </div>
      </div>

      <div className={styles.mainCard}>
        <div className={styles.mainCardHeader}>
          <div>
            <div className={styles.activeTag}>
              <Check className={styles.checkIcon} />
              Đang kích hoạt
            </div>
            <h2 className={styles.packageName}>Gói VIP</h2>
            <div className={styles.packagePrice}>299.000đ/tháng</div>
          </div>
          <div className={styles.nextRenewal}>
            <div className={styles.renewalLabel}>Ngày gia hạn tiếp theo</div>
            <div className={styles.renewalDate}>29/04/2026</div>
          </div>
        </div>

        <div className={styles.mainCardBody}>
          <div className={styles.detailsSection}>
            <h3 className={styles.sectionTitle}>CHI TIẾT CHU KỲ</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày kích hoạt:</span>
              <span className={styles.detailValue}>29/03/2026</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Ngày hết hạn:</span>
              <span className={styles.detailValue}>29/04/2026</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Tự động gia hạn:</span>
              <span className={styles.statusActiveText}>Đang bật</span>
            </div>
          </div>

          <div className={styles.paymentSection}>
            <h3 className={styles.sectionTitle}>THANH TOÁN</h3>
            <div className={styles.paymentCard}>
              <div className={styles.visaIconWrapper}>
                <CreditCard className={styles.visaIcon} />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardNumber}>Visa ending in 4242</div>
                <div className={styles.cardDefault}>Thẻ mặc định</div>
              </div>
            </div>
            <button className={styles.updatePaymentBtn}>
              Cập nhật phương thức thanh toán
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.actionCard}>
          <h3 className={styles.cardTitle}>Hành động</h3>
          <button className={styles.upgradeBtn}>
            Nâng cấp gói dịch vụ
            <ArrowRight className={styles.arrowIcon} />
          </button>
          <div className={styles.actionLinks}>
            <button className={styles.textBtn}>Quản lý thẻ tín dụng</button>
            <button className={`${styles.textBtn} ${styles.dangerText}`}>Hủy gia hạn gói</button>
          </div>
        </div>

        <div className={styles.transactionCard}>
          <div className={styles.transactionHeader}>
            <h3 className={styles.cardTitle}>Giao dịch gần đây</h3>
            <button className={styles.viewAllBtn}>Xem tất cả</button>
          </div>
          
          <div className={styles.transactionList}>
            <div className={styles.transactionItem}>
              <div>
                <div className={styles.transName}>Gói VIP - 1 Tháng</div>
                <div className={styles.transDate}>29/03/2026</div>
              </div>
              <div className={styles.transAmount}>299.000đ</div>
            </div>
            
            <div className={styles.divider}></div>
            
            <div className={styles.transactionItem}>
              <div>
                <div className={styles.transName}>Gói Free</div>
                <div className={styles.transDate}>10/01/2025</div>
              </div>
              <div className={styles.transAmount}>0đ</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageManagement;
