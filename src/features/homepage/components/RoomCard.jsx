import React from 'react';
import '../Homepage.css';

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image-container">
        <img src={room.image} alt={room.title} className="room-image" />
        <div className="image-gradient"></div>
        
        {room.verified && (
          <div className="badge-verified">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Đã xác minh
          </div>
        )}
        
        <button className="wishlist-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        
        <div className="price-overlay">
          <span className="price-amount">{new Intl.NumberFormat('vi-VN').format(room.price)}</span>
          <span className="price-unit"> VNĐ/tháng</span>
        </div>
      </div>
      
      <div className="room-info">
        <div className="room-meta-top">
          <span className="room-type-tag">{room.type.toUpperCase()}</span>
          <span className="time-ago">{room.timeAgo}</span>
        </div>

        <h3 className="room-title">{room.title}</h3>
        
        <div className="room-location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>{room.ward}, {room.district}</span>
        </div>
        
        <div className="room-divider"></div>

        <div className="room-tags">
          <div className="tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle></svg>
            <span>{room.area}m²</span>
          </div>
          <div className="tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path></svg>
            <span>{room.bedrooms} Ngủ</span>
          </div>
          <div className="tag-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D45B13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span>{room.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
