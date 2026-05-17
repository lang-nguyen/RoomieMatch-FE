import { Heart, Eye, Trash2, MapPin, Calendar, Maximize } from 'lucide-react';
import styles from './RoomCard.module.css';

const RoomCard = ({ room }) => {
  const { title, image, address, area, dateSaved, status } = room;

  const isAvailable = status === 'Còn trống';

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={image} alt={title} className={styles.image} />
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        
        <div className={styles.details}>
          <div className={`${styles.detailItem} ${styles.address}`}>
            Địa chỉ: {address}
          </div>
          <div className={styles.detailItem}>
            Ngày lưu: {dateSaved}
          </div>
          <div className={styles.detailItem}>
            {area} m²
          </div>
        </div>

        <div className={`${styles.statusTag} ${isAvailable ? styles.statusAvailable : styles.statusRented}`}>
          {status}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          <Heart className={styles.btnIcon} />
          Quan tâm
        </button>
        <button className={`${styles.btn} ${styles.btnSecondary}`}>
          <Eye className={styles.btnIcon} />
          Xem chi tiết
        </button>
        <button className={`${styles.btn} ${styles.btnDanger}`}>
          <Trash2 className={styles.btnIcon} />
          Bỏ lưu
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
