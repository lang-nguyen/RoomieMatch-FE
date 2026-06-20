import { Maximize2, Users, Tag } from 'lucide-react';
import StatusBadge from '../../../shared/components/StatusBadge';
import styles from './LandlordRoomCard.module.css';

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #f4a261, #e76f51)',
  'linear-gradient(135deg, #43aa8b, #277da1)',
  'linear-gradient(135deg, #577590, #4d908e)',
  'linear-gradient(135deg, #f8961e, #f3722c)',
  'linear-gradient(135deg, #f94144, #f3722c)',
];

const getGradient = (id) => CARD_GRADIENTS[(id - 1) % CARD_GRADIENTS.length];

const LandlordRoomCard = ({ room, onEdit, onDelete, onTogglePost }) => {
  const {
    id,
    code,
    room_code,
    name,
    title,
    address,
    full_address,
    area,
    capacity,
    max_people,
    amenities = [],
    price,
    status,
    images = [],
  } = room;

  const displayCode = room_code || code || `TRO-${String(id).padStart(6, '0')}`;
  const displayName = name || title || 'Phong tro';
  const displayAddress = address || full_address || 'Dang cap nhat dia chi';
  const displayCapacity = capacity || max_people || 1;
  const displayPrice = Number(price) || 0;
  const hasThumbnail = images.length > 0;

  return (
    <div className={styles.card}>
      <div
        className={styles.thumbnail}
        style={{ background: hasThumbnail ? undefined : getGradient(id) }}
      >
        {hasThumbnail ? (
          <img src={images[0]} alt={displayName} className={styles.thumbnailImg} />
        ) : (
          <div className={styles.thumbnailPlaceholder}>
            <Maximize2 size={32} color="rgba(255,255,255,0.5)" />
          </div>
        )}

        <span className={styles.codeBadge}>{displayCode}</span>
        <span className={styles.statusBadgeWrapper}>
          <StatusBadge status={status} />
        </span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{displayName}</h3>
        <p className={styles.address}>{displayAddress}</p>

        <div className={styles.chips}>
          <span className={styles.chip}>
            <Maximize2 size={11} />
            {Number(area) || 0} m2
          </span>
          <span className={styles.chip}>
            <Users size={11} />
            {displayCapacity} nguoi
          </span>
          {amenities.slice(0, 2).map((a) => (
            <span key={a} className={styles.chip}>
              <Tag size={11} />
              {a}
            </span>
          ))}
        </div>

        <div className={styles.price}>
          {displayPrice.toLocaleString('vi-VN')}d&nbsp;
          <span className={styles.priceUnit}>/ thang</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.actionLink} onClick={() => onEdit?.(room)}>
          Chi tiet
        </button>
        <button className={styles.actionLink} onClick={() => onEdit?.(room)}>
          Sua
        </button>
        <button
          className={styles.postBtn}
          onClick={() => onTogglePost?.(room)}
        >
          Dung cho bai
        </button>
        {onDelete ? (
          <button className={styles.actionLink} onClick={() => onDelete?.(room)}>
            Xoa
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default LandlordRoomCard;
