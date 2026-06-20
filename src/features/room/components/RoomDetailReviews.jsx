import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetRoomReviewsQuery, useAddRoomReviewMutation, useEditRoomReviewMutation } from '../../homepage/api/postsApi';
import { selectCurrentUser } from '../../auth/slice';

const RoomDetailReviews = ({ rating, roomId }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetRoomReviewsQuery({ roomId, page, page_size: 10 });
  const [addReview, { isLoading: isAdding }] = useAddRoomReviewMutation();
  const [editReview, { isLoading: isEditing }] = useEditRoomReviewMutation();

  const user = useSelector(selectCurrentUser);
  const accountId = user?.account_id || user?.id;

  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    if (data?.items) {
      if (page === 1) {
        setReviewsList(data.items);
      } else {
        setReviewsList(prev => {
          const newItems = data.items.filter(item => !prev.some(p => p.id === item.id));
          return [...prev, ...newItems];
        });
      }
    }
  }, [data]);

  const totalPages = data?.total_pages || 1;
  const totalReviews = data?.total || 0;

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Vui lòng đăng nhập để đánh giá!");
      return;
    }

    try {
      if (editingReviewId) {
        await editReview({ roomId, reviewId: editingReviewId, rating: reviewRating, comment: reviewComment }).unwrap();
        setEditingReviewId(null);
      } else {
        await addReview({ roomId, rating: reviewRating, comment: reviewComment }).unwrap();
      }
      setReviewRating(5);
      setReviewComment('');
      // Quay về trang 1 để xem review mới
      setPage(1);
    } catch (err) {
      alert("Có lỗi xảy ra: " + (err.data?.message || err.message || "Unknown error"));
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setReviewRating(review.rating);
    setReviewComment(review.comment || '');
    // Scroll mượt tới form
    const formEl = document.querySelector('.room-detail-review-form');
    if (formEl) {
      window.scrollTo({ top: formEl.offsetTop - 100, behavior: 'smooth' });
    }
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setReviewRating(5);
    setReviewComment('');
  };

  const renderStars = (score) => {
    return (
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: star <= score ? '#fbbf24' : '#e5e7eb', fontSize: '18px' }}>
            ★
          </span>
        ))}
      </span>
    );
  };

  return (
    <section className="room-detail-section">
      <h2 className="room-detail-section-title">Đánh giá</h2>
      
      {/* Overview Rating block (giữ nguyên layout cũ, dùng mock trung bình vì BE chưa có) */}
      <div className="room-detail-card room-detail-rating">
        <div className="room-detail-rating-score">
          <div className="room-detail-rating-value">{rating.overall}</div>
          <div className="room-detail-rating-max">/5</div>
          <div className="room-detail-rating-stars" style={{ color: '#fbbf24', letterSpacing: '2px' }}>★★★★★</div>
          <p className="room-detail-rating-count">Từ {totalReviews > 0 ? totalReviews : rating.count} đánh giá</p>
        </div>
        <div className="room-detail-rating-bars">
          {rating.breakdown.map((item) => (
            <div key={item.label} className="room-detail-rating-row">
              <span>{item.label}</span>
              <div className="room-detail-rating-track">
                <div className="room-detail-rating-fill" style={{ width: `${(item.value / 5) * 100}%` }}></div>
              </div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="room-detail-review-list">
        {isLoading && page === 1 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Đang tải đánh giá...</p>
        ) : reviewsList.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>Chưa có đánh giá nào cho phòng này. Hãy là người đầu tiên đánh giá!</p>
        ) : (
          reviewsList.map((review) => {
            const reviewerName = review.reviewer?.display_name || 'Khách';
            const isMyReview = accountId && review.reviewer?.account_id === accountId;
            return (
              <div key={review.id} className="room-detail-review" style={{ position: 'relative' }}>
                <div className="room-detail-review-header">
                  <div className="room-detail-review-avatar">
                    {review.reviewer?.avatar_url ? (
                      <img src={review.reviewer.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      reviewerName.slice(0, 1).toUpperCase()
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="room-detail-review-name">{reviewerName}</p>
                    <p className="room-detail-review-date">{new Date(review.created_at).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="room-detail-review-stars">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <p className="room-detail-review-text" style={{ marginTop: '12px' }}>{review.comment}</p>
                {isMyReview && (
                  <button 
                    onClick={() => handleEditClick(review)}
                    style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: '13px', fontWeight: '500', padding: '4px 8px', borderRadius: '4px' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>
            );
          })
        )}
        
        {page < totalPages && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={isFetching}
              style={{ padding: '10px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '20px', cursor: 'pointer', fontWeight: '600', color: '#475569', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              {isFetching ? 'Đang tải...' : 'Xem thêm đánh giá'}
            </button>
          </div>
        )}
      </div>

      <form className="room-detail-review-form" onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
          {editingReviewId ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá của bạn'}
        </h3>
        <div className="room-detail-review-score" style={{ justifyContent: 'flex-start', gap: '16px', marginBottom: '20px' }}>
          <span style={{ fontWeight: '600', color: '#334155' }}>Chất lượng phòng</span>
          <div style={{ display: 'flex', gap: '4px', cursor: 'pointer' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span 
                key={star} 
                onClick={() => setReviewRating(star)}
                style={{ color: star <= reviewRating ? '#fbbf24' : '#e5e7eb', fontSize: '28px', userSelect: 'none', transition: 'transform 0.1s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <textarea 
          placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..." 
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          required
        ></textarea>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button type="submit" className="room-detail-submit" disabled={isAdding || isEditing} style={{ flex: 1 }}>
            {isAdding || isEditing ? 'Đang gửi...' : (editingReviewId ? 'Cập nhật đánh giá' : 'Gửi đánh giá →')}
          </button>
          {editingReviewId && (
            <button type="button" onClick={handleCancelEdit} style={{ padding: '12px 24px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#475569' }}>
              Hủy
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default RoomDetailReviews;
