import { useState } from 'react';
import { CalendarDays, Check, Clock3, Mail, MapPin, Phone, User, X } from 'lucide-react';
import { useDecideLandlordRentalRequestMutation, useGetLandlordRentalRequestsQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import { getApiErrorMessage } from '../../shared/utils/getApiErrorMessage';
import sharedStyles from './LandlordPageShared.module.css';
import styles from './LandlordRentalRequestsPage.module.css';

const LandlordRentalRequestsPage = () => {
  const [status, setStatus] = useState('pending');
  const { data, isLoading } = useGetLandlordRentalRequestsQuery({ status });
  const [decide, decisionState] = useDecideLandlordRentalRequestMutation();
  const [message, setMessage] = useState('');
  const items = data?.items || [];

  const statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'accepted', label: 'Đã chấp nhận' },
    { value: 'rejected', label: 'Đã từ chối' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const statusLabels = {
    pending: 'Chờ xử lý',
    accepted: 'Đã chấp nhận',
    rejected: 'Đã từ chối',
    cancelled: 'Đã hủy',
  };

  const formatDate = (value) => {
    if (!value) return 'Chưa cập nhật';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chưa cập nhật' : date.toLocaleDateString('vi-VN');
  };

  const profileFacts = (request) => ([
    { label: 'Điện thoại', value: request.tenant_phone, icon: Phone },
    { label: 'Email', value: request.tenant_email, icon: Mail },
    { label: 'Giới tính', value: request.tenant_gender, icon: User },
    { label: 'Ngày sinh', value: request.tenant_date_of_birth ? formatDate(request.tenant_date_of_birth) : null, icon: CalendarDays },
    { label: 'Địa chỉ', value: request.tenant_address, icon: MapPin },
    { label: 'Quê quán', value: request.tenant_hometown, icon: MapPin },
    { label: 'Facebook', value: request.tenant_facebook, icon: Mail },
    { label: 'Instagram', value: request.tenant_instagram, icon: Mail },
    { label: 'Twitter', value: request.tenant_twitter, icon: Mail },
  ].filter((item) => item.value));

  const handleDecision = async (request, decision) => {
    const reason = decision === 'rejected' ? window.prompt('Lý do từ chối (không bắt buộc):') : null;
    try {
      await decide({ id: request.id, decision, reason }).unwrap();
      setMessage(decision === 'accepted' ? 'Đã xác nhận thuê. Bài đăng đã tự động đóng.' : 'Đã từ chối yêu cầu.');
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Không thể xử lý yêu cầu.'));
    }
  };

  return (
    <div className={sharedStyles.page}>
      <LandlordPageHeader title="Yêu cầu xác nhận thuê" subtitle="Đối chiếu thông tin khách và xác nhận người đang thuê phòng" />

      <div className={styles.toolbar}>
        {statusOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`${styles.filterChip} ${status === item.value ? styles.filterActive : ''}`}
            onClick={() => setStatus(item.value)}
            disabled={status === item.value}
          >
            {item.label}
          </button>
        ))}
      </div>

      {message && <div className={styles.notice}>{message}</div>}

      {isLoading ? (
        <div className={styles.emptyState}>Đang tải yêu cầu thuê...</div>
      ) : (
        <div className={styles.requestList}>
          {items.map((request) => (
            <article key={request.id} className={styles.requestCard}>
              <div className={styles.requestHead}>
                <div className={styles.tenantSummary}>
                  <div className={styles.avatar}>
                    {request.tenant_avatar_url ? (
                      <img src={request.tenant_avatar_url} alt={request.tenant_name} />
                    ) : (
                      request.tenant_name?.charAt(0)?.toUpperCase() || 'K'
                    )}
                  </div>
                  <div>
                    <h3>{request.tenant_name}</h3>
                    <p>{request.room_title || `Bài đăng #${request.post_id}`}</p>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${request.status}`] || ''}`}>
                  <Clock3 size={14} />
                  {statusLabels[request.status] || request.status}
                </span>
              </div>

              <div className={styles.contentGrid}>
                <section className={styles.panel}>
                  <h4>Thông tin thuê</h4>
                  <div className={styles.factGrid}>
                    <div className={styles.factItem}>
                      <span>Ngày bắt đầu</span>
                      <strong>{formatDate(request.start_date)}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Mã bài đăng</span>
                      <strong>#{request.post_id}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Mã phòng</span>
                      <strong>#{request.room_id}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Thời điểm gửi</span>
                      <strong>{formatDate(request.created_at)}</strong>
                    </div>
                  </div>
                  <div className={styles.noteBox}>
                    <span>Ghi chú từ khách thuê</span>
                    <p>{request.note || 'Khách thuê chưa để lại ghi chú.'}</p>
                  </div>
                  {request.decision_reason && (
                    <div className={styles.noteBox}>
                      <span>Lý do xử lý</span>
                      <p>{request.decision_reason}</p>
                    </div>
                  )}
                </section>

                <section className={styles.panel}>
                  <h4>Hồ sơ khách thuê</h4>
                  {profileFacts(request).length ? (
                    <div className={styles.profileGrid}>
                      {profileFacts(request).map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className={styles.profileItem}>
                            <span className={styles.profileIcon}><Icon size={14} /></span>
                            <div>
                              <small>{item.label}</small>
                              <strong>{item.value}</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className={styles.placeholderCard}>Khách thuê chưa cập nhật thêm hồ sơ cá nhân.</div>
                  )}

                  <div className={styles.noteBox}>
                    <span>Giới thiệu</span>
                    <p>{request.tenant_bio || 'Chưa có mô tả cá nhân.'}</p>
                  </div>

                  <div className={styles.helperText}>
                    CCCD hiện chỉ hiển thị khi hệ thống có lưu trường này trong hồ sơ tenant.
                  </div>
                </section>
              </div>

              {request.status === 'pending' && (
                <div className={styles.actions}>
                  <button className={styles.primaryBtn} disabled={decisionState.isLoading} onClick={() => handleDecision(request, 'accepted')}>
                    <Check size={16} />
                    Xác nhận thuê
                  </button>
                  <button className={styles.secondaryBtn} disabled={decisionState.isLoading} onClick={() => handleDecision(request, 'rejected')}>
                    <X size={16} />
                    Từ chối
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!isLoading && !items.length && (
        <div className={styles.emptyState}>
          {status === 'pending' ? 'Chưa có yêu cầu thuê nào đang chờ xử lý.' : 'Không có yêu cầu phù hợp với bộ lọc hiện tại.'}
        </div>
      )}
    </div>
  );
};

export default LandlordRentalRequestsPage;
