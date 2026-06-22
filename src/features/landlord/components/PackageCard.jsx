import { Check, X } from 'lucide-react';
import styles from './PackageCard.module.css';

const formatPrice = (price) =>
  price.toLocaleString('vi-VN') + 'đ';

const PackageCard = ({ pkg, onSelect, isCarouselActive = false }) => {
  const { name, tier, price, unit, description, isFeatured, badge, features = [], ctaLabel } = pkg;

  return (
    <div
      className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''} ${styles[`card--${tier}`] || ''} ${isCarouselActive ? styles.cardCarouselActive : ''}`}
    >
      {/* Badge */}
      {badge && (
        <span className={`${styles.badge} ${isFeatured ? styles.badgeFeatured : styles.badgePro}`}>
          {badge}
        </span>
      )}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.name}>{name}</div>
        <div className={styles.startLabel}>{description || 'Gói dịch vụ dành cho chủ trọ'}</div>
        <div className={styles.price}>
          <span className={styles.priceAmount}>{formatPrice(price)}</span>
          <span className={styles.priceUnit}>/{unit}</span>
        </div>
      </div>

      {/* Features */}
      <ul className={styles.features}>
        {features.map((f, i) => (
          <li key={i} className={`${styles.featureItem} ${!f.included ? styles.featureExcluded : ''}`}>
            {f.included ? (
              <Check size={13} className={styles.iconCheck} />
            ) : (
              <X size={13} className={styles.iconX} />
            )}
            <span>{f.label}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        className={`${styles.cta} ${isFeatured ? styles.ctaFeatured : styles.ctaDefault}`}
        onClick={() => onSelect?.(pkg)}
      >
        {ctaLabel || 'Thử miễn phí'}
      </button>
    </div>
  );
};

export default PackageCard;
