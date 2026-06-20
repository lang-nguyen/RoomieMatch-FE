import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Landmark, WalletCards, X } from 'lucide-react';
import {
  useGetLandlordPackageByIdQuery,
  usePurchaseLandlordPackageMutation,
} from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordPackagePaymentPage.module.css';

const PAYMENT_METHODS = [
  {
    value: 'card',
    label: 'Thẻ tín dụng hoặc ghi nợ',
    description: 'Visa, mastercard...',
    icon: CreditCard,
  },
  {
    value: 'bank',
    label: 'Ngân hàng',
    description: 'Vietcombank, agribank...',
    icon: Landmark,
  },
  {
    value: 'wallet',
    label: 'Ví điện tử',
    description: 'Momo, zalopay...',
    icon: WalletCards,
  },
];

const WALLET_OPTIONS = ['Momo', 'ZaloPay', 'VNPay Wallet'];
const BANK_OPTIONS = ['Vietcombank', 'Agribank', 'BIDV', 'Techcombank'];

const formatMoney = (value) => value.toLocaleString('vi-VN');
const formatCurrency = (value) => `${formatMoney(value)} VND`;

const makeQrCells = (seed) => {
  const size = 21;
  const cells = [];
  const isFinder = (row, col, startRow, startCol) =>
    row >= startRow && row < startRow + 7 && col >= startCol && col < startCol + 7;

  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      const inFinder =
        isFinder(row, col, 0, 0) ||
        isFinder(row, col, 0, size - 7) ||
        isFinder(row, col, size - 7, 0);
      const finderBorder =
        row === 0 || col === 0 || row === 6 || col === 6 ||
        row === size - 7 || col === size - 7 || row === size - 1 || col === size - 1;
      const finderCenter =
        isFinder(row, col, 2, 2) ||
        isFinder(row, col, 2, size - 5) ||
        isFinder(row, col, size - 5, 2);
      const hash = (row * 17 + col * 31 + seed.length * 13 + seed.charCodeAt((row + col) % seed.length)) % 7;
      cells.push(inFinder ? finderBorder || finderCenter : hash === 0 || hash === 2 || hash === 5);
    }
  }
  return cells;
};

const ResultDialog = ({ type, onClose, onRetry, onHome }) => {
  const isSuccess = type === 'success';

  return (
    <div className={styles.resultBackdrop} role="presentation" onClick={onClose}>
      <section className={styles.resultCard} onClick={(event) => event.stopPropagation()}>
        <div className={isSuccess ? styles.successIcon : styles.failIcon}>
          {isSuccess ? <Check size={40} strokeWidth={3} /> : <X size={40} strokeWidth={3} />}
        </div>
        <h2>{isSuccess ? 'Thành Công' : 'Rất tiếc'}</h2>
        <p>
          {isSuccess
            ? 'Yêu cầu của bạn đã được xử lý hoàn tất. Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi.'
            : 'Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng kiểm tra lại kết nối hoặc thông tin đầu vào.'}
        </p>
        {isSuccess ? (
          <button className={styles.successAction} onClick={onClose}>Quay lại mua gói</button>
        ) : (
          <div className={styles.resultActions}>
            <button onClick={onRetry}>Thử lại</button>
            <button onClick={onHome}>Trang chủ</button>
          </div>
        )}
      </section>
    </div>
  );
};

