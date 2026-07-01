import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { baseApi } from '../shared/api/baseApi';
import styles from './VnpayReturnPage.module.css';

const VnpayReturnPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryString = searchParams.toString();
  const responseCode = searchParams.get('vnp_ResponseCode');
  const txnRef = searchParams.get('vnp_TxnRef') || '';
  const [status, setStatus] = useState(txnRef ? 'loading' : 'fail');

  useEffect(() => {
    if (!txnRef) return;

    fetch(`/api/v1/payments/vnpay/ipn?${queryString}`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        const isSuccess = ['00', '02'].includes(data.RspCode) && responseCode === '00';
        if (isSuccess) {
          dispatch(baseApi.util.invalidateTags(['Packages']));
        }
        setStatus(isSuccess ? 'success' : 'fail');
      })
      .catch((error) => {
        console.error('VNPAY verification error:', error);
        setStatus('fail');
      });
  }, [dispatch, queryString, responseCode, txnRef]);

  const amount = searchParams.get('vnp_Amount') ? parseInt(searchParams.get('vnp_Amount'), 10) / 100 : 0;
  const bankCode = searchParams.get('vnp_BankCode') || 'N/A';
  const orderInfo = searchParams.get('vnp_OrderInfo') || '';
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null');
    } catch {
      return null;
    }
  })();
  const benefitsPath = user?.account_type === 'landlord' ? '/landlord/package-management' : '/user/package-management';

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {status === 'loading' && (
          <div className={styles.content}>
            <div className={styles.spinner}></div>
            <h2 className={styles.loadingText}>Dang xu ly ket qua...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className={styles.content}>
            <div className={styles.iconWrapperSuccess}>
              <CheckCircle className={styles.successIcon} size={56} />
            </div>
            <h1 className={styles.successTitle}>Thanh toan thanh cong!</h1>
            <p className={styles.message}>
              Giao dich da duoc xac nhan. Goi dich vu cua ban se duoc cap nhat ngay trong trang quan ly goi.
            </p>

            <div className={styles.receiptBox}>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Ma giao dich:</span>
                <span className={styles.receiptValue}>{txnRef}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Ngan hang:</span>
                <span className={styles.receiptValue}>{bankCode}</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Noi dung:</span>
                <span className={styles.receiptValue}>{orderInfo}</span>
              </div>
              <div className={styles.receiptDivider}></div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptLabel}>Tong tien:</span>
                <span className={styles.receiptTotal}>{amount.toLocaleString('vi-VN')} VND</span>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <button className={styles.primaryBtn} onClick={() => navigate(benefitsPath)}>
                Xem quan ly goi
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
                Ve trang chu
              </button>
            </div>
          </div>
        )}

        {status === 'fail' && (
          <div className={styles.content}>
            <div className={styles.iconWrapperFail}>
              <XCircle className={styles.failIcon} size={56} />
            </div>
            <h1 className={styles.failTitle}>Thanh toan that bai</h1>
            <p className={styles.message}>
              Giao dich khong thanh cong hoac da bi huy. He thong da cap nhat lai trang thai don mua de khong bi treo cho xac nhan.
            </p>

            <div className={styles.actionButtons}>
              <button className={styles.primaryBtnFail} onClick={() => navigate(benefitsPath)}>
                Thu lai ngay
              </button>
              <button className={styles.secondaryBtn} onClick={() => navigate('/')}>
                Ve trang chu
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VnpayReturnPage;
