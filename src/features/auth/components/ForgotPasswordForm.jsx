import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.formWrapper}>
      <div className={styles.headerTitle}>
        <button type="button" onClick={() => navigate('/login')} className={styles.backButton}>
          <BackArrowIcon />
        </button>
        Khôi phục mật khẩu
      </div>

      <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px', fontSize: '14px' }}>
        Nhập email của bạn để nhận mã đặt lại mật khẩu
      </p>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className={styles.inputGroup}>
          <input type="email" placeholder="Email" className={styles.input} required />
        </div>

        <button type="submit" className={styles.primaryButton}>Tiếp tục</button>
      </form>

      <div className={styles.supportText}>
        Nếu bạn cần hỗ trợ, vui lòng liên hệ SĐT/Zalo: <span>0582969652</span>
      </div>
    </div>
  );
};
