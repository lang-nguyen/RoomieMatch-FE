import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Package, X } from 'lucide-react';
import {
  useGetLandlordPackageUsageDetailQuery,
  useRenewLandlordPackageMutation,
} from '../../features/landlord/api/landlordApi';
import PackageUsageBar from '../../features/landlord/components/PackageUsageBar';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordPackageDetailPage.module.css';

const formatMoney = (value) => `${value.toLocaleString('vi-VN')} VND`;
const formatDate = (value) => new Intl.DateTimeFormat('vi-VN').format(new Date(value));
const getStatusLabel = (status) => {
  if (status === 'active') return 'Dang kich hoat';
  if (status === 'pending') return 'Dang cho xac nhan';
  if (status === 'failed') return 'Thanh toan that bai';
  if (status === 'cancelled') return 'Da huy';
  return status;
};

const percent = (value, limit) => {
  if (!limit) return 32;
  return Math.min(100, (value / limit) * 100);
};

const LandlordPackageDetailPage = () => {
  const { invoiceId } = useParams();
  const { data, isLoading } = useGetLandlordPackageUsageDetailQuery({ id: invoiceId });
  const [renewPackage, renewState] = useRenewLandlordPackageMutation();
  const detail = data?.detail;

  if (isLoading || !detail) {
    return <div className={styles.loading}>Dang tai chi tiet goi...</div>;
  }

  const handleRenew = async () => {
    await renewPackage({ packageId: detail.packageId }).unwrap();
  };

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        icon={Package}
        title="Chi tiet goi"
        subtitle={`Theo doi quyen loi va muc su dung cua don #${detail.id}`}
      />

      <div className={styles.breadcrumb}>
        <Link to="/landlord/package-management"><ArrowLeft size={14} /> Quay lai</Link>
        <span>Quan ly goi › Chi tiet goi #{detail.id}</span>
      </div>

      <div className={styles.contentGrid}>
        <aside className={styles.planColumn}>
          <section className={styles.planCard}>
            <span>Goi dang dung</span>
            <strong>{detail.packageName}</strong>
            <p>{formatMoney(detail.price)} / thang</p>
            <dl>
              <div>
                <dt>Ngay mua</dt>
                <dd>{formatDate(detail.purchaseDate)}</dd>
              </div>
              <div>
                <dt>Het han</dt>
                <dd>{formatDate(detail.expiredDate)}</dd>
              </div>
            </dl>
            <em>{getStatusLabel(detail.status)}</em>
          </section>

          <dl className={styles.invoice}>
            <div><dt>Ma don</dt><dd>#{detail.id}</dd></div>
            <div><dt>Chu ky</dt><dd>{detail.period}</dd></div>
            <div><dt>Tu gia han</dt><dd className={styles.dangerText}>Tat</dd></div>
            <div><dt>Phuong thuc TT</dt><dd>{detail.paymentMethod}</dd></div>
          </dl>

          <section className={styles.benefits}>
            <h2>Quyen loi goi</h2>
            {detail.benefits.map((benefit) => (
              <div key={benefit.label} className={benefit.included ? styles.good : styles.bad}>
                {benefit.included ? <Check size={12} /> : <X size={12} />}
                <span>{benefit.label}</span>
              </div>
            ))}
          </section>

          <button className={styles.renewBtn} onClick={handleRenew} disabled={renewState.isLoading}>
            {renewState.isLoading ? 'Dang gia han...' : 'Gia han goi nay'}
          </button>
          <Link className={styles.upgradeText} to="/landlord/packages">Nang cap len Pro</Link>
        </aside>

        <main className={styles.detailColumn}>
          <section className={styles.overview}>
            <h2>Tong quan su dung</h2>
            <div className={styles.overviewGrid}>
              <div>
                <span>Bai da dang</span>
                <strong className={styles.green}>{detail.postsUsed}</strong>
                <small>/ {detail.postsLimit || 0}</small>
              </div>
              <div>
                <span>Luot day tin da dung</span>
                <strong className={styles.orange}>{detail.boostUsed} / {detail.boostLimit}</strong>
                <small>con {detail.boostRemaining ?? Math.max(0, detail.boostLimit - detail.boostUsed)} luot</small>
              </div>
              <div>
                <span>Luot xem phong</span>
                <strong>{detail.roomViews.toLocaleString('vi-VN')}</strong>
                <small>trong ky goi</small>
              </div>
            </div>
          </section>

          <section className={styles.usage}>
            <h2>Chi tiet su dung tinh nang</h2>
            <PackageUsageBar
              label="Bai dang dang hoat dong"
              valueText={`${detail.activePosts} / ${detail.postsLimit || 0}`}
              percent={percent(detail.activePosts, detail.postsLimit)}
              tone="green"
            />
            <PackageUsageBar
              label="Luot day tin noi bat"
              valueText={`${detail.boostUsed} / ${detail.boostLimit} luot`}
              percent={percent(detail.boostUsed, detail.boostLimit)}
              tone="orange"
            />
            <PackageUsageBar
              label="Anh tai len (thang nay)"
              valueText={`${detail.photoUsed} / ${detail.photoLimit} anh`}
              percent={percent(detail.photoUsed, detail.photoLimit)}
              tone="blue"
            />
            <PackageUsageBar
              label="Thoi gian goi con lai"
              valueText={detail.remainingDays === null ? 'Khong gioi han' : `${detail.remainingDays} ngay`}
              percent={detail.remainingDays === null ? 100 : Math.min(100, (detail.remainingDays / 30) * 100)}
              tone={detail.remainingDays > 0 || detail.remainingDays === null ? 'green' : 'red'}
            />
          </section>

          <section className={styles.timeline}>
            <h2>Lich trinh goi</h2>
            {detail.timeline.map((item) => (
              <div key={item.id} className={styles.timelineItem}>
                <span className={`${styles.dot} ${styles[item.tone]}`} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </section>

          <section className={styles.upgradeBox}>
            <div>
              <h2>Gia han de tiep tuc quyen loi</h2>
              <p>Giu quyen dang bai, day tin noi bat va hieu {detail.packageName} cho phong tro.</p>
              <div className={styles.chips}>
                <span>{detail.packageName} dang dung</span>
                <span>{detail.packageName} — {detail.price.toLocaleString('vi-VN')}d/thang</span>
              </div>
            </div>
            <Link to={`/landlord/packages/${detail.packageId}/payment`}>Gia han ngay</Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandlordPackageDetailPage;
