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
    return <div className={styles.loading}>Đang tải chi tiết gói...</div>;
  }

  const handleRenew = async () => {
    await renewPackage({ packageId: detail.packageId }).unwrap();
  };

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        icon={Package}
        title="Chi tiết gói"
        subtitle={`Theo dõi quyền lợi và mức sử dụng của đơn #${detail.id}`}
      />

      <div className={styles.breadcrumb}>
        <Link to="/landlord/package-management"><ArrowLeft size={14} /> Quay lại</Link>
        <span>Quản lý gói › Chi tiết gói #{detail.id}</span>
      </div>

      <div className={styles.contentGrid}>
        <aside className={styles.planColumn}>
          <section className={styles.planCard}>
            <span>Gói đang dùng</span>
            <strong>{detail.packageName}</strong>
            <p>{formatMoney(detail.price)} / tháng</p>
            <dl>
              <div>
                <dt>Ngày mua</dt>
                <dd>{formatDate(detail.purchaseDate)}</dd>
              </div>
              <div>
                <dt>Hết hạn</dt>
                <dd>{formatDate(detail.expiredDate)}</dd>
              </div>
            </dl>
            <em>{detail.status === 'active' ? 'Đang kích hoạt' : detail.status}</em>
          </section>

          <dl className={styles.invoice}>
            <div><dt>Mã đơn</dt><dd>#{detail.id}</dd></div>
            <div><dt>Chu kỳ</dt><dd>{detail.period}</dd></div>
            <div><dt>Tự gia hạn</dt><dd className={styles.dangerText}>Tắt</dd></div>
            <div><dt>Phương thức TT</dt><dd>{detail.paymentMethod}</dd></div>
          </dl>

          <section className={styles.benefits}>
            <h2>Quyền lợi gói</h2>
            {detail.benefits.map((benefit) => (
              <div key={benefit.label} className={benefit.included ? styles.good : styles.bad}>
                {benefit.included ? <Check size={12} /> : <X size={12} />}
                <span>{benefit.label}</span>
              </div>
            ))}
          </section>

          <button className={styles.renewBtn} onClick={handleRenew} disabled={renewState.isLoading}>
            {renewState.isLoading ? 'Đang gia hạn...' : 'Gia hạn gói này'}
          </button>
          <Link className={styles.upgradeText} to="/landlord/packages">Nâng cấp lên Pro</Link>
        </aside>

        <main className={styles.detailColumn}>
          <section className={styles.overview}>
            <h2>Tổng quan sử dụng</h2>
            <div className={styles.overviewGrid}>
              <div>
                <span>Bài đã đăng</span>
                <strong className={styles.green}>{detail.postsUsed}</strong>
                <small>/ {detail.postsLimit || 0}</small>
              </div>
              <div>
                <span>Lượt đẩy tin đã dùng</span>
                <strong className={styles.orange}>{detail.boostUsed} / {detail.boostLimit}</strong>
                <small>còn {detail.boostRemaining ?? Math.max(0, detail.boostLimit - detail.boostUsed)} lượt</small>
              </div>
              <div>
                <span>Lượt xem phòng</span>
                <strong>{detail.roomViews.toLocaleString('vi-VN')}</strong>
                <small>trong kỳ gói</small>
              </div>
            </div>
          </section>

          <section className={styles.usage}>
            <h2>Chi tiết sử dụng tính năng</h2>
            <PackageUsageBar
              label="Bài đăng đang hoạt động"
              valueText={`${detail.activePosts} / ${detail.postsLimit || 0}`}
              percent={percent(detail.activePosts, detail.postsLimit)}
              tone="green"
            />
            <PackageUsageBar
              label="Lượt đẩy tin nổi bật"
              valueText={`${detail.boostUsed} / ${detail.boostLimit} lượt`}
              percent={percent(detail.boostUsed, detail.boostLimit)}
              tone="orange"
            />
            <PackageUsageBar
              label="Ảnh tải lên (tháng này)"
              valueText={`${detail.photoUsed} / ${detail.photoLimit} ảnh`}
              percent={percent(detail.photoUsed, detail.photoLimit)}
              tone="blue"
            />
            <PackageUsageBar
              label="Thời gian gói còn lại"
              valueText={detail.remainingDays === null ? 'Không giới hạn' : `${detail.remainingDays} ngày`}
              percent={detail.remainingDays === null ? 100 : Math.min(100, (detail.remainingDays / 30) * 100)}
              tone={detail.remainingDays > 0 || detail.remainingDays === null ? 'green' : 'red'}
            />
          </section>

          <section className={styles.timeline}>
            <h2>Lịch trình gói</h2>
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
              <h2>Gia hạn để tiếp tục quyền lợi</h2>
              <p>Giữ quyền đăng bài, đẩy tin nổi bật và huy hiệu {detail.packageName} cho phòng trọ.</p>
              <div className={styles.chips}>
                <span>{detail.packageName} đang dùng</span>
                <span>{detail.packageName} — {detail.price.toLocaleString('vi-VN')}đ/tháng</span>
              </div>
            </div>
            <Link to={`/landlord/packages/${detail.packageId}/payment`}>Gia hạn ngay</Link>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandlordPackageDetailPage;
