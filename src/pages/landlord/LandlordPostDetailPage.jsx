import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useGetLandlordPostDetailQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import PostStatusBadge from '../../features/landlord/components/PostStatusBadge';
import RoomDetailHeader from '../../features/room/components/RoomDetailHeader';
import RoomDetailGallery from '../../features/room/components/RoomDetailGallery';
import RoomDetailHighlights from '../../features/room/components/RoomDetailHighlights';
import RoomDetailDescription from '../../features/room/components/RoomDetailDescription';
import RoomDetailAmenities from '../../features/room/components/RoomDetailAmenities';
import RoomDetailCosts from '../../features/room/components/RoomDetailCosts';
import RoomDetailLocation from '../../features/room/components/RoomDetailLocation';
import sharedStyles from './LandlordPageShared.module.css';
import styles from './LandlordPostDetailPage.module.css';

const LandlordPostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useGetLandlordPostDetailQuery({ id: postId });

  if (isLoading) {
    return <div className={sharedStyles.page}>Đang tải thông tin bài đăng...</div>;
  }

  if (isError || !post) {
    return (
      <div className={sharedStyles.page}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Không tìm thấy bài đăng</h3>
          <button onClick={() => navigate('/landlord/posts')} className={styles.backBtn}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const room = post.room || {};
  const createdAtLabel = post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : '--';

  const detail = {
    breadcrumbs: ['Quản lý bài đăng', 'Chi tiết bài đăng', room.room_code || `P${post.id}`],
    address: room.address || '',
    badges: [], // Handled separately for landlord
    views: post.views,
    updatedAt: createdAtLabel,
    gallery: post.images && post.images.length > 0
      ? post.images.map((img) => img.image_url)
      : ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80'],
    summary: [
      { label: 'Diện tích', value: `${room.area || 0} m²` },
      { label: 'Loại hình', value: room.room_type || 'Phòng trọ' },
      { label: 'Tối đa', value: `${room.max_people || 1} người` },
      { label: 'Hiện tại', value: `${room.current_people || 0} người` },
    ],
    title: post.title || room.title,
    description: post.description || room.description || 'Không có mô tả.',
    amenities: post.amenities || [],
    costs: [
      { label: 'Giá phòng', value: `${room.price ? room.price.toLocaleString() : 0} VND`, highlight: true },
      { label: 'Tiền điện', value: `${room.electricity_price ? room.electricity_price.toLocaleString() : 0} VND` },
      { label: 'Tiền nước', value: `${room.water_price ? room.water_price.toLocaleString() : 0} VND` },
      { label: 'Tiền internet', value: `${room.internet_price ? room.internet_price.toLocaleString() : 'Miễn phí'} VND` },
      { label: 'Tiền giữ xe', value: `${room.parking_price ? room.parking_price.toLocaleString() : 'Miễn phí'} VND` },
    ],
    location: {
      address: room.full_address || '',
      coords: `${room.latitude || 0}, ${room.longitude || 0}`,
    },
  };

  return (
    <div className={`${sharedStyles.page} ${styles.pageDetail}`}>
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate('/landlord/posts')}>
          <ChevronLeft size={16} /> Quay lại
        </button>
        <PostStatusBadge status={post.status} subText={post.is_vip ? `Còn ${post.boost_days_left} ngày` : ''} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.mainContent}>
          <RoomDetailHeader
            title={detail.title}
            breadcrumbs={detail.breadcrumbs}
            address={detail.address}
            badges={detail.badges}
            views={detail.views}
            updatedAt={detail.updatedAt}
          />
          <RoomDetailGallery images={detail.gallery} />
          <RoomDetailHighlights items={detail.summary} />
          <RoomDetailDescription text={detail.description} />
          <RoomDetailAmenities items={detail.amenities} />
          <RoomDetailCosts items={detail.costs} />
          <RoomDetailLocation address={detail.location.address} coords={detail.location.coords} />
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Thống kê bài đăng</h3>
            <div className={styles.statRow}>
              <span>Lượt xem</span>
              <strong>{post.views || 0}</strong>
            </div>
            <div className={styles.statRow}>
              <span>Lượt lưu</span>
              <strong>{post.likes || 0}</strong>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <h3 className={styles.sidebarTitle}>Yêu cầu thuê ({post.rental_requests?.length || 0})</h3>
            <div className={styles.requestList}>
              {post.rental_requests?.length > 0 ? (
                post.rental_requests.map((req) => (
                  <div key={req.id} className={styles.requestItem}>
                    <strong>{req.tenant_name}</strong>
                    <span className={`${styles.reqStatus} ${styles[req.status] || ''}`}>{req.status}</span>
                    <p>{new Date(req.start_date).toLocaleDateString('vi-VN')}</p>
                  </div>
                ))
              ) : (
                <p className={styles.emptyText}>Chưa có yêu cầu thuê nào.</p>
              )}
            </div>
            <button className={styles.viewAllBtn} onClick={() => navigate('/landlord/rental-requests')}>
              Quản lý yêu cầu thuê →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LandlordPostDetailPage;
