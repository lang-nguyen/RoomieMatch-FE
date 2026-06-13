import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../auth/slice';
import { useGetSavedRoomsQuery, useSavePostMutation, useUnsavePostMutation } from '../../user/api/userApi';
import ConfirmModal from '../../../shared/components/ConfirmModal';
import { X } from 'lucide-react';

const RoomDetailSidebar = ({ price, deposit, owner, contact, reference, roomId }) => {
  const [showContact, setShowContact] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'alert', message: '', title: 'Thông báo' });
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { data: savedRoomsData } = useGetSavedRoomsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [savePost, { isLoading: isSaving }] = useSavePostMutation();
  const [unsavePost, { isLoading: isUnsaving }] = useUnsavePostMutation();
  
  const isSaved = savedRoomsData?.items?.some((item) => String(item.post_id) === String(roomId)) || false;

  const handleAction = (actionCallback) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    actionCallback();
  };

  const handleSaveClick = async () => {
    if (!roomId) return;
    try {
      if (isSaved) {
        await unsavePost(roomId).unwrap();
      } else {
        await savePost(roomId).unwrap();
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      setAlertModal({ isOpen: true, type: 'alert', message: 'Đã xảy ra lỗi khi lưu bài viết. Vui lòng thử lại.', title: 'Lỗi' });
    }
  };

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
          onClick={() => handleAction(() => setShowContact((prev) => !prev))}
        >
          Quan tâm
        </button>
        <button 
          type="button" 
          className="room-detail-action ghost"
          style={{ color: isSaved ? '#D45B13' : 'inherit' }}
          disabled={isSaving || isUnsaving}
          onClick={() => handleAction(handleSaveClick)}
        >
           {isSaved ? 'Đã lưu' : 'Lưu'}
        </button>
      </div>

      {showContact && contact && createPortal(
        <div className="modal-overlay" onClick={() => setShowContact(false)}>
          <div className="room-detail-contact" onClick={(e) => e.stopPropagation()} style={{ width: '90%', maxWidth: '400px', position: 'relative' }}>
            <button type="button" className="modal-close-btn" onClick={() => setShowContact(false)} style={{ position: 'absolute', top: '12px', right: '12px' }}>
              <X size={24} />
            </button>
            <div className="room-detail-contact-header" style={{ justifyContent: 'center' }}>
              <p style={{ fontSize: '18px', margin: 0 }}>Thông tin liên hệ</p>
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
        </div>,
        document.body
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

      <ConfirmModal
        isOpen={showLoginModal}
        title="Yêu cầu đăng nhập"
        message="Vui lòng đăng nhập để xem thông tin liên hệ và lưu phòng!"
        confirmText="Đăng nhập ngay"
        cancelText="Đóng"
        onConfirm={() => navigate('/login', { state: { from: location } })}
        onCancel={() => setShowLoginModal(false)}
      />

      <ConfirmModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        confirmText="Đóng"
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
      />
    </aside>
  );
};

export default RoomDetailSidebar;
