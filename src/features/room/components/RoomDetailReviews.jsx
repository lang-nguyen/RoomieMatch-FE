const RoomDetailReviews = ({ rating, reviews }) => {
  return (
    <section className="room-detail-section">
      <h2 className="room-detail-section-title">Đánh giá</h2>
      <div className="room-detail-card room-detail-rating">
        <div className="room-detail-rating-score">
          <div className="room-detail-rating-value">{rating.overall}</div>
          <div className="room-detail-rating-max">/5</div>
          <div className="room-detail-rating-stars">★★★★★</div>
          <p className="room-detail-rating-count">Từ {rating.count} đánh giá</p>
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
        {reviews.map((review) => (
          <div key={review.id} className="room-detail-review">
            <div className="room-detail-review-header">
              <div className="room-detail-review-avatar">{review.name.slice(0, 1)}</div>
              <div>
                <p className="room-detail-review-name">{review.name}</p>
                <p className="room-detail-review-date">{review.date}</p>
              </div>
              <div className="room-detail-review-stars">{'★'.repeat(review.rating)}</div>
            </div>
            <p className="room-detail-review-text">{review.content}</p>
          </div>
        ))}
      </div>

      <div className="room-detail-review-form">
        <div className="room-detail-review-score">
          <span>Chấm điểm chủ phòng</span>
          <span>☆☆☆☆☆</span>
        </div>
        <div className="room-detail-review-score">
          <span>Chấm điểm vị trí</span>
          <span>☆☆☆☆☆</span>
        </div>
        <div className="room-detail-review-score">
          <span>Chấm điểm vệ sinh</span>
          <span>☆☆☆☆☆</span>
        </div>
        <div className="room-detail-review-score">
          <span>Chấm điểm giá cả</span>
          <span>☆☆☆☆☆</span>
        </div>
        <textarea placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ này..."></textarea>
        <button type="button" className="room-detail-submit">Gửi đánh giá →</button>
      </div>
    </section>
  );
};

export default RoomDetailReviews;
