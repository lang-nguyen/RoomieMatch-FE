import { ChevronLeft, MapPin, Phone, Share2, Users, Wallet } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetLandlordRoomByIdQuery } from '../../features/landlord/api/landlordApi';
import LandlordPageHeader from '../../features/landlord/components/LandlordPageHeader';
import StatusBadge from '../../shared/components/StatusBadge';
import sharedStyles from './LandlordPageShared.module.css';
import styles from './LandlordRoomDetailPage.module.css';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

const CostItem = ({ label, value }) => (
  <div className={styles.costItem}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const FactItem = ({ icon: Icon, label, value }) => (
  <div className={styles.factItem}>
    <span className={styles.factIcon}><Icon size={15} /></span>
    <div>
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  </div>
);

const LandlordRoomDetailPage = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { data: room, isLoading, isError } = useGetLandlordRoomByIdQuery({ id: roomId });

  if (isLoading) {
    return <div className={sharedStyles.page}>Dang tai thong tin phong...</div>;
  }

  if (isError || !room) {
    return (
      <div className={sharedStyles.page}>
        <div className={styles.emptyState}>
          <h3>Khong tim thay phong tro</h3>
          <button type="button" className={styles.backBtn} onClick={() => navigate('/landlord/rooms')}>
            Quay lai danh sach
          </button>
        </div>
      </div>
    );
  }

  const address = room.full_address || room.address || 'Dang cap nhat dia chi';
  const images = room.images || [];

  return (
    <div className={`${sharedStyles.page} ${styles.page}`}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate('/landlord/rooms')}>
          <ChevronLeft size={16} />
          Quay lai
        </button>
        <button type="button" className={styles.editBtn} onClick={() => navigate(`/landlord/rooms/${room.id}/edit`)}>
          Sua phong
        </button>
      </div>

      <LandlordPageHeader
        title={room.title || room.name || 'Chi tiet phong tro'}
        subtitle={address}
        actions={<StatusBadge status={room.status} />}
      />

      <div className={styles.gallery}>
        {images.length ? images.map((image, index) => (
          <div key={`${image}-${index}`} className={index === 0 ? styles.heroImage : styles.sideImage}>
            <img src={image} alt={room.title || `Room ${index + 1}`} />
          </div>
        )) : (
          <div className={`${styles.heroImage} ${styles.placeholder}`}>
            <span>Chua co anh phong</span>
          </div>
        )}
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.mainColumn}>
          <div className={styles.panel}>
            <h2>Tong quan phong</h2>
            <div className={styles.factGrid}>
              <FactItem icon={MapPin} label="Dia chi" value={address} />
              <FactItem icon={Users} label="Suc chua" value={`${room.max_people || room.capacity || 1} nguoi`} />
              <FactItem icon={Wallet} label="Loai phong" value={room.room_type || 'Phong tro'} />
              <FactItem icon={Share2} label="Ma phong" value={room.room_code || room.code || `#${room.id}`} />
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Mo ta</h2>
            <p className={styles.description}>{room.description || 'Chua co mo ta cho phong nay.'}</p>
          </div>

          <div className={styles.panel}>
            <h2>Tien ich</h2>
            {room.amenities?.length ? (
              <div className={styles.amenities}>
                {room.amenities.map((item) => <span key={item}>{item}</span>)}
              </div>
            ) : (
              <p className={styles.description}>Chua co tien ich duoc cap nhat.</p>
            )}
          </div>
        </section>

        <aside className={styles.sideColumn}>
          <div className={styles.panel}>
            <h2>Chi phi</h2>
            <div className={styles.costList}>
              <CostItem label="Gia phong" value={formatMoney(room.price)} />
              <CostItem label="Tien coc" value={formatMoney(room.deposit)} />
              <CostItem label="Tien dien" value={formatMoney(room.electricity_price)} />
              <CostItem label="Tien nuoc" value={formatMoney(room.water_price)} />
              <CostItem label="Tien internet" value={formatMoney(room.internet_price)} />
              <CostItem label="Tien gui xe" value={formatMoney(room.parking_price)} />
            </div>
          </div>

          <div className={styles.panel}>
            <h2>Thong tin lien he</h2>
            <div className={styles.contactList}>
              <FactItem icon={Users} label="Nguoi lien he" value={room.contact_name || 'Chua cap nhat'} />
              <FactItem icon={Phone} label="So dien thoai" value={room.contact_phone || 'Chua cap nhat'} />
              <FactItem icon={Share2} label="Kenh khac" value={room.contact_social || 'Chua cap nhat'} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LandlordRoomDetailPage;
