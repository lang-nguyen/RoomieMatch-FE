import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import styles from './VnpayReturnPage.module.css';

const VnpayReturnPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryString = searchParams.toString();
  const responseCode = searchParams.get('vnp_ResponseCode');
  const [status, setStatus] = useState(responseCode === '00' ? 'loading' : 'fail');
  
  useEffect(() => {
    if (responseCode !== '00') return;

    // Backend xác thực checksum, số tiền và trạng thái giao dịch trước khi FE báo thành công.
    fetch(`/api/v1/payments/vnpay/ipn?${queryString}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => setStatus(['00', '02'].includes(data.RspCode) ? 'success' : 'fail'))
      .catch((error) => {
        console.error('VNPAY verification error:', error);
        setStatus('fail');
      });
  }, [queryString, responseCode]);

  const amount = searchParams.get('vnp_Amount') ? parseInt(searchParams.get('vnp_Amount')) / 100 : 0;
  const bankCode = searchParams.get('vnp_BankCode') || 'N/A';
  const orderInfo = searchParams.get('vnp_OrderInfo') || '';
  const txnRef = searchParams.get('vnp_TxnRef') || '';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <div className={styles.content}>
            <div className={styles.spinner}></div>
            <h2 className={styles.loadingText}>Đang xử lý kết quả...</h2>
          </div>
        )}
        
        {status === 'success' && (
          <div className={styles.content}>
            <div className={styles.iconWrapperSuccess}>
              <CheckCircle className={styles.successIcon} size={56} />
            </div>
            <h1 className={styles.successTitle}>Thanh toán thành công!</h1>
            <p className={styles.message}>
              Cảm ơn bạn đã mua gói dịch vụ. Giao dịch đã được xác nhận.
            </p>

            <div className={styles.receiptBox}>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Mã giao dịch:</span>
                <span className={styles.receiptValue}>{txnRef}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Ngân hàng:</span>
                <span className={styles.receiptValue}>{bankCode}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Nội dung:</span>
                <span className={styles.receiptValue}>{orderInfo}</span>
              </div>
              <div className={styles.receiptDivider}></div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Tổng tiền:</span>
                <span className={styles.receiptTotal}>{amount.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.primaryBtn} onClick={() => navigate('/user/package-management')}>
                Xem quyền lợi
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}

        {status === 'fail' && (
          <div className={styles.content}>
            <div className={styles.iconWrapperFail}>
              <XCircle className={styles.failIcon} size={56} />
            </div>
            <h1 className={styles.failTitle}>Thanh toán thất bại</h1>
            <p className={styles.message}>
              Rất tiếc, giao dịch của bạn không thành công hoặc đã bị hủy. Hệ thống chưa trừ tiền của bạn.
            </p>

            <div className={styles.actionButtons}>
              <button className={styles.primaryBtnFail} onClick={() => navigate('/user/package-management')}>
                Thử lại ngay
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VnpayReturnPage;
