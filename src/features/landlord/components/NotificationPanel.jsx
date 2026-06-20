import { Bell, AlertTriangle } from 'lucide-react';
import { useGetLandlordNotificationsQuery } from '../api/landlordApiMock';
import styles from './NotificationPanel.module.css';

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const NotificationItem = ({ notification }) => {
  const { type, title, message, isAlert, alertLabel, createdAt, read } = notification;

  return (
    <div className={`${styles.item} ${!read ? styles.unread : ''}`}>
      <div className={styles.itemAvatar}>
        {type === 'subscription' ? (
          <AlertTriangle size={14} color="#c1440e" />
        ) : (
          <Bell size={14} color="#888" />
        )}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemTitle}>{title}</div>
        <div className={styles.itemMessage}>{message}</div>
        <div className={styles.itemDate}>{formatDate(createdAt)}</div>
      </div>
      {isAlert && alertLabel && (
        <button className={styles.alertBtn}>{alertLabel}</button>
      )}
    </div>
  );
};

const NotificationPanel = () => {
  const { data, isLoading } = useGetLandlordNotificationsQuery({ page: 1, pageSize: 3 });
  const notifications = data?.items ?? [];

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Đang tải thông báo...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>Không có thông báo nào</div>
        ) : (
          notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))
        )}
      </div>

      <button className={styles.viewMore}>Xem tất cả</button>
    </div>
  );
};

export default NotificationPanel;
