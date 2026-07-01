import { useState } from 'react';
import { CalendarDays, Check, Clock3, Mail, MapPin, Phone, Search, User, X } from 'lucide-react';
import { useDecideLandlordRentalRequestMutation, useGetLandlordRentalRequestsQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import { getApiErrorMessage } from '../../shared/utils/getApiErrorMessage';
import sharedStyles from './LandlordPageShared.module.css';
import styles from './LandlordRentalRequestsPage.module.css';

const LandlordRentalRequestsPage = () => {
  const [status, setStatus] = useState('pending');
  const [search, setSearch] = useState('');
  const { data, isLoading } = useGetLandlordRentalRequestsQuery({ status, search });
  const [decide, decisionState] = useDecideLandlordRentalRequestMutation();
  const [message, setMessage] = useState('');
  const items = data?.items || [];

  const statusOptions = [
    { value: 'pending', label: 'Cho xu ly' },
    { value: 'accepted', label: 'Da chap nhan' },
    { value: 'rejected', label: 'Da tu choi' },
    { value: 'cancelled', label: 'Da huy' },
  ];

  const statusLabels = {
    pending: 'Cho xu ly',
    accepted: 'Da chap nhan',
    rejected: 'Da tu choi',
    cancelled: 'Da huy',
  };

  const formatDate = (value) => {
    if (!value) return 'Chua cap nhat';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Chua cap nhat' : date.toLocaleDateString('vi-VN');
  };

  const profileFacts = (request) => ([
    { label: 'Dien thoai', value: request.tenant_phone, icon: Phone },
    { label: 'Email', value: request.tenant_email, icon: Mail },
    { label: 'Gioi tinh', value: request.tenant_gender, icon: User },
    { label: 'Ngay sinh', value: request.tenant_date_of_birth ? formatDate(request.tenant_date_of_birth) : null, icon: CalendarDays },
    { label: 'Dia chi', value: request.tenant_address, icon: MapPin },
    { label: 'Que quan', value: request.tenant_hometown, icon: MapPin },
    { label: 'Facebook', value: request.tenant_facebook, icon: Mail },
    { label: 'Instagram', value: request.tenant_instagram, icon: Mail },
    { label: 'Twitter', value: request.tenant_twitter, icon: Mail },
  ].filter((item) => item.value));

  const handleDecision = async (request, decision) => {
    const reason = decision === 'rejected' ? window.prompt('Ly do tu choi (khong bat buoc):') : null;
    try {
      await decide({ id: request.id, decision, reason }).unwrap();
      setMessage(decision === 'accepted' ? 'Da xac nhan thue. Bai dang da tu dong dong.' : 'Da tu choi yeu cau.');
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Khong the xu ly yeu cau.'));
    }
  };

  return (
    <div className={sharedStyles.page}>
      <LandlordPageHeader title="Yeu cau xac nhan thue" subtitle="Doi chieu thong tin khach va xac nhan nguoi dang thue phong" />

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

      <div className={styles.searchBox}>
        <Search size={16} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Tim theo ten khach, so dien thoai, ten phong, ma phong hoac ma bai..."
        />
      </div>

      {message && <div className={styles.notice}>{message}</div>}

      {isLoading ? (
        <div className={styles.emptyState}>Dang tai yeu cau thue...</div>
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
                    <p>
                      {request.room_title || `Bai dang #${request.post_id}`}
                      {' · '}
                      {request.room_code || `Phong #${request.room_id}`}
                    </p>
                  </div>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status_${request.status}`] || ''}`}>
                  <Clock3 size={14} />
                  {statusLabels[request.status] || request.status}
                </span>
              </div>

              <div className={styles.contentGrid}>
                <section className={styles.panel}>
                  <h4>Thong tin thue</h4>
                  <div className={styles.factGrid}>
                    <div className={styles.factItem}>
                      <span>Ngay bat dau</span>
                      <strong>{formatDate(request.start_date)}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Ma bai dang</span>
                      <strong>{request.post_code || `#${request.post_id}`}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Ma phong</span>
                      <strong>{request.room_code || `#${request.room_id}`}</strong>
                    </div>
                    <div className={styles.factItem}>
                      <span>Thoi diem gui</span>
                      <strong>{formatDate(request.created_at)}</strong>
                    </div>
                  </div>
                  <div className={styles.noteBox}>
                    <span>Ghi chu tu khach thue</span>
                    <p>{request.note || 'Khach thue chua de lai ghi chu.'}</p>
                  </div>
                  {request.decision_reason && (
                    <div className={styles.noteBox}>
                      <span>Ly do xu ly</span>
                      <p>{request.decision_reason}</p>
                    </div>
                  )}
                </section>

                <section className={styles.panel}>
                  <h4>Ho so khach thue</h4>
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
                    <div className={styles.placeholderCard}>Khach thue chua cap nhat them ho so ca nhan.</div>
                  )}

                  <div className={styles.noteBox}>
                    <span>Gioi thieu</span>
                    <p>{request.tenant_bio || 'Chua co mo ta ca nhan.'}</p>
                  </div>

                  <div className={styles.helperText}>
                    Tim kiem ho tro ten, so dien thoai, ten phong va ma phong/ma bai neu co.
                  </div>
                </section>
              </div>

              {request.status === 'pending' && (
                <div className={styles.actions}>
                  <button className={styles.primaryBtn} disabled={decisionState.isLoading} onClick={() => handleDecision(request, 'accepted')}>
                    <Check size={16} />
                    Xac nhan thue
                  </button>
                  <button className={styles.secondaryBtn} disabled={decisionState.isLoading} onClick={() => handleDecision(request, 'rejected')}>
                    <X size={16} />
                    Tu choi
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {!isLoading && !items.length && (
        <div className={styles.emptyState}>
          {search
            ? 'Khong tim thay yeu cau nao phu hop voi tu khoa hien tai.'
            : status === 'pending'
              ? 'Chua co yeu cau thue nao dang cho xu ly.'
              : 'Khong co yeu cau phu hop voi bo loc hien tai.'}
        </div>
      )}
    </div>
  );
};

export default LandlordRentalRequestsPage;
