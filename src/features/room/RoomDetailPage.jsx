import { Link, useParams } from 'react-router-dom';
import Header from '../../shared/components/Header';
import Footer from '../../shared/components/Footer';
import { mockRooms } from './mockData/roomMockData';
import { getRoomDetailMock } from './mockData/roomDetailMockData';
import RoomDetailHeader from './components/RoomDetailHeader';
import RoomDetailGallery from './components/RoomDetailGallery';
import RoomDetailHighlights from './components/RoomDetailHighlights';
import RoomDetailDescription from './components/RoomDetailDescription';
import RoomDetailAmenities from './components/RoomDetailAmenities';
import RoomDetailCosts from './components/RoomDetailCosts';
import RoomDetailLocation from './components/RoomDetailLocation';
import RoomDetailReviews from './components/RoomDetailReviews';
import RoomDetailRelated from './components/RoomDetailRelated';
import RoomDetailSidebar from './components/RoomDetailSidebar';
import RoomDetailNotFound from './components/RoomDetailNotFound';
import './RoomDetailPage.css';

const RoomDetailPage = () => {
  const { roomId } = useParams();
  const room = mockRooms.find((item) => String(item.id) === String(roomId));

  const detail = room ? getRoomDetailMock(room) : null;

  if (!room) {
    return (
      <div className="room-detail-page">
        <Header initialActiveId="find-room" />
        <main className="room-detail-content">
          <RoomDetailNotFound />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="room-detail-page">
      <Header initialActiveId="find-room" />
      <main className="room-detail-content">
        <div className="room-detail-container">
          <RoomDetailHeader
            title={room.title}
            breadcrumbs={detail.breadcrumbs}
            address={detail.address}
            badges={detail.badges}
            views={detail.views}
            updatedAt={detail.updatedAt}
          />

          <div className="room-detail-grid">
            <div className="room-detail-main">
              <RoomDetailGallery images={detail.gallery} />
              <RoomDetailHighlights items={detail.summary} />
              <RoomDetailDescription text={detail.description} />
              <RoomDetailAmenities items={detail.amenities} />
              <RoomDetailCosts items={detail.costs} />
              <RoomDetailLocation address={detail.location.address} coords={detail.location.coords} />
              <RoomDetailReviews rating={detail.rating} reviews={detail.reviews} />
              <RoomDetailRelated rooms={detail.relatedRooms} ownerName={detail.owner.name} />
            </div>

            <RoomDetailSidebar
              price="5.000.000 VND / tháng"
              deposit={detail.deposit}
              owner={detail.owner}
              contact={detail.owner.contact}
              reference={detail.reference}
            />
          </div>

          <Link to="/find-room" className="room-detail-back bottom">← Quay lại danh sách phòng</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomDetailPage;
