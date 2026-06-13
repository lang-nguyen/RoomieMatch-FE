import { Pencil, Trash2, Eye, Maximize2, Users, Tag } from 'lucide-react';
import StatusBadge from '../../../shared/components/StatusBadge';
import styles from './LandlordRoomCard.module.css';

// Gradient palettes cho card thumbnail
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #f4a261, #e76f51)',  // warm orange-red
  'linear-gradient(135deg, #43aa8b, #277da1)',  // teal-blue
  'linear-gradient(135deg, #577590, #4d908e)',  // blue-teal
  'linear-gradient(135deg, #f8961e, #f3722c)',  // amber-orange
  'linear-gradient(135deg, #f94144, #f3722c)',  // red-orange
];

const getGradient = (id) => CARD_GRADIENTS[(id - 1) % CARD_GRADIENTS.length];

const LandlordRoomCard = ({ room, onEdit, onDelete, onTogglePost }) => {
  const {
    id,
    code,
    name,
    address,
    area,
    capacity,
    amenities = [],
    price,
    status,
    images = [],
  } = room;

  const hasThumbnail = images.length > 0;

  return (
    <div className={styles.card}>
      {/* Thumbnail */}
      <div
        className={styles.thumbnail}
        style={{ background: hasThumbnail ? undefined : getGradient(id) }}
      >
        {hasThumbnail ? (
          <img src={images[0]} alt={name} className={styles.thumbnailImg} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Maximize2 size={32} color="rgba(255,255,255,0.5)" />
          </div>
        )}

        {/* Code badge */}
        <span className={styles.codeBadge}>{code}</span>

        {/* Status badge */}
        <span className={styles.statusBadgeWrapper}>
          <StatusBadge status={status} />
        </span>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.address}>{address}</p>

        {/* Meta chips */}
        <div className={styles.chips}>
          <span className={styles.chip}>
            <Maximize2 size={11} />
            {area} m²
          </span>
          <span className={styles.chip}>
            <Users size={11} />
            {capacity} người
          </span>
          {amenities.slice(0, 2).map((a) => (
            <span key={a} className={styles.chip}>
              <Tag size={11} />
              {a}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className={styles.price}>
          {price.toLocaleString('vi-VN')}đ&nbsp;
          <span className={styles.priceUnit}>/ tháng</span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button className={styles.actionLink} onClick={() => onEdit?.(room)}>
          Chi tiết
        </button>
        <button className={styles.actionLink} onClick={() => onEdit?.(room)}>
          Sửa
        </button>
        <button
          className={styles.postBtn}
          onClick={() => onTogglePost?.(room)}
        >
          Dùng cho bài
        </button>
      </div>
    </div>
  );
};

export default LandlordRoomCard;
