import React, { useMemo } from 'react';
import { Search, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCancelRentalRequestMutation, useGetMyRentalRequestsQuery, useGetRentalHistoryQuery } from '../api/userApi';
import styles from './RentalHistory.module.css';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';

const RentalHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetRentalHistoryQuery();
  const { data: requestData } = useGetMyRentalRequestsQuery();
  const [cancelRequest, cancelState] = useCancelRentalRequestMutation();

  const rentals = data?.items || [];

  // Navigate đến trang chi tiết bài đăng, scroll xuống phần đánh giá
  const handleReview = (rental) => {
    const postId = rental.post_id;
    if (postId) {
      navigate(`/room/${postId}#reviews`);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredRentals = useMemo(() => {
    let result = [...rentals];
    if (searchTerm) {
      result = result.filter(r => (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      result = result.filter(r => {
        const status = (r.rental_status || r.status || '').toLowerCase();
        const isActive = status.includes('active') || status.includes('đang thuê');
        if (statusFilter === 'active') return isActive;
        if (statusFilter === 'completed') return !isActive;
        return true;
      });
    }
    return result;
  }, [rentals, searchTerm, statusFilter]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Lịch sử thuê phòng</h1>
      </div>

      {/* Pending rental requests */}
      {(requestData?.items || []).some((item) => item.status === 'pending') && (
        <div className={styles.rentalsList}>
          <h2>Yêu cầu đang chờ chủ trọ xác nhận</h2>
          {requestData.items.filter((item) => item.status === 'pending').map((request) => (
            <div key={request.id} className={styles.card}>
              <div className={styles.content}>
                <h3 className={styles.title}>{request.room_title}</h3>
                <p>Ngày bắt đầu: {request.start_date}</p>
                <p>{request.note || 'Không có ghi chú'}</p>
              </div>
              <div className={styles.actions}>
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  disabled={cancelState.isLoading}
                  onClick={() => cancelRequest({ id: request.id })}
                >
                  Hủy yêu cầu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search + filter bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select className={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="active">Đang thuê</option>
          <option value="completed">Đã trả phòng</option>
        </select>
      </div>

      {isLoading ? (
        <div>Đang tải lịch sử thuê phòng...</div>
      ) : isError ? (
        <div>Đã có lỗi xảy ra khi tải dữ liệu.</div>
      ) : (
        <div className={styles.rentalsList}>
          {filteredRentals.map(rental => {
            // Lấy ảnh từ API hoặc fallback
            const thumbUrl = rental.thumbnail || rental.image || FALLBACK_IMAGE;
            const rentalStatus = rental.rental_status || rental.status || '';
            const isActive = rentalStatus.toLowerCase().includes('active') || rentalStatus.includes('Đang thuê');

            return (
              <div key={rental.rental_id || rental.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={thumbUrl}
                    alt={rental.title}
                    className={styles.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>

                <div className={styles.content}>
                  <h3 className={styles.title}>{rental.title}</h3>

                  <div className={styles.details}>
                    <div className={styles.timeLabel}>Thời gian thuê:</div>
                    <div className={styles.timeValue}>
                      {rental.start_date} {rental.end_date ? `- ${rental.end_date}` : '(đang thuê)'}
                    </div>
                  </div>

                  <div className={`${styles.statusTag} ${isActive ? styles.statusActive : styles.statusCompleted}`}>
                    {rentalStatus || (isActive ? 'Đang thuê' : 'Đã trả phòng')}
                  </div>
                </div>

                <div className={styles.actions}>
                  {rental.my_rating ? (
                    /* Đã đánh giá rồi – hiển thị sao */
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá của bạn</div>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} style={{ color: star <= rental.my_rating ? '#fbbf24' : '#e5e7eb', fontSize: '20px', lineHeight: '1' }}>★</span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Chưa đánh giá – navigate sang trang chi tiết */
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      disabled={!rental.can_review}
                      onClick={() => handleReview(rental)}
                      title={rental.can_review ? 'Đánh giá phòng này' : 'Chỉ có thể đánh giá phòng đã xác nhận thuê'}
                    >
                      <Star className={styles.btnIcon} />
                      Đánh giá
                      <ExternalLink size={13} style={{ marginLeft: 4 }} />
                    </button>
                  )}

                  {/* Nút xem chi tiết */}
                  {rental.post_id && (
                    <button
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => navigate(`/room/${rental.post_id}`)}
                    >
                      Xem bài đăng
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {filteredRentals.length === 0 && rentals.length > 0 && (
            <div>Không tìm thấy lịch sử phù hợp với bộ lọc.</div>
          )}
          {rentals.length === 0 && (
            <div>Chưa có lịch sử thuê phòng.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
