import { useState } from 'react';
import { Eye, FileText, Home, MessageSquare, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetLandlordStatsQuery } from '../../features/landlord/api/landlordApiMock';
import { BarChart, DonutChart, WeeklyLineChart } from '../../features/landlord/components/StatsCharts';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import styles from './LandlordStatsPage.module.css';

const ICONS = {
  file: FileText,
  home: Home,
  eye: Eye,
  message: MessageSquare,
};

const STATUS_LABELS = {
  rented: 'Đã thuê',
  available: 'Trống',
  negotiating: 'Thương lượng',
};

const formatMoney = (value) => `${value.toLocaleString('vi-VN')} đ`;
const formatNumber = (value) => value.toLocaleString('vi-VN');

const StatCard = ({ item }) => {
  const Icon = ICONS[item.icon] || FileText;
  return (
    <article className={styles.statCard}>
      <div className={styles.cardTop}>
        <span className={styles.cardIcon}><Icon size={18} /></span>
        <em className={styles[item.tone]}>{item.change}</em>
      </div>
      <strong>{formatNumber(item.value)}</strong>
      <span>{item.label}</span>
    </article>
  );
};

const LandlordStatsPage = () => {
  const [range, setRange] = useState('30d');
  const navigate = useNavigate();
  const { data, isLoading } = useGetLandlordStatsQuery({ range });

  if (isLoading || !data) {
    return <div className={styles.loading}>Đang tải thống kê...</div>;
  }

  const totalRooms = data.roomStatus.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={styles.page}>
      <LandlordPageHeader
        icon={Eye}
        title="Thống kê"
        subtitle="Tổng quan bài đăng, lượt xem và hoạt động phòng trọ của bạn"
        actions={(
          <div className={styles.headerActions}>
          {[
            { value: '7d', label: '7 ngày' },
            { value: '30d', label: '30 ngày' },
            { value: '3m', label: '3 tháng' },
          ].map((item) => (
            <button
              key={item.value}
              className={range === item.value ? styles.activeRange : ''}
              onClick={() => setRange(item.value)}
            >
              {item.label}
            </button>
          ))}
          <button className={styles.newPost} onClick={() => navigate('/landlord/posts')}>
            <Plus size={15} />
            Đăng bài mới
          </button>
          </div>
        )}
      />

      <div className={styles.statsGrid}>
        {data.summary.map((item) => <StatCard key={item.id} item={item} />)}
      </div>

      <div className={styles.chartGrid}>
        <section className={`${styles.panel} ${styles.linePanel}`}>
          <h2>Lượt Tương Tác Theo Tuần</h2>
          <p>7 ngày gần nhất</p>
          <div className={styles.legend}>
            <span>Lượt xem</span>
            <span>Lượt liên hệ</span>
          </div>
          <WeeklyLineChart data={data.weeklyInteractions} />
        </section>

        <section className={styles.panel}>
          <h2>Tình Trạng Phòng</h2>
          <p>34 phòng tổng cộng</p>
          <div className={styles.legend}>
            {data.roomStatus.map((item) => (
              <span key={item.label} style={{ '--dot': item.color }}>
                {item.label} ({item.value})
              </span>
            ))}
          </div>
          <DonutChart data={data.roomStatus} total={totalRooms} />
        </section>
      </div>

      <section className={styles.panel}>
        <h2>Hiệu Suất Bài Đăng</h2>
        <p>Lượt xem trong 30 ngày qua</p>
        <BarChart data={data.postPerformance} />
      </section>

      <section className={`${styles.panel} ${styles.roomPanel}`}>
        <div className={styles.roomHead}>
          <div>
            <h2>Chi Tiết Phòng</h2>
            <p>Hiển thị 5 / 34 phòng</p>
          </div>
          <button>Xem tất cả</button>
        </div>
        <div className={styles.roomTableWrap}>
          <table>
            <thead>
              <tr>
                <th>Phòng</th>
                <th>Bài đăng</th>
                <th>Giá thuê</th>
                <th>Lượt xem (30 ngày)</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.roomDetails.map((room) => (
                <tr key={room.id}>
                  <td className={styles.roomCode}>{room.id}</td>
                  <td>{room.post}</td>
                  <td className={styles.price}>{formatMoney(room.price)}</td>
                  <td>
                    <div className={styles.viewsCell}>
                      <span style={{ width: `${Math.min(100, room.views / 7.2)}%` }} />
                      <em>{room.views}</em>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[room.status]}`}>
                      {STATUS_LABELS[room.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default LandlordStatsPage;
