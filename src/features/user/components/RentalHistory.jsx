import React, { useState } from 'react';
import { Search, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCancelRentalRequestMutation, useGetMyRentalRequestsQuery, useGetRentalHistoryQuery } from '../api/userApi';
import { useAddRoomReviewMutation } from '../../homepage/api/postsApi';
import styles from './RentalHistory.module.css';
import temptImage from '../../../assets/tempt.jpg';

const RentalHistory = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetRentalHistoryQuery();
  const { data: requestData } = useGetMyRentalRequestsQuery();
  const [cancelRequest, cancelState] = useCancelRentalRequestMutation();
  const [addReview, reviewState] = useAddRoomReviewMutation();
  const [reviewModal, setReviewModal] = useState({ isOpen: false, roomId: null, rating: 5, comment: '', error: '' });

  const rentals = data?.items || [];
  const handleReview = (rental) => {
    setReviewModal({ isOpen: true, roomId: rental.room_id, rating: 5, comment: '', error: '' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewModal(prev => ({ ...prev, error: '' }));
    try {
      await addReview({ roomId: reviewModal.roomId, rating: reviewModal.rating, comment: reviewModal.comment }).unwrap();
      setReviewModal({ isOpen: false, roomId: null, rating: 5, comment: '', error: '' });
      refetch();
    } catch (err) {
      const status = err?.status;
      const detail = err?.data?.detail || '';
      if (status === 409 || detail.toLowerCase().includes('already')) {
        setReviewModal(prev => ({ ...prev, error: 'Bạn đã đánh giá phòng này rồi.' }));
      } else {
        setReviewModal(prev => ({ ...prev, error: detail || 'Có lỗi xảy ra khi gửi đánh giá.' }));
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Lịch sử thuê phòng</h1>
      </div>

      {(requestData?.items || []).some((item) => item.status === 'pending') && (
        <div className={styles.rentalsList}>
          <h2>Yêu cầu đang chờ chủ trọ xác nhận</h2>
          {requestData.items.filter((item) => item.status === 'pending').map((request) => (
            <div key={request.id} className={styles.card}>
              <div className={styles.content}><h3 className={styles.title}>{request.room_title}</h3><p>Ngày bắt đầu: {request.start_date}</p><p>{request.note || 'Không có ghi chú'}</p></div>
              <div className={styles.actions}><button className={`${styles.btn} ${styles.btnSecondary}`} disabled={cancelState.isLoading} onClick={() => cancelRequest({ id: request.id })}>Hủy yêu cầu</button></div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề..."
            className={styles.searchInput}
          />
        </div>

        <select className={styles.filterSelect}>
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
          {rentals.map(rental => (
            <div key={rental.rental_id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={rental.image || temptImage}
                  alt={rental.title}
                  className={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = temptImage;
                  }}
                />
              </div>

              <div className={styles.content}>
                <h3 className={styles.title}>{rental.title}</h3>

                <div className={styles.details}>
                  <div className={styles.timeLabel}>Thời gian thuê:</div>
                  <div className={styles.timeValue}>
                    {rental.start_date} - {rental.end_date}
                  </div>
                </div>

                <div className={`${styles.statusTag} ${rental.status === 'Đang thuê' ? styles.statusActive : styles.statusCompleted}`}>
                  {rental.rental_status}
                </div>
              </div>

              <div className={styles.actions}>
                {rental.my_rating ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Đánh giá của bạn</div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} style={{ color: star <= rental.my_rating ? '#fbbf24' : '#e5e7eb', fontSize: '20px', lineHeight: '1' }}>★</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button className={`${styles.btn} ${styles.btnPrimary}`} disabled={!rental.can_review || reviewState.isLoading} onClick={() => handleReview(rental)}>
                    <Star className={styles.btnIcon} />
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          ))}
          {rentals.length === 0 && <div>Chưa có lịch sử thuê phòng.</div>}
        </div>
      )}

      {reviewModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setReviewModal(prev => ({ ...prev, isOpen: false }))}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', width: '90%', maxWidth: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setReviewModal(prev => ({ ...prev, isOpen: false }))} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
            <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px', color: '#1e293b' }}>Đánh giá phòng trọ</h2>
            <form onSubmit={handleSubmitReview}>
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#475569', fontSize: '15px' }}>Chất lượng phòng</label>
                <div style={{ display: 'flex', gap: '8px', cursor: 'pointer', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setReviewModal(prev => ({ ...prev, rating: star }))}
                      style={{ color: star <= reviewModal.rating ? '#fbbf24' : '#e5e7eb', fontSize: '48px', userSelect: 'none', transition: 'transform 0.1s', lineHeight: '1' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#475569', fontSize: '14px' }}>Nhận xét</label>
                <textarea
                  required
                  value={reviewModal.comment}
                  onChange={(e) => setReviewModal(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                  style={{ width: '100%', minHeight: '100px', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>
              {reviewModal.error && (
                <div style={{ padding: '12px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                  {reviewModal.error}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setReviewModal(prev => ({ ...prev, isOpen: false }))} style={{ padding: '10px 16px', border: '1px solid #cbd5e1', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>Hủy</button>
                <button type="submit" disabled={reviewState.isLoading} style={{ padding: '10px 16px', border: 'none', backgroundColor: '#c1440e', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  {reviewState.isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalHistory;
