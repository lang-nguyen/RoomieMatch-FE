import { AdminIcon } from './adminIconMap';
import { useCountUp } from '../hooks/useCountUp';
import styles from './AdminDashboard.module.css';

const formatValue = (value, format) => {
  if (format === 'currency') {
    return `${new Intl.NumberFormat('vi-VN').format(value)} ₫`;
  }

  return new Intl.NumberFormat('vi-VN').format(value);
};

export const StatCard = ({ stat }) => {
  const animatedValue = useCountUp(stat.value);
  const trendClass = stat.trend === 'down' ? styles.trendDown : styles.trendUp;

  return (
    <article className={`${styles.statCard} ${stat.isPrimary ? styles.statCardPrimary : ''}`}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrap}>
          <AdminIcon name={stat.icon} size={18} />
        </div>
        <span className={`${styles.statTrend} ${trendClass}`}>
          {stat.trend === 'down' ? '↓' : '↑'} {stat.trendLabel}
        </span>
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
      <div className={styles.statValue}>{formatValue(animatedValue, stat.format)}</div>
      <div className={styles.statChange}>{stat.changeLabel}</div>
      <div className={styles.statLink}>
        {stat.linkLabel} <span>→</span>
      </div>
    </article>
  );
};