const LandlordPackagePaymentPage = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const { data, isLoading, isError } = useGetLandlordPackageByIdQuery({ packageId });
  const [purchasePackage, purchaseState] = usePurchaseLandlordPackageMutation();
  const [method, setMethod] = useState('wallet');
  const [detailOption, setDetailOption] = useState('Momo');
  const [result, setResult] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const pkg = data?.package;
  const orderId = useMemo(() => `LBD${String(180 + Number(packageId || 0)).padStart(3, '0')}`, [packageId]);
  const qrCells = useMemo(() => makeQrCells(`${orderId}-${pkg?.price || 0}`), [orderId, pkg?.price]);

  useEffect(() => {
    if (!showQr || !pkg) return undefined;

    const successTimer = window.setTimeout(() => {
      setResult('success');
    }, 3000);

    return () => window.clearTimeout(successTimer);
  }, [showQr, pkg]);

  useEffect(() => {
    if (result !== 'success' || !pkg) return undefined;

    const redirectTimer = window.setTimeout(() => {
      navigate('/landlord/packages', {
        state: {
          paymentSuccess: true,
          packageName: pkg.name,
        },
      });
    }, 1200);

    return () => window.clearTimeout(redirectTimer);
  }, [navigate, pkg, result]);

  if (isLoading) {
    return <div className={styles.loading}>Đang tải thông tin gói...</div>;
  }

  if (isError || !pkg) {
    return (
      <div className={styles.loading}>
        Không tìm thấy gói. <Link to="/landlord/packages">Quay lại danh sách gói</Link>
      </div>
    );
  }

  const options = method === 'bank' ? BANK_OPTIONS : WALLET_OPTIONS;

  const handleMethodChange = (nextMethod) => {
    setMethod(nextMethod);
    setDetailOption(nextMethod === 'bank' ? BANK_OPTIONS[0] : WALLET_OPTIONS[0]);
    setShowQr(nextMethod === 'bank');
    setResult(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await purchasePackage({
        packageId: pkg.id,
      }).unwrap();

      if (method === 'bank') return;
      setResult('success');
    } catch {
      setResult('failure');
    }
  };

  const handleCloseResult = () => {
    if (result === 'success') {
      navigate('/landlord/packages', {
        state: {
          paymentSuccess: true,
          packageName: pkg.name,
        },
      });
      return;
    }
    setResult(null);
  };

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        title="Thanh toán gói"
        subtitle="Kiểm tra lại thông tin gói và chọn phương thức thanh toán phù hợp"
      />

      <div className={styles.breadcrumb}>
        <Link to="/landlord/packages"><ArrowLeft size={14} /> Quay lại</Link>
        <span>Danh sách gói › Thanh toán › {pkg.name}</span>
      </div>

      {showQr ? (
        <section className={styles.qrOnlyCard}>
          <div className={styles.qrMeta}>
            <span><strong>Mã đơn hàng:</strong> {orderId}</span>
            <span><strong>Ngày:</strong> 31/2/2026</span>
            <span><strong>Tổng tiền:</strong> {formatMoney(pkg.price)}đ</span>
          </div>
          <h2>Mã QR thanh toán</h2>
          <div className={styles.qrBox} aria-label="Mã QR thanh toán">
            {qrCells.map((filled, index) => (
              <span key={index} className={filled ? styles.qrFilled : ''} />
            ))}
          </div>
          <strong>Quét mã để hoàn tất thanh toán</strong>
          <p>Đang chờ xác nhận chuyển khoản. Hệ thống mock sẽ xử lý sau 3 giây.</p>
          <button type="button" onClick={() => setShowQr(false)}>
            Đổi phương thức
          </button>
        </section>
      ) : (
        <div className={styles.checkoutGrid}>
          <form className={styles.paymentCard} onSubmit={handleSubmit}>
          <h2>Thông tin thanh toán</h2>

          <section className={styles.formSection}>
            <h3>Thông tin khách hàng</h3>
            <label>
              <span>Họ và tên</span>
              <input
                value={form.fullName}
                onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              />
            </label>
            <div className={styles.twoCols}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>
              <label>
                <span>Số điện thoại</span>
                <input
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
            </div>
          </section>

          <section className={styles.methodList}>
            {PAYMENT_METHODS.map((item) => {
              const Icon = item.icon;
              const active = method === item.value;
              return (
                <button
                  type="button"
                  key={item.value}
                  className={`${styles.methodItem} ${active ? styles.methodActive : ''}`}
                  onClick={() => handleMethodChange(item.value)}
                >
                  <Icon size={20} />
                  <span>
                    <strong>{item.label}</strong>
                    <small>{item.description}</small>
                  </span>
                  <em>{active ? '●' : ''}</em>
                </button>
              );
            })}
          </section>

          <section className={styles.formSection}>
            <h3>Chi tiết thanh toán</h3>
            {method === 'card' ? (
              <div className={styles.cardNotice}>
                Cổng thẻ đang được mô phỏng. Xác nhận sẽ tạo yêu cầu thanh toán thành công.
              </div>
            ) : (
              <label>
                <span>{method === 'bank' ? 'Chọn ngân hàng' : 'Chọn ví điện tử'}</span>
                <select value={detailOption} onChange={(event) => setDetailOption(event.target.value)}>
                  {options.map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            )}

          </section>

          <button className={styles.submitBtn} type="submit" disabled={purchaseState.isLoading}>
            {purchaseState.isLoading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
          </button>
          </form>

          <aside className={styles.summaryCard}>
          <h2>Tóm tắt đơn</h2>
          <div className={styles.packageSummary}>
            <span>Gói {pkg.name}</span>
            <strong>{formatMoney(pkg.price)}đ</strong>
            <em>{pkg.durationLabel}</em>
          </div>
          <h3>Bao gồm</h3>
          <ul>
            {pkg.features.filter((feature) => feature.included).map((feature) => (
              <li key={feature.label}>
                <Check size={16} />
                {feature.label}
              </li>
            ))}
          </ul>
          <div className={styles.totalRow}>
            <strong>Tổng cộng</strong>
            <span>{formatCurrency(pkg.price)}</span>
          </div>
          </aside>
        </div>
      )}

      {result ? (
        <ResultDialog
          type={result}
          onClose={handleCloseResult}
          onRetry={() => setResult(null)}
          onHome={() => navigate('/landlord/packages')}
        />
      ) : null}
    </div>
  );
};

export default LandlordPackagePaymentPage;
