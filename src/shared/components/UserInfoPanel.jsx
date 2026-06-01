import { useState } from 'react';
import { Bell, Shield, Mail, MoreVertical, Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/slice';
import NotificationPanel from '../../features/landlord/components/NotificationPanel';
import VerificationModal from '../../features/landlord/components/VerificationModal';
import styles from './UserInfoPanel.module.css';

/**
 * Right panel hiển thị trong tất cả trang Landlord.
 * Hiển thị: avatar, tên, role, 3 icon tabs, mini chart, danh sách phòng thuộc sở hữu.
 */
const UserInfoPanel = ({ ownedRooms = [], chartData = [] }) => {
  const user = useSelector(selectCurrentUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const displayName = user?.display_name || 'Chủ Trọ';
  const roleLabel = user?.role || 'Chủ Trọ';
  const avatarLetter = displayName?.[0]?.toUpperCase() ?? 'C';

  // Chart defaults nếu không truyền vào
  const bars = chartData.length > 0 ? chartData : [60, 80, 45, 90, 70, 85, 55];

  return (
    <aside className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>Thông Tin Của Bạn</span>
        <button className={styles.moreBtn} aria-label="Thêm tùy chọn">
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Avatar + Info */}
      <div className={styles.profileBlock}>
        <div className={styles.avatarRing}>
          <div className={styles.avatarInner}>
            {user?.avatar ? (
              <img src={user.avatar} alt={displayName} className={styles.avatarImg} />
            ) : (
              <span className={styles.avatarLetter}>{avatarLetter}</span>
            )}
          </div>
        </div>
        <div className={styles.displayName}>{displayName}</div>
        <div className={styles.roleLabel}>{roleLabel}</div>

        {/* Icon tabs */}
        <div className={styles.iconTabs}>
          <button 
            className={`${styles.iconTab} ${showNotifications ? styles.iconTabActive : ''}`} 
            title="Thông báo"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={16} />
          </button>
          <button 
            className={`${styles.iconTab} ${showVerification ? styles.iconTabActive : ''}`} 
            title="Xác thực chủ trọ"
            onClick={() => setShowVerification(true)}
          >
            <Shield size={16} />
          </button>
          <button className={styles.iconTab} title="Tin nhắn">
            <Mail size={16} />
          </button>
        </div>
      </div>

      {/* Modal Xác Thực */}
      <VerificationModal 
        isOpen={showVerification} 
        onClose={() => setShowVerification(false)} 
      />

      {showNotifications ? (
        <div className={styles.notificationWrapper}>
          <NotificationPanel />
        </div>
      ) : (
        <>
          {/* Mini Bar Chart */}
          <div className={styles.chartBlock}>
            <div className={styles.chartBars}>
              {bars.map((h, i) => (
                <div key={i} className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{ height: `${h}%` }}
                    data-index={i}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Owned Rooms */}
          <div className={styles.ownedBlock}>
            <div className={styles.ownedHeader}>
              <span className={styles.ownedTitle}>Phòng Thuộc Sở Hữu Của Bạn</span>
              <button className={styles.addBtn} title="Thêm phòng">
                <Plus size={14} />
              </button>
            </div>

            <div className={styles.ownedList}>
              {ownedRooms.length === 0 ? (
                <div className={styles.emptyOwned}>Chưa có phòng nào</div>
              ) : (
                ownedRooms.map((room) => (
                  <div key={room.id} className={styles.ownedItem}>
                    <div className={styles.ownedAvatar}>
                      <span>{room.code?.slice(-2) ?? 'TR'}</span>
                    </div>
                    <div className={styles.ownedInfo}>
                      <div className={styles.ownedName}>{room.name}</div>
                      <div className={styles.ownedCode}>Mã Trọ: {room.code}</div>
                    </div>
                    <button className={styles.detailBtn}>Chi Tiết</button>
                  </div>
                ))
              )}
            </div>

            {ownedRooms.length > 0 && (
              <button className={styles.viewAllBtn}>Xem tất cả</button>
            )}
          </div>
        </>
      )}
    </aside>
  );
};

export default UserInfoPanel;
