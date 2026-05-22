import { Link } from 'react-router-dom';

const RoomDetailNotFound = () => {
  return (
    <div className="room-detail-container">
      <h1 className="room-detail-title">Không tìm thấy phòng</h1>
      <p className="room-detail-subtitle">Phòng bạn chọn không tồn tại hoặc đã bị gỡ.</p>
      <Link to="/find-room" className="room-detail-back">Quay lại danh sách phòng</Link>
    </div>
  );
};

export default RoomDetailNotFound;
