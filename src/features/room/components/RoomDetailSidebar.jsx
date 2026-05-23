import { useState } from 'react';

const RoomDetailSidebar = ({ price, deposit, owner, contact, reference }) => {
  const [showContact, setShowContact] = useState(false);

  return (
    <aside className="room-detail-sidebar">
      <div className="room-detail-sidebar-card dark">
        <p className="room-detail-sidebar-label">Giá thuê hàng tháng</p>
        <p className="room-detail-sidebar-price">{price}</p>
        <p className="room-detail-sidebar-note">Tiền cọc: {deposit}</p>
      </div>

      <div className="room-detail-sidebar-actions">
        <button
          type="button"
          className="room-detail-action primary"
          onClick={() => setShowContact((prev) => !prev)}
        >
          ❤ Quan tâm
        </button>
        <button type="button" className="room-detail-action ghost">🔖 Lưu</button>
      </div>

      {showContact && contact && (
        <div className="room-detail-contact">
          <div className="room-detail-contact-header">
            <p>Thông tin liên hệ</p>
            <button type="button" className="room-detail-contact-close" onClick={() => setShowContact(false)}>×</button>
          </div>
          <div className="room-detail-contact-body">
            <div className="room-detail-contact-avatar">{owner.initials}</div>
            <div className="room-detail-contact-name">{owner.name}</div>
            <div className="room-detail-contact-role">{owner.role}</div>
          </div>
          <button type="button" className="room-detail-contact-btn phone">📞 {contact.phone}</button>
          <button type="button" className="room-detail-contact-btn zalo">💬 {contact.zalo}</button>
          <button type="button" className="room-detail-contact-btn facebook">f {contact.facebook}</button>
          <button type="button" className="room-detail-contact-btn email">✉ {contact.email}</button>
        </div>
      )}

      <div className="room-detail-sidebar-card">
        <div className="room-detail-owner">
          <div className="room-detail-owner-avatar">{owner.initials}</div>
          <div className="room-detail-owner-info">
            <p className="room-detail-owner-name">{owner.name}</p>
            <p className="room-detail-owner-role">{owner.role}</p>
          </div>
        </div>
        <div className="room-detail-owner-note">"{owner.note}"</div>
      </div>

      <div className="room-detail-sidebar-card">
        <h3 className="room-detail-sidebar-title">Thông tin tham khảo</h3>
        <div className="room-detail-reference">
          {reference.map((item) => (
            <div key={item.label} className="room-detail-reference-item">
              <span>{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RoomDetailSidebar;
